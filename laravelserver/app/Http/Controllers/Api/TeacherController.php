<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Determine which role to filter by
        $role = $request->string('role')->toString();
        
        if ($role === 'admin') {
            $query = User::admins()->with('teacherProfile.assignedAdmin');
        } else {
            // Default to teachers if no role specified or role is 'teacher'
            $query = User::teachers()->with('teacherProfile.assignedAdmin');
        }

        if ($country = $request->string('country')->toString()) {
            $query->where('country', $country);
        }

        if ($request->filled('accepted')) {
            $query->where('accepted', filter_var($request->input('accepted'), FILTER_VALIDATE_BOOLEAN));
        }

        $profileFilters = [
            'degree' => 'degree',
            'major' => 'major',
            'englishLevel' => 'english_level',
            'hasWebcam' => 'has_webcam',
            'hasBackupInternet' => 'has_backup_internet',
            'hasBackupPower' => 'has_backup_power',
            'hasHeadset' => 'has_headset',
        ];

        foreach ($profileFilters as $inputKey => $column) {
            if ($request->filled($inputKey)) {
                $value = $request->input($inputKey);

                $query->whereHas('teacherProfile', function ($builder) use ($column, $value): void {
                    if (is_bool($value) || $value === 'true' || $value === 'false') {
                        $builder->where($column, filter_var($value, FILTER_VALIDATE_BOOLEAN));
                    } else {
                        $builder->where($column, $value);
                    }
                });
            }
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhereHas('teacherProfile', function ($profileQuery) use ($search): void {
                        $profileQuery->where('first_name', 'like', '%'.$search.'%')
                            ->orWhere('last_name', 'like', '%'.$search.'%');
                    });
            });
        }

        $limit = max(1, min((int) $request->integer('limit', 10), 100));
        $page = (int) $request->integer('page', 1);

        $paginator = $query->orderByDesc('created_at')->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'teachers' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(User $user): JsonResponse
    {
        abort_if(!in_array($user->role, ['teacher', 'admin']), 404);

        $teacher = $this->rememberTeachers('teacher:'.$user->getKey(), function () use ($user) {
            return $user->load([
                'teacherProfile.assignedAdmin',
                'classesTeaching.student',
                'classesTeaching.book',
                'bookAssignments.student',
                'bookAssignments.book',
                'payouts',
            ]);
        });

        return response()->json($teacher);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(['teacher', 'admin'])],
            'country' => ['nullable', 'string', 'max:255'],
            'timezone' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'degree' => ['nullable', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'english_level' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string'],
            'motivation' => ['nullable', 'string'],
            'availability' => ['nullable', 'string'],
            'internet_speed' => ['nullable', 'string', 'max:255'],
            'computer_specs' => ['nullable', 'string', 'max:255'],
            'has_webcam' => ['nullable', 'boolean'],
            'has_headset' => ['nullable', 'boolean'],
            'has_backup_internet' => ['nullable', 'boolean'],
            'has_backup_power' => ['nullable', 'boolean'],
            'teaching_environment' => ['nullable', 'string'],
            'resume_url' => ['nullable', 'url'],
            'intro_video_url' => ['nullable', 'url'],
            'speed_test_screenshot_url' => ['nullable', 'url'],
            'assigned_admin_id' => ['nullable', Rule::exists('users', 'id')->where('role', 'admin')],
            'zoom_link' => ['nullable', 'string', 'max:1024'],
            'birth_day' => ['nullable', 'date'],
            'accepted' => ['nullable', 'boolean'],
        ]);

        $role = $data['role'] ?? 'teacher';
        
        $user = User::create([
            'name' => $data['first_name'].' '.$data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'country' => $data['country'] ?? null,
            'timezone' => $data['timezone'] ?? 'Asia/Manila',
            'role' => $role,
            'accepted' => $data['accepted'] ?? ($role === 'admin' ? true : false), // Admins are accepted by default
        ]);

        // Only create teacher profile for teachers
        $profile = null;
        if ($role === 'teacher') {
            $profile = $this->createOrUpdateProfile($user, $data);
            
            // Send email only for teachers
            Mail::raw(
                "Hi {$profile->first_name},\n\nThank you for submitting your teaching application. Our team will review your profile and reach out within 1–3 days.\n\nBest regards,\nRichEnglish Recruitment Team",
                function ($message) use ($user): void {
                    $message->to($user->email)->subject('Thank you for applying!');
                }
            );
        }

        $this->flushTeachersCache();

        return response()->json([
            'id' => $user->id,
            'message' => ucfirst($role).' created successfully',
        ], JsonResponse::HTTP_CREATED);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        // Allow updating teachers or admins
        abort_if(!in_array($user->role, ['teacher', 'admin']), 404);

        $data = $request->validate([
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'country' => ['nullable', 'string', 'max:255'],
            'timezone' => ['nullable', 'string', 'max:255'],
            'accepted' => ['nullable', 'boolean'],
            'phone' => ['nullable', 'string', 'max:50'],
            'degree' => ['nullable', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'english_level' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string'],
            'motivation' => ['nullable', 'string'],
            'availability' => ['nullable', 'string'],
            'internet_speed' => ['nullable', 'string', 'max:255'],
            'computer_specs' => ['nullable', 'string', 'max:255'],
            'has_webcam' => ['nullable', 'boolean'],
            'has_headset' => ['nullable', 'boolean'],
            'has_backup_internet' => ['nullable', 'boolean'],
            'has_backup_power' => ['nullable', 'boolean'],
            'teaching_environment' => ['nullable', 'string'],
            'resume_url' => ['nullable', 'url'],
            'intro_video_url' => ['nullable', 'url'],
            'speed_test_screenshot_url' => ['nullable', 'url'],
            'assigned_admin_id' => ['nullable', Rule::exists('users', 'id')->where('role', 'admin')],
            'zoom_link' => ['nullable', 'string', 'max:1024'],
            'birth_day' => ['nullable', 'date'],
        ]);

        if (isset($data['first_name'], $data['last_name'])) {
            $user->name = "{$data['first_name']} {$data['last_name']}";
        }

        if (isset($data['email'])) {
            $user->email = $data['email'];
        }

        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if (array_key_exists('country', $data)) {
            $user->country = $data['country'];
        }

        if (array_key_exists('timezone', $data)) {
            $user->timezone = $data['timezone'];
        }

        if (array_key_exists('accepted', $data)) {
            $user->accepted = (bool) $data['accepted'];
        }

        $user->save();

        // Only update teacher profile for teachers
        if ($user->role === 'teacher') {
            $profile = $this->createOrUpdateProfile($user, $data);
        }

        $this->flushTeachersCache();

        return response()->json([
            'message' => ucfirst($user->role).' updated successfully',
            'user' => $user->load('teacherProfile'),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        // Allow deleting teachers or admins
        abort_if(!in_array($user->role, ['teacher', 'admin']), 404);

        $role = $user->role;
        $user->delete();

        $this->flushTeachersCache();

        return response()->json(['message' => ucfirst($role).' deleted successfully']);
    }

    protected function createOrUpdateProfile(User $user, array $data): TeacherProfile
    {
        $profileData = [
            'first_name' => $data['first_name'] ?? ($user->teacherProfile->first_name ?? $user->name),
            'last_name' => $data['last_name'] ?? ($user->teacherProfile->last_name ?? $user->name),
            'phone' => $data['phone'] ?? null,
            'degree' => $data['degree'] ?? null,
            'major' => $data['major'] ?? null,
            'english_level' => $data['english_level'] ?? null,
            'experience' => $data['experience'] ?? null,
            'motivation' => $data['motivation'] ?? null,
            'availability' => $data['availability'] ?? null,
            'internet_speed' => $data['internet_speed'] ?? null,
            'computer_specs' => $data['computer_specs'] ?? null,
            'has_webcam' => $data['has_webcam'] ?? false,
            'has_headset' => $data['has_headset'] ?? false,
            'has_backup_internet' => $data['has_backup_internet'] ?? false,
            'has_backup_power' => $data['has_backup_power'] ?? false,
            'teaching_environment' => $data['teaching_environment'] ?? null,
            'resume_url' => $data['resume_url'] ?? null,
            'intro_video_url' => $data['intro_video_url'] ?? null,
            'speed_test_screenshot_url' => $data['speed_test_screenshot_url'] ?? null,
            'assigned_admin_id' => $data['assigned_admin_id'] ?? null,
            'zoom_link' => $data['zoom_link'] ?? null,
            'birth_day' => $data['birth_day'] ?? null,
        ];

        $booleanKeys = ['has_webcam', 'has_headset', 'has_backup_internet', 'has_backup_power'];

        foreach ($booleanKeys as $booleanKey) {
            if (array_key_exists($booleanKey, $data)) {
                $profileData[$booleanKey] = filter_var($data[$booleanKey], FILTER_VALIDATE_BOOLEAN);
            }
        }

        return $user->teacherProfile()
            ->updateOrCreate(['user_id' => $user->id], $profileData);
    }

    protected function flushTeachersCache(): void
    {
        if ($this->cacheStoreSupportsTags()) {
            Cache::tags('teachers')->flush();

            return;
        }

        Cache::forget('teacher:index');
    }

    protected function rememberTeachers(string $key, callable $callback)
    {
        if ($this->cacheStoreSupportsTags()) {
            return Cache::tags('teachers')->remember($key, now()->addMinutes(5), $callback);
        }

        return Cache::remember('teacher:'.$key, now()->addMinutes(5), $callback);
    }

    public function teacherApplication(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|max:20',
            'degree' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'english_level' => 'required|string|in:Native,Advanced,Intermediate,Basic',
            'experience' => 'required|string|max:2000',
            'motivation' => 'required|string|max:2000',
            'availability' => 'required|string|max:500',
            'internet_speed' => 'required|string|max:255',
            'computer_specs' => 'required|string|max:1000',
            'has_webcam' => 'boolean',
            'has_headset' => 'boolean',
            'has_backup_internet' => 'boolean',
            'has_backup_power' => 'boolean',
            'teaching_environment' => 'required|string|max:1000',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'intro_video' => 'required|file|mimes:mp4,avi,mov,wmv|max:51200',
            'speed_test_screenshot' => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        try {
            // Store files
            $resumePath = $request->file('resume')->store('teacher-applications/resumes', 'public');
            $introVideoPath = $request->file('intro_video')->store('teacher-applications/videos', 'public');
            $screenshotPath = $request->file('speed_test_screenshot')->store('teacher-applications/screenshots', 'public');

            $resumeUrl = Storage::disk('public')->url($resumePath);
            $introVideoUrl = Storage::disk('public')->url($introVideoPath);
            $speedTestScreenshotUrl = Storage::disk('public')->url($screenshotPath);

            // Create user with teacher role (not accepted yet)
            // Match legacy: no status field set, defaults to 'active' in enum
            // Password will be set when teacher is accepted
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make(Str::random(16)), // Temporary password, will be reset when accepted
                'role' => 'teacher',
                'accepted' => false,
                'meta' => [
                    'teacher_application_status' => 'pending',
                    'teacher_application_files' => [
                        'resume' => $resumePath,
                        'intro_video' => $introVideoPath,
                        'speed_test_screenshot' => $screenshotPath,
                    ],
                ],
            ]);

            // Create teacher profile
            $profile = TeacherProfile::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'degree' => $validated['degree'],
                'major' => $validated['major'],
                'english_level' => $validated['english_level'],
                'experience' => $validated['experience'],
                'motivation' => $validated['motivation'],
                'availability' => $validated['availability'],
                'internet_speed' => $validated['internet_speed'],
                'computer_specs' => $validated['computer_specs'],
                'has_webcam' => filter_var($validated['has_webcam'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'has_headset' => filter_var($validated['has_headset'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'has_backup_internet' => filter_var($validated['has_backup_internet'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'has_backup_power' => filter_var($validated['has_backup_power'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'teaching_environment' => $validated['teaching_environment'],
                'resume_url' => $resumeUrl,
                'intro_video_url' => $introVideoUrl,
                'speed_test_screenshot_url' => $speedTestScreenshotUrl,
            ]);

            // Send confirmation email to applicant (matching legacy)
            try {
                Mail::raw(
                    "Hi {$validated['first_name']},\n\nThank you for submitting your teaching application. Our team will review your profile and get back to you within 1–3 days.\n\nBest regards,\nThe Recruitment Team",
                    function ($message) use ($validated) {
                        $message->to($validated['email'])
                            ->subject('Thank you for applying!');
                    }
                );
            } catch (\Exception $e) {
                \Log::warning('Failed to send teacher application confirmation email: ' . $e->getMessage());
            }

            return response()->json([
                'id' => $user->id,
                'message' => 'Application submitted successfully! You will receive an email within 1-3 days regarding the next step.',
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Teacher application error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to submit application. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    protected function cacheStoreSupportsTags(): bool
    {
        $store = Cache::getStore();

        return method_exists($store, 'tags');
    }
}
