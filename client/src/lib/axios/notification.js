import axios from "axios";

const getNotification = async (id) => {
  const response = await axios.get(`/notification/${id}`);
  return response.data;
};

const createNotification = async ({ id, type, message }) => {
  const response = await axios.post(`/notification`, { id, type, message });
  return response.data;
};

const updateNotification = async (id, is_read) => {
  const response = await axios.patch(`/notification/${id}`, { is_read });
  return response.data;
};

export { getNotification, createNotification, updateNotification };
