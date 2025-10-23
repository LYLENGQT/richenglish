import { queryOptions } from "@tanstack/react-query";
import { getAllBooks, getOneBook } from "../axios/books";

const bookQuery = (teacher_id) => {
  return queryOptions({
    queryKey: ["books"],
    queryFn: () => getAllBooks(teacher_id),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });
};

const getOneBookQuery = (id) => {
  return queryOptions({
    queryKey: ["books", id],
    queryFn: () => getOneBook(id),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
  });
};

export { bookQuery, getOneBookQuery };
