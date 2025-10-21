import React from "react";
import { useParams } from "react-router-dom";

export default function RecordingDetail() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher — Recording Detail</h1>
      <p className="mt-4">
        Recording ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        Placeholder — audio/video player goes here.
      </p>
    </div>
  );
}
