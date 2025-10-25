import React from "react";
import { Bell, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotificationQuery } from "@/lib/reaactquery/notificationQuery";
import useAuthStore from "@/lib/zustand/authStore";
import { updateNotification } from "@/lib/axios/notification";

const DashboardHeader = ({ name: defaultName = "User" }) => {
  const { id: userId, name: storeName } = useAuthStore();
  const name = storeName || defaultName;
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery(getNotificationQuery(userId));

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  const mutation = useMutation({
    mutationFn: ({ id, is_read }) => updateNotification(id, is_read),
    onSuccess: () => queryClient.invalidateQueries(["notifications", userId]),
  });

  const handleMarkRead = (id) => mutation.mutate({ id, is_read: 1 });

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg w-full mb-3">
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-semibold text-lg"
          title={name}
        >
          {name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
        <h1 className="text-xl font-semibold text-gray-900 truncate">{name}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white w-5 h-5 text-xs flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-80 max-h-96 overflow-y-auto"
        >
          <DropdownMenuLabel className="font-semibold">
            Notifications
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {notifications.length === 0 && (
            <div className="p-4 text-sm text-gray-500">No notifications</div>
          )}

          {notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={cn(
                "flex flex-col gap-1 p-2 rounded-md hover:bg-gray-100 cursor-pointer",
                n.is_read === 0 && "bg-gray-50"
              )}
              onClick={() => handleMarkRead(n.id)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">
                  {n.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkRead(n.id);
                  }}
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              {n.label && (
                <span className="text-xs text-gray-600 truncate">
                  {n.label}
                </span>
              )}
              {n.message && (
                <span className="text-xs text-gray-700">{n.message}</span>
              )}
              {n.created_at && (
                <span className="text-[10px] text-gray-400">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardHeader;
