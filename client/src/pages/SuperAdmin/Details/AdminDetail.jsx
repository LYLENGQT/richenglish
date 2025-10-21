import React from "react";
import { useParams } from "react-router-dom";

export default function AdminDetailSuper() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">SuperAdmin — Admin Detail</h1>
      <p className="mt-4">
        Admin ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        Placeholder — implement super-admin controls and data here.
      </p>
    </div>
  );
}
