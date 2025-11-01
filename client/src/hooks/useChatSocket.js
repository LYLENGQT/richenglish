import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/lib/zustand/authStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socketInstance = null;

const useChatSocket = () => {
  const { id } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
      return;
    }

    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket"],
      });
    } else if (!socketInstance.connected) {
      socketInstance.connect();
    }

    const socket = socketInstance;

    socket.emit("joinRoom", id);

    const handleReceiveMessage = (message) => {
      if (!message || message.receiverId !== id) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["messages", message.senderId] });
      queryClient.invalidateQueries({ queryKey: ["chatData"] });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [id, queryClient]);

  return socketInstance;
};

export default useChatSocket;

