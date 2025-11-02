import { queryOptions } from "@tanstack/react-query";
import { students } from "../axios/students";

const studentsQuery = () => {
  return queryOptions({
    queryKey: ["students"],
    queryFn: students,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });
};

export { studentsQuery };
