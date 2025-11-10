import React from "react";
import { useParams } from "react-router-dom";

export default function CurriculumDetailSuper() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">SuperAdmin — Curriculum Detail</h1>
      <p className="mt-4">
        Curriculum ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
