<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Book;
use App\Models\BookAssignment;
use App\Models\ClassSchedule;
use App\Models\Payout;
use App\Models\Recording;
use App\Models\Screenshot;
use App\Models\Student;
use App\Models\TeacherProfile;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RichEnglishSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $superAdmin = User::create([
                'name' => 'Super Admin',
                'email' => 'richenglish@admin.com',
                'password' => Hash::make('password'),
                'role' => 'super-admin',
                'country' => 'PH',
                'status' => 'active',
                'timezone' => 'Asia/Manila',
                'accepted' => true,
                'email_verified_at' => now(),
            ]);

            $admin = User::create([
                'name' => 'Admin User',
                'email' => 'admin@richenglish.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'country' => 'PH',
                'status' => 'active',
                'timezone' => 'Asia/Manila',
                'accepted' => true,
                'email_verified_at' => now(),
            ]);

            $teacher = User::create([
                'name' => 'Teacher Mitch',
                'email' => 'teacher.mitch@richenglish.com',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'country' => 'PH',
                'status' => 'active',
                'timezone' => 'Asia/Manila',
                'accepted' => true,
                'email_verified_at' => now(),
            ]);

            $teacherProfile = TeacherProfile::create([
                'user_id' => $teacher->id,
                'first_name' => 'Mitch',
                'last_name' => 'Santos',
                'phone' => '09171234567',
                'degree' => 'BA English',
                'major' => 'Linguistics',
                'english_level' => 'C1',
                'experience' => '2 years',
                'motivation' => 'I love teaching English to kids.',
                'availability' => 'Mon–Fri, 8AM–5PM',
                'internet_speed' => '100 Mbps',
                'computer_specs' => 'Intel i5, 16GB RAM',
                'has_webcam' => true,
                'has_headset' => true,
                'has_backup_internet' => true,
                'has_backup_power' => true,
                'teaching_environment' => 'Quiet room with proper lighting',
                'resume_url' => 'https://drive.google.com/file/d/teacher-resume-id/view',
                'intro_video_url' => 'https://drive.google.com/file/d/teacher-intro-id/view',
                'speed_test_screenshot_url' => 'https://drive.google.com/file/d/teacher-speedtest-id/view',
                'assigned_admin_id' => $admin->id,
                'zoom_link' => 'https://zoom.us/j/123456789',
                'birth_day' => '1990-08-21',
            ]);

            $admin->assignedTeachers()->sync([$teacher->id]);

            $studentsSeed = [
                [
                    'student_identification' => Student::generateIdentifier(),
                    'name' => 'Joey',
                    'age' => null,
                    'nationality' => 'KOREAN',
                    'manager_type' => 'KM',
                    'email' => null,
                    'preferred_book' => null,
                    'category_level' => 'Adult',
                    'class_type' => 'Zoom',
                    'platform' => 'Zoom',
                    'platform_link' => null,
                ],
                [
                    'student_identification' => Student::generateIdentifier(),
                    'name' => 'Kory (Domyung)',
                    'age' => 49,
                    'nationality' => 'KOREAN',
                    'manager_type' => 'KM',
                    'email' => 'km300xl@naver.com',
                    'preferred_book' => 'Free-talking',
                    'category_level' => 'Adult Novice - Lvl 3',
                    'class_type' => 'Zoom',
                    'platform' => 'Zoom',
                    'platform_link' => null,
                ],
                [
                    'student_identification' => Student::generateIdentifier(),
                    'name' => 'Anna-W2',
                    'age' => 45,
                    'nationality' => 'CHINESE',
                    'manager_type' => 'CM',
                    'email' => null,
                    'preferred_book' => 'Business English Communication 2',
                    'category_level' => 'Adult Novice - Lvl 3',
                    'class_type' => 'Voov',
                    'platform' => 'Voov',
                    'platform_link' => 'VOOV link',
                ],
            ];

            $students = collect($studentsSeed)->map(function (array $data) {
                return Student::create($data);
            })->values();

            $books = collect([
                [
                    'title' => 'Business English Communication 2',
                    'filename' => 'business_eng2.pdf',
                    'original_filename' => 'business_eng2_orig.pdf',
                    'path' => 'uploads/books/business_eng2.pdf',
                ],
                [
                    'title' => 'Everyone, Speak! Intermediate 2',
                    'filename' => 'everyone_speak_int2.pdf',
                    'original_filename' => 'everyone_speak_int2_orig.pdf',
                    'path' => 'uploads/books/everyone_speak_int2.pdf',
                ],
                [
                    'title' => "Let's Go 3(5th Ed)",
                    'filename' => 'letsgo3.pdf',
                    'original_filename' => 'letsgo3_original.pdf',
                    'path' => 'uploads/books/letsgo3.pdf',
                ],
                [
                    'title' => 'Oxford Phonics World 3',
                    'filename' => 'oxford_phonics_3.pdf',
                    'original_filename' => 'oxford_phonics_3_orig.pdf',
                    'path' => 'uploads/books/oxford_phonics_3.pdf',
                ],
                [
                    'title' => 'Reading Sketch 1',
                    'filename' => 'reading_sketch_1.pdf',
                    'original_filename' => 'reading_sketch_1_orig.pdf',
                    'path' => 'uploads/books/reading_sketch_1.pdf',
                ],
            ])->map(function (array $data) use ($superAdmin) {
                return Book::create($data + ['uploaded_by' => $superAdmin->id]);
            })->values();

            $classEntries = [
                [
                    'student' => $students->get(0),
                    'book' => $books->get(0),
                    'type' => 'schedule',
                    'start_date' => '2025-11-05',
                    'end_date' => '2025-11-05',
                    'start_time' => '10:00',
                    'end_time' => '11:00',
                    'duration' => 60,
                    'platform_link' => 'https://zoom.us/j/1234567890',
                    'reoccurring_days' => null,
                ],
                [
                    'student' => $students->get(0),
                    'book' => $books->get(0),
                    'type' => 'reoccurring',
                    'start_date' => null,
                    'end_date' => null,
                    'start_time' => '14:00',
                    'end_time' => '15:00',
                    'duration' => 60,
                    'platform_link' => 'https://zoom.us/j/2345678901',
                    'reoccurring_days' => ['M', 'W', 'F'],
                ],
                [
                    'student' => $students->get(0),
                    'book' => $books->get(0),
                    'type' => 'makeupClass',
                    'start_date' => '2025-11-06',
                    'end_date' => '2025-11-06',
                    'start_time' => '16:00',
                    'end_time' => '17:00',
                    'duration' => 60,
                    'platform_link' => 'https://zoom.us/j/3456789012',
                    'reoccurring_days' => null,
                    'reason' => 'Student was absent on 2025-11-03',
                    'note' => 'Make-up for missed grammar lesson',
                ],
            ];

            $classes = collect();
            foreach ($classEntries as $data) {
                $classes->push(ClassSchedule::create([
                    'teacher_id' => $teacher->id,
                    'student_id' => $data['student']->id,
                    'book_id' => $data['book']->id,
                    'type' => $data['type'],
                    'start_date' => $data['start_date'],
                    'end_date' => $data['end_date'],
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'duration' => $data['duration'],
                    'reoccurring_days' => $data['reoccurring_days'],
                    'platform_link' => $data['platform_link'],
                    'reason' => $data['reason'] ?? null,
                    'note' => $data['note'] ?? null,
                    'original_class_id' => null,
                    'created_by' => $superAdmin->id,
                ]));
            }

            // Ensure classes collection is properly indexed
            $classes = $classes->values();

            $makeupClass = $classes->firstWhere('type', 'makeupClass');
            $primaryClass = $classes->first();
            if ($makeupClass && $primaryClass) {
                $makeupClass->update(['original_class_id' => $primaryClass->id]);
            }

            $attendances = collect([
                [
                    'class' => $classes->get(0),
                    'date' => '2025-11-05',
                    'duration' => 60,
                    'start_time' => '10:00',
                    'end_time' => '11:00',
                    'minutes_attended' => 55,
                    'hours' => 0.92,
                    'notes' => 'Student joined 5 minutes late but participated actively.',
                ],
                [
                    'class' => $classes->get(1),
                    'date' => '2025-11-06',
                    'duration' => 60,
                    'start_time' => '14:00',
                    'end_time' => '15:00',
                    'minutes_attended' => 60,
                    'hours' => 1.0,
                    'notes' => 'Perfect attendance. Student performed well in pronunciation drills.',
                ],
            ])->map(function (array $data) use ($teacher) {
                return Attendance::create([
                    'teacher_id' => $teacher->id,
                    'student_id' => $data['class']->student_id,
                    'class_id' => $data['class']->id,
                    'date' => $data['date'],
                    'duration' => $data['duration'],
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'minutes_attended' => $data['minutes_attended'],
                    'hours' => $data['hours'],
                    'notes' => $data['notes'],
                ]);
            })->values();

            $recordingEntries = [
                [
                    'class' => $classes->get(0),
                    'attendance' => $attendances->get(0),
                    'path' => 'uploads/recordings/class101_session1.mp4',
                    'filename' => 'class101_session1.mp4',
                ],
                [
                    'class' => $classes->get(1),
                    'attendance' => $attendances->get(1),
                    'path' => 'uploads/recordings/class102_session2.mp4',
                    'filename' => 'class102_session2.mp4',
                ],
            ];

            foreach ($recordingEntries as $entry) {
                Recording::create([
                    'class_id' => $entry['class']->id,
                    'attendance_id' => $entry['attendance']->id,
                    'uploaded_by' => $teacher->id,
                    'path' => $entry['path'],
                    'filename' => $entry['filename'],
                    'drive' => [
                        'webViewLink' => 'https://drive.google.com',
                        'src' => null,
                    ],
                ]);
            }

            $screenshotEntries = [
                [
                    'class' => $classes->get(0),
                    'attendance' => $attendances->get(0),
                    'path' => 'uploads/screenshots/class1/screenshot1.png',
                ],
                [
                    'class' => $classes->get(0),
                    'attendance' => $attendances->get(0),
                    'path' => 'uploads/screenshots/class1/screenshot2.png',
                ],
            ];

            foreach ($screenshotEntries as $entry) {
                Screenshot::create([
                    'class_id' => $entry['class']->id,
                    'attendance_id' => $entry['attendance']->id,
                    'uploaded_by' => $teacher->id,
                    'path' => $entry['path'],
                    'filename' => basename($entry['path']),
                    'drive' => [
                        'webViewLink' => 'https://drive.google.com',
                        'src' => null,
                    ],
                ]);
            }

            $payoutEntries = [
                [
                    'start_date' => '2025-11-01',
                    'end_date' => '2025-11-15',
                    'duration' => 600,
                    'total_class' => 10,
                    'status' => 'pending',
                ],
                [
                    'start_date' => '2025-10-15',
                    'end_date' => '2025-10-31',
                    'duration' => 540,
                    'total_class' => 9,
                    'status' => 'completed',
                ],
                [
                    'start_date' => '2025-11-16',
                    'end_date' => '2025-11-30',
                    'duration' => 480,
                    'total_class' => 8,
                    'status' => 'processing',
                ],
            ];

            foreach ($payoutEntries as $entry) {
                Payout::create([
                    'teacher_id' => $teacher->id,
                    'start_date' => $entry['start_date'],
                    'end_date' => $entry['end_date'],
                    'duration' => $entry['duration'],
                    'total_class' => $entry['total_class'],
                    'incentives' => 0,
                    'amount' => 0,
                    'status' => $entry['status'],
                ]);
            }

            $assignmentEntries = [
                [$students->get(0), $teacher, $books->get(0), $admin],
                [$students->get(1), $teacher, $books->get(1), $superAdmin],
                [$students->get(2), $teacher, $books->get(2), $admin],
            ];

            foreach ($assignmentEntries as $entry) {
                BookAssignment::create([
                    'student_id' => $entry[0]->id,
                    'teacher_id' => $entry[1]->id,
                    'book_id' => $entry[2]->id,
                    'assigned_by' => $entry[3]->id,
                ]);
            }

            $notifications = [
                'You have an offline student who missed today’s class.' => 'offline_alert',
                'Your class schedule for Friday has been updated.' => 'schedule_update',
                'Your payout for October has been processed successfully.' => 'payout_notice',
            ];

            foreach ($notifications as $message => $type) {
                UserNotification::create([
                    'user_id' => $teacher->id,
                    'type' => $type,
                    'message' => $message,
                    'is_read' => $type === 'schedule_update',
                    'payload' => null,
                ]);
            }
        });
    }
}

