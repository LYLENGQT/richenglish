import React from "react";
import useAuthStore from "@/lib/zustand/authStore";
import { bookQuery } from "../../lib/reaactquery/bookQuery";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Books = () => {
  const { id, name } = useAuthStore();
  const { data, isLoading, error } = useQuery({ ...bookQuery(id) });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="w-full h-96 mb-12 mt-5" />
          <Skeleton className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        {data?.books.length === 0 ? (
          <p className="text-muted-foreground">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.books.map((book) => (
              <div
                key={book._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-medium">{book.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(book.created_at).toLocaleDateString()}
                </p>
                <Link
                  to={`/portal/teacher/books/${book._id}`}
                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
