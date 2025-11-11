import { queryOptions } from "@tanstack/react-query";
import {
  getAllStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../axios/students";

export const getAllStudentsQuery = (filters = {}) =>
  queryOptions({
    queryKey: ["students", filters],
    queryFn: () => getAllStudents(filters),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });

export const getStudentQuery = (id) =>
  queryOptions({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    staleTime: 1000 * 60 * 5,
  });
