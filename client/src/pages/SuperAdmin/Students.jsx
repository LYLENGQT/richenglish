import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { getAllStudentsQuery } from "@/lib/reaactquery/students";
import { addStudent, updateStudent, deleteStudent } from "@/lib/axios/students";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DynamicTable } from "@/components/table/DynamicTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Students = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery(getAllStudentsQuery());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const addMutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      toast.success("Student added successfully");
      queryClient.invalidateQueries(["students"]);
      setOpenDialog(false);
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.msg || "Add failed"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }) => updateStudent(id, payload),
    onSuccess: () => {
      toast.success("Student updated successfully");
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student"]);
      setOpenDialog(false);
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.msg || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      toast.success("Student deleted");
      queryClient.invalidateQueries(["students"]);
    },
    onError: () => toast.error("Delete failed"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-96 mb-12 mt-5" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load students");
  }

  const handleAddClick = () => {
    reset({
      name: "",
      age: "",
      nationality: "",
      email: "",
      category_level: "",
      class_type: "",
      platform: "Zoom",
      platform_link: "",
    });
    setSelectedStudent(null);
    setOpenDialog(true);
  };

  const handleEditClick = (student) => {
    reset(student);
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This student will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (formData) => {
    if (!formData.student_identification) {
      delete formData.student_identification;
    }

    if (selectedStudent) {
      updateMutation.mutate({ id: selectedStudent._id, ...formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Students</h1>
        <Button onClick={handleAddClick}>Add Student</Button>
      </div>

      <DynamicTable
        data={data?.students}
        excludeColumns={[
          "_id",
          "teacher_id",
          "updated_at",
          "createdAt",
          "class_type",
          "book_type",
          "updatedAt",
        ]}
        pagination={false}
        actions={[
          {
            label: "View",
            onClick: (row) =>
              navigate(`/portal/super-admin/students/${row._id}`),
            variant: "link",
          },
          {
            label: "Edit",
            onClick: (row) => handleEditClick(row),
            variant: "default",
          },
          {
            label: "Delete",
            onClick: (row) => handleDeleteClick(row._id),
            variant: "destructive",
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

      {/* Add / Update Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? "Update Student" : "Add Student"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  {...register("name", { required: true })}
                />
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  {...register("age")}
                />
              </div>

              {/* Nationality */}
              <div>
                <Label htmlFor="nationality">
                  Nationality <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("nationality", value)}
                  defaultValue={watch("nationality")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KOREAN">Korean</SelectItem>
                    <SelectItem value="CHINESE">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  {...register("email")}
                />
              </div>

              {/* Category Level */}
              <div>
                <Label htmlFor="category_level">Category Level</Label>
                <Input
                  id="category_level"
                  placeholder="e.g., Beginner, Intermediate"
                  {...register("category_level")}
                />
              </div>

              {/* Class Type */}
              <div>
                <Label htmlFor="class_type">Class Type</Label>
                <Input
                  id="class_type"
                  placeholder="e.g., Group, Individual"
                  {...register("class_type")}
                />
              </div>

              {/* Platform */}
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  onValueChange={(value) => setValue("platform", value)}
                  defaultValue={watch("platform") || "Zoom"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Zoom">Zoom</SelectItem>
                    <SelectItem value="Voov">Voov</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Link */}
              <div className="col-span-2">
                <Label htmlFor="platform_link">Platform Link</Label>
                <Input
                  id="platform_link"
                  placeholder="https://zoom.us/j/..."
                  {...register("platform_link")}
                />
              </div>

              {/* Student Identification (optional, auto-generated if empty) */}
              <div className="col-span-2">
                <Label htmlFor="student_identification">
                  Student ID{" "}
                  <span className="text-xs text-gray-500">
                    (Leave empty to auto-generate)
                  </span>
                </Label>
                <Input
                  id="student_identification"
                  placeholder="Auto-generated if empty"
                  {...register("student_identification")}
                  disabled={!selectedStudent}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addMutation.isLoading || updateMutation.isLoading}
              >
                {selectedStudent
                  ? updateMutation.isLoading
                    ? "Updating..."
                    : "Update"
                  : addMutation.isLoading
                  ? "Adding..."
                  : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
