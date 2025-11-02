import React from "react";

const StatCard = ({ card }) => {
  const { name, value, icon: Icon, color = "bg-gray-500", redirect } = card;

  const handleClick = () => {
    if (!redirect) return; // do nothing if redirect not provided
    if (typeof redirect === "string") {
      window.location.href = redirect;
    } else if (typeof redirect === "function") {
      redirect();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white overflow-hidden shadow rounded-lg transition-transform hover:scale-[1.02] ${
        redirect ? "cursor-pointer" : ""
      }`}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`${color} p-3 rounded-md`}>
              {Icon && <Icon className="h-6 w-6 text-white" />}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {name}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
