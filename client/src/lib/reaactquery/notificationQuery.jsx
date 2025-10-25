import { queryOptions } from "@tanstack/react-query";
import {
  getNotification,
  createNotification,
  updateNotification,
} from "@/lib/axios/notification";

const getNotificationQuery = (userId) =>
  queryOptions({
    queryKey: ["notifications", userId],
    queryFn: () => getNotification(userId),
  });

const createNotificationQuery = () =>
  queryOptions({
    mutationKey: ["createNotification"],
    mutationFn: createNotification,
  });

const updateNotificationQuery = () =>
  queryOptions({
    mutationKey: ["updateNotification"],
    mutationFn: ({ id, is_read }) => updateNotification(id, is_read),
  });

export {
  getNotificationQuery,
  updateNotificationQuery,
  createNotificationQuery,
};
