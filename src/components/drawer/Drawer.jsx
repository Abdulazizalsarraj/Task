

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { X, Search } from "lucide-react";
import image1 from "../../assets/templates/img-1.jpg";
import image2 from "../../assets/templates/img-2.jpg";
import image3 from "../../assets/templates/img-3.jpg";
import image4 from "../../assets/templates/img-4.jpg";
import image5 from "../../assets/templates/img-5.jpg";
import image6 from "../../assets/templates/img-6.jpg";

const TABS = ["Templates", "Drafts"];
const CATEGORIES = ["All", "Informative Widgets", "Statistics Widgets"];

export const TEMPLATES = [
  {
    id: "avg-age-chart",
    title: "Average Age Chart",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic...",
    category: "Statistics Widgets",
    thumbnail: image1,
  },
  {
    id: "header-slider",
    title: "Header Slider Widget",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic...",
    category: "Informative Widgets",
    thumbnail: image2,
  },
  {
    id: "quick-links",
    title: "Quick Links Widget",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic...",
    category: "Informative Widgets",
    thumbnail: image3,
  },
  {
    id: "bubble-chart",
    title: "Bubble Chart",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic...",
    category: "Statistics Widgets",
    thumbnail: image4,
  },
  {
    id: "ad-widget",
    title: "Advertisement Widget",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic...",
    category: "Informative Widgets",
    thumbnail: image5,
  },
  {
    id: "filter-results",
    title: "Filter Results (Table)",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic...",
    category: "Statistics Widgets",
    thumbnail: image6,
  },

];

function TemplateCard({ template }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: template.id,
    data: {
      template: true,
      widthCells: 6,
      heightCells: 3,
    },
  });

  const DotsIcon = () => (
    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-400"
      >
        <circle cx="2" cy="2" r="1.5" />
        <circle cx="7" cy="2" r="1.5" />
        <circle cx="12" cy="2" r="1.5" />
        <circle cx="2" cy="8" r="1.5" />
        <circle cx="7" cy="8" r="1.5" />
        <circle cx="12" cy="8" r="1.5" />
      </svg>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="group relative flex items-start p-3 bg-white rounded-lg shadow cursor-move 
                 transition-all duration-200 ease-in-out 
                 hover:shadow-xl hover:-translate-x-3 hover:z-10"
    >
      <img
        src={template.thumbnail}
        alt={template.title}
        className="w-16 h-16 flex-shrink-0 rounded border border-gray-200 object-cover mr-3"
      />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-800">
          {template.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          {template.description}
        </p>
        <span className="mt-2 inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
          {template.category}
        </span>
      </div>
      <DotsIcon />
    </div>
  );
}

export default function Drawer({ open, onClose }) {
  const [activeTab, setActiveTab] = useState("Templates");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredTemplates = useMemo(() => {
    let list = TEMPLATES;
    if (activeTab === "Templates") {
      if (filter !== "All") {
        list = list.filter((t) => t.category === filter);
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        );
      }
    } else {
      list = [];
    }
    return list;
  }, [activeTab, filter, search]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: open ? 0 : "100%" }}
      transition={{ type: "tween" }}
      className="fixed top-0 right-0 w-80 h-full bg-gray-50 shadow-xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">
          {activeTab === "Templates" ? "Add widget" : "Drafts"}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
          aria-label="Close drawer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearch("");
              setFilter("All");
            }}
            className={`flex-1 text-center py-2 text-sm font-medium transition-colors
              ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500 hover:border-blue-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Templates" && (
        <div className="px-4 py-3 space-y-3 border-b border-gray-200">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors
                  ${
                    filter === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                  }`}
              >
            
                {cat}{" "}
                {cat === "All"
                  ? `(${TEMPLATES.length})`
                  : `(${TEMPLATES.filter((t) => t.category === cat).length})`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((t) => <TemplateCard key={t.id} template={t} />)
        ) : (
          <p className="text-center text-gray-500 mt-6 text-sm">
            No {activeTab.toLowerCase()} found matching your criteria.
          </p>
        )}
      </div>
    </motion.div>
  );
}
