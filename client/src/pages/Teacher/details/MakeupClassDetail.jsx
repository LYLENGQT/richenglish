import React from "react";
import { useParams } from "react-router-dom";

export default function MakeupClassDetail() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher — Makeup Class Detail</h1>
      <p className="mt-4">
        Makeup Class ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        Placeholder — implement details and actions here.
      </p>
    </div>
  );
}
