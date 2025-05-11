import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "../assets/icons/Vector.svg";

export default function Home() {
  const [widgets, setWidgets] = useState([]);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("widgets");
    if (stored) {
      try {
        setWidgets(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse widgets from localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);

      setTimeout(() => {
        setAnimate(false);
      }, 900);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const btnClasses = `
    fixed bottom-7 right-7
    cursor-pointer w-11 h-11
    bg-[#F6A603] hover:bg-yellow-500
    text-white rounded-[10px] shadow-lg
    flex items-center justify-center
    z-50
    transform transition-all duration-[700ms] ease-in-out
    ${animate ? "-translate-y-7 scale-105" : "translate-y-0 scale-100"}
  `;

  const iconClasses = `
    transition-transform duration-[700ms] ease-in-out
    ${animate ? "scale-120" : "scale-100"}
  `;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Saved Widgets</h1>

      {widgets.length === 0 ? (
        <p className="text-gray-500">No widgets saved yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="bg-white rounded-lg shadow-md p-10 flex  items-center text-center"
            >
              <div className="flex flex-col mr-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {widget.title || widget.type}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {widget.description || "No description available."}
                </p>
              </div>
              {widget.thumbnail && (
                <img
                  src={widget.thumbnail}
                  alt={widget.title}
                  className="w-1/2 h-20 object-contain "
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate("/work-drive")} className={btnClasses}>
        <img src={EditIcon} alt="edit icon" className={iconClasses} />
      </button>
    </div>
  );
}
