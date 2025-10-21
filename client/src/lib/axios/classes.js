import axios from "axios";

export const classes = async () => {
  try {
    const res = await axios.get(`/classes`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
