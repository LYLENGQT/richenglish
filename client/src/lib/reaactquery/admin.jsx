import { queryOptions } from "@tanstack/react-query";

const dashboardQuery = () => {
  return queryOptions({
    queryKey: ["dashboard"],
    queryFn: dashboard,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });
};

export { dashboardQuery };
