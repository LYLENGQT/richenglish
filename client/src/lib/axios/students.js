import axios from "axios";

export const getAllStudents = async (params = {}) => {
  const { data } = await axios.get("/students", { params });
  return data;
};

export const getStudent = async (id) => {
  const { data } = await axios.get(`/students/${id}`);
  return data;
};

export const addStudent = async (studentData) => {
  const { data } = await axios.post("/students", studentData);
  return data;
};

export const updateStudent = async (id, studentData) => {
  const { data } = await axios.patch(`/students/${id}`, studentData);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await axios.delete(`/students/${id}`);
  return data;
};
