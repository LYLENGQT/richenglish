import React from "react";
import { useParams } from "react-router-dom";

export default function TeacherDetailAdmin() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin — Teacher Detail</h1>
      <p className="mt-4">
        Teacher ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        Placeholder — implement admin controls and data here.
      </p>
    </div>
  );
}
