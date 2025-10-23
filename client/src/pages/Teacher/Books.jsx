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
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white text-base font-semibold">
          {name
            ? name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
            : name
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Teacher Dashboard
          </h1>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Teacher</div>
          <div className="text-base font-medium text-slate-900">
            {name || name}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        {data?.length === 0 ? (
          <p className="text-muted-foreground">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((book) => (
              <div
                key={book.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-medium">{book.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(book.created_at).toLocaleDateString()}
                </p>
                <Link
                  to={`/portal/teacher/books/${book.id}`}
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
