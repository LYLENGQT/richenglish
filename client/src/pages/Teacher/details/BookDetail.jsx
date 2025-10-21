import React from "react";
import { useParams } from "react-router-dom";

export default function BookDetail() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher — Book Detail</h1>
      <p className="mt-4">
        Book ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        Placeholder — show book viewer or metadata here.
      </p>
    </div>
  );
}
