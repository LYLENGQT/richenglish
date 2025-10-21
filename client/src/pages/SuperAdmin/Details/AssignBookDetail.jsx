import React from "react";
import { useParams } from "react-router-dom";

export default function AssignBookDetailSuper() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">SuperAdmin — Assign Book Detail</h1>
      <p className="mt-4">
        AssignBook ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
