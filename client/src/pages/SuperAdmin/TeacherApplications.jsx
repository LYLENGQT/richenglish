import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import toast from "react-hot-toast";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

const TeacherApplications = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["teacher-applications"],
    queryFn: async () => {
      const response = await api.get("/teacher-applications", {
        params: { status: "pending" },
      });
      return response.data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      api.patch(`/teacher-applications/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["teacher-applications"]);
      toast.success("Application updated");
    },
    onError: (error) => {
      const message = error?.response?.data?.msg || "Update failed";
      toast.error(message);
    },
  });

  const pendingCount = useMemo(
    () => data.filter((item) => item.status === "pending").length,
    [data]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Teacher Applications
            </h1>
            <p className="text-sm text-slate-500">
              Review and approve new teacher applicants.
            </p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Pending: {pendingCount}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Qualifications
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Availability & Experience
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>
                    Loading applications...
                  </td>
                </tr>
              )}

              {!isLoading && data.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>
                    No applications yet.
                  </td>
                </tr>
              )}

              {data.map((application) => (
                <tr key={application.id} className="text-sm text-slate-700">
                  <td className="max-w-xs px-4 py-4">
                    <div className="font-semibold text-slate-900">
                      {application.first_name} {application.last_name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {application.email}
                    </div>
                    {application.phone && (
                      <div className="text-xs text-slate-500">
                        {application.phone}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-slate-400">
                      Applied {new Date(application.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-4 space-y-1">
                    {application.degree && (
                      <div className="text-slate-700">
                        <span className="font-medium">Degree:</span> {application.degree}
                      </div>
                    )}
                    {application.major && (
                      <div className="text-slate-700">
                        <span className="font-medium">Major:</span> {application.major}
                      </div>
                    )}
                    {application.english_level && (
                      <div className="text-slate-700">
                        <span className="font-medium">English Level:</span> {application.english_level}
                      </div>
                    )}
                    <div className="text-xs text-slate-500">
                      {application.has_webcam ? "• Webcam" : ""}
                      {application.has_headset ? " • Headset" : ""}
                      {application.has_backup_internet ? " • Backup Internet" : ""}
                      {application.has_backup_power ? " • Backup Power" : ""}
                    </div>
                    {application.resume_file && (
                      <div className="text-xs text-slate-400">
                        Resume: {application.resume_file}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 space-y-3">
                    {application.availability && (
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          Availability
                        </div>
                        <p className="text-slate-700">{application.availability}</p>
                      </div>
                    )}
                    {application.experience && (
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          Experience
                        </div>
                        <p className="text-slate-700">{application.experience}</p>
                      </div>
                    )}
                    {application.motivation && (
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          Motivation
                        </div>
                        <p className="text-slate-700">{application.motivation}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[application.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {application.status}
                    </span>
                    {application.teaching_environment && (
                      <div className="mt-2 text-xs text-slate-500">
                        {application.teaching_environment}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        onClick={() =>
                          updateStatus.mutate({ id: application.id, status: "rejected" })
                        }
                        disabled={application.status === "rejected" || updateStatus.isLoading}
                        className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          updateStatus.mutate({ id: application.id, status: "approved" })
                        }
                        disabled={application.status === "approved" || updateStatus.isLoading}
                        className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherApplications;

