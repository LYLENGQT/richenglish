import React from "react";
import { useParams } from "react-router-dom";

export default function ClassDetail() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher — Class Detail</h1>
      <p className="mt-4">
        Class ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        Placeholder — replace with actual class details.
      </p>
    </div>
  );
}
