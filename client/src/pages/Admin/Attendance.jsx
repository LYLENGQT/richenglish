import { DynamicTable } from "@/components/table/DynamicTable";
import React from "react";
import { useNavigate } from "react-router-dom";
const attendance = [
  {
    id: "10f6fb0eac",
    class_id: "10f4a38fac",
    student_id: "0f128595ab",
    teacher_id: "0f0b61dfab",
    teacher_email: "teacher.mitch@richenglish.com",
    teacher_name: "Teacher Mitch",
    date: "2025-10-18",
    status: "present",
    minutes_attended: 30,
    notes: "On time",
    created_at: "2025-10-18T23:35:25Z",
  },
  {
    id: "10f73e74ac",
    class_id: "10f4b3ceac",
    student_id: "0f1293e9ab",
    teacher_id: "0f0b61dfab",
    teacher_email: "teacher.mitch@richenglish.com",
    teacher_name: "Teacher Mitch",
    date: "2025-10-18",
    status: "absent",
    minutes_attended: 0,
    notes: "No show",
    created_at: "2025-10-18T23:35:25Z",
  },
  {
    id: "10f84a12bc",
    class_id: "10f4c12def",
    student_id: "0f1301a2bc",
    teacher_id: "0f0b61dfab",
    teacher_email: "teacher.mitch@richenglish.com",
    teacher_name: "Teacher Mitch",
    date: "2025-10-19",
    status: "present",
    minutes_attended: 45,
    notes: "Joined late 5 mins",
    created_at: "2025-10-19T10:15:40Z",
  },
  {
    id: "10f95b23cd",
    class_id: "10f4d34ghc",
    student_id: "0f1312b3cd",
    teacher_id: "0f0b61dfab",
    teacher_email: "teacher.mitch@richenglish.com",
    teacher_name: "Teacher Mitch",
    date: "2025-10-19",
    status: "absent",
    minutes_attended: 0,
    notes: "No show",
    created_at: "2025-10-19T10:15:40Z",
  },
];

const Attendance = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-auto">
        <DynamicTable
          data={attendance}
          excludeColumns={[
            "id",
            "class_id",
            "student_id",
            "teacher_id",
            "created_at",
          ]}
          actions={[
            {
              label: "View",
              onClick: (row) => navigate(`/portal/admin/attendance/${row.id}`),
              variant: "link",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Attendance;
