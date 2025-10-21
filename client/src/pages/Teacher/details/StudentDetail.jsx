import React from "react";
import { useParams } from "react-router-dom";

export default function StudentDetail() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher — Student Detail</h1>
      <p className="mt-4">
        Student ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        This is a placeholder page. Replace with real data fetching and UI.
      </p>
    </div>
  );
}
