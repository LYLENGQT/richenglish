import React, { useState } from "react";
import useAuthStore from "../../lib/zustand/authStore";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { DynamicTable } from "@/components/table/DynamicTable";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { studentsQuery } from "@/lib/reaactquery/students";

const Students = () => {
  const { data, isLoading, error } = useQuery({
    ...studentsQuery(),
  });
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="w-full h-96 mb-12 mt-5" />
          <Skeleton className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-500">Manage Students</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-auto">
        <DynamicTable
          data={data.students}
          excludeColumns={[
            "id",
            "teacher_id",
            "updated_at",
            "created_at",
            "manager_type",
            "class_type",
            "book_type",
            "book",
          ]}
          pagination={true}
          actions={[
            {
              label: "View",
              onClick: (row) => navigate(`/portal/admin/students/${row.id}`),
              variant: "link",
            },
          ]}
          columns={[
            {
              accessorKey: "nationality",
              header: "Nationality",
              cell: ({ row }) => (
                <Badge variant="default">{row.original.nationality}</Badge>
              ),
            },
            {
              accessorKey: "student_identification",
              header: "ID",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Students;
