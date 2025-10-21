import React from "react";
import { useParams } from "react-router-dom";

export default function RecordingDetailAdmin() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin — Recording Detail</h1>
      <p className="mt-4">
        Recording ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
