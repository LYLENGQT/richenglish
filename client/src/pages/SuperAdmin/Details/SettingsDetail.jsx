import React from "react";
import { useParams } from "react-router-dom";

export default function SettingsDetailSuper() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">SuperAdmin — Settings Detail</h1>
      <p className="mt-4">
        Setting ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
