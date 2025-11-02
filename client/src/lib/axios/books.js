import axios from "axios";

export const getAllBooks = async (teache_id) => {
  try {
    const res = await axios.get(`/books`, { params: { teache_id } });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBook = async () => {
  try {
    const res = await axios.get(`/books`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getOneBook = async (id) => {
  try {
    const res = await axios.get(`/books/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
