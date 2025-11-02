import axios from "axios";

export const students = async (id) => {
  try {
    const res = await axios.get(`/students`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
