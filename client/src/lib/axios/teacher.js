import api from "./axios";

export const dashboard = async () => {
  try {
    const dashboard = await api.get("/dashboard");
    const data = dashboard.data;

    return { dashboard: data };
  } catch (error) {
    throw error;
  }
};

export const students = async (id) => {
  try {
    const res = await api.get(`/students`, {
      params: { teacher_id: id },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
