import StatCard from "@/components/StatCard";
import React from "react";
import * as Icons from "lucide-react";

const statCards = [
  {
    name: "Total Teachers",
    value: 45,
    icon: "Users",
    color: "bg-blue-500",
  },
  {
    name: "Handled Teachers",
    value: 12,
    icon: "GraduationCap",
    color: "bg-green-500",
  },
  {
    name: "Total Students",
    value: 230,
    icon: "School",
    color: "bg-yellow-500",
  },
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => {
        const IconComponent = Icons[card.icon] || Icons.Circle;
        return <StatCard key={index} card={{ ...card, icon: IconComponent }} />;
      })}
    </div>
  );
};

export default Dashboard;
