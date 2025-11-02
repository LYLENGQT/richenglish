import { DynamicTable } from "@/components/table/DynamicTable";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const teachers = [
  {
    id: "TA-2025-W707NF",
    firstName: "Samantha",
    lastName: "Lopez",
    email: "pinoxe3169@dwakm.com",
    phone: "+63 912 345 6789",
    degree: "Bachelor of Education",
    specialization: "English Language",
    level: "C2",
    experience: "3 years teaching ESL to Korean and Japanese students",
    bio: "I want to share my knowledge and help students grow",
    availability: "Weekdays 8AM–5PM",
    internet: "50 Mbps Fiber Connection",
    equipment: "Intel i5, 8GB RAM, Windows 11",
    certificates: 1,
    trainings: 1,
    courses: 1,
    references: 1,
    workspace: "Quiet, bright room with plain background",
    resume: "uploads/resumes/samantha_lopez.pdf",
    introVideo: "uploads/videos/samantha_intro.mp4",
    speedTest: "uploads/speedtests/samantha_speed.png",
    status: "pending",
    createdAt: "2025-11-02T01:16:05Z",
  },
  {
    id: "TA-2025-Q893KL",
    firstName: "Michael",
    lastName: "Tan",
    email: "michael.tan@example.com",
    phone: "+63 921 987 6543",
    degree: "Bachelor of Arts",
    specialization: "Mathematics",
    level: "B2",
    experience: "2 years teaching high school math online",
    bio: "Passionate about making math easy and fun",
    availability: "Weekends 9AM–3PM",
    internet: "30 Mbps Fiber Connection",
    equipment: "Intel i7, 16GB RAM, Windows 10",
    certificates: 1,
    trainings: 1,
    courses: 0,
    references: 1,
    workspace: "Home office with whiteboard",
    resume: "uploads/resumes/michael_tan.pdf",
    introVideo: "uploads/videos/michael_intro.mp4",
    speedTest: "uploads/speedtests/michael_speed.png",
    status: "approved",
    createdAt: "2025-10-30T10:45:00Z",
  },
  {
    id: "TA-2025-R234XZ",
    firstName: "Ana",
    lastName: "Santos",
    email: "ana.santos@example.com",
    phone: "+63 913 456 7890",
    degree: "Bachelor of Science",
    specialization: "Physics",
    level: "C1",
    experience: "4 years teaching high school physics online",
    bio: "Focused on helping students understand complex concepts",
    availability: "Weekdays 6PM–9PM",
    internet: "40 Mbps Fiber Connection",
    equipment: "AMD Ryzen 5, 16GB RAM, Windows 11",
    certificates: 2,
    trainings: 2,
    courses: 1,
    references: 2,
    workspace: "Quiet room with natural lighting",
    resume: "uploads/resumes/ana_santos.pdf",
    introVideo: "uploads/videos/ana_intro.mp4",
    speedTest: "uploads/speedtests/ana_speed.png",
    status: "pending",
    createdAt: "2025-11-01T15:20:30Z",
  },
];

const Teachers = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-auto">
        <DynamicTable
          data={teachers}
          excludeColumns={[
            "resume",
            "introVideo",
            "speedTest",
            "createdAt",
            "workspace",
            "equipment",
            "internet",
            "status",
            "experience",
            "bio",
            "references",
            "courses",
            "trainings",
            "certificates",
          ]}
          actions={[
            {
              label: "View",
              onClick: (row) => navigate(`/portal/admin/teachers/${row.id}`),
              variant: "link",
            },
          ]}
          columns={[
            {
              accessorKey: "id",
              header: "ID",
            },
            {
              accessorKey: "level",
              header: "level",
              cell: ({ row }) => (
                <Badge variant="default">{row.original.level}</Badge>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Teachers;
