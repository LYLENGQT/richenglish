import { queryOptions } from "@tanstack/react-query";
import { dashboard, students } from "../axios/teacher";
import { classes } from "@/lib/axios/classes";

const dashboardQuery = () => {
  return queryOptions({
    queryKey: ["dashboard"],
    queryFn: dashboard,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });
};

const studentsQuery = (id) => {
  return queryOptions({
    queryKey: ["students", id],
    queryFn: () => students(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });
};

const classesQuery = () => {
  return queryOptions({
    queryKey: ["classes"],
    queryFn: classes,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });
};

export { dashboardQuery, studentsQuery, classesQuery };
