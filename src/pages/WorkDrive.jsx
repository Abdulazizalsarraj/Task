import React, { useState, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import CanvasGrid from "../components/CanvasGrid/CanvasGrid";
import Drawer, { TEMPLATES } from "../components/drawer/Drawer";
import { ToastContainer, toast } from "react-toastify";
import CheckIcon from "../assets/icons/check.svg";
import UndoIcon from "../assets/icons/undo.svg";
import DrawerIcon from "../assets/icons/drawer-icon.svg";
import {
  GRID_COLS,
  GRID_ROWS,
  CELL_TOTAL,
} from "../constants";
import "react-toastify/dist/ReactToastify.css";

export default function WorkDrive() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [savedWidgets, setSavedWidgets] = useState([]);
  const [preview, setPreview] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const json = localStorage.getItem("widgets");
    if (json) {
      const arr = JSON.parse(json);
      setWidgets(arr);
      setSavedWidgets(arr);
    }
  }, []);

  const handleDragMove = (event) => {
    const { active, over, delta, activatorEvent } = event;
    if (over?.id === "canvas-area") {
      const canvasRect = document
        .getElementById("canvas-area")
        .getBoundingClientRect();

      if (active.data.current?.template) {
        const x = activatorEvent.clientX + delta.x - canvasRect.left;
        const y = activatorEvent.clientY + delta.y - canvasRect.top;
        const snappedX = Math.round(x / CELL_TOTAL) * CELL_TOTAL;
        const snappedY = Math.round(y / CELL_TOTAL) * CELL_TOTAL;
        const { widthCells, heightCells } = active.data.current;
        setPreview({
          col: snappedX / CELL_TOTAL,
          row: snappedY / CELL_TOTAL,
          widthCells,
          heightCells,
          isDraggingNew: true,
        });
      } else if (active.data.current?.widget) {
        const original = widgets.find((w) => w.id === active.id);
        if (!original) return;
        const x = original.x + delta.x;
        const y = original.y + delta.y;
        const snappedX = Math.round(x / CELL_TOTAL) * CELL_TOTAL;
        const snappedY = Math.round(y / CELL_TOTAL) * CELL_TOTAL;
        setPreview({
          col: snappedX / CELL_TOTAL,
          row: snappedY / CELL_TOTAL,
          widthCells: original.width / CELL_TOTAL,
          heightCells: original.height / CELL_TOTAL,
          isDraggingNew: false,
        });
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over, delta, activatorEvent } = event;

    if (active.data.current?.template && over?.id === "canvas-area") {
      const canvasRect = document
        .getElementById("canvas-area")
        .getBoundingClientRect();

      const x = activatorEvent.clientX + delta.x - canvasRect.left;
      const y = activatorEvent.clientY + delta.y - canvasRect.top;
      const snappedX = Math.round(x / CELL_TOTAL) * CELL_TOTAL;
      const snappedY = Math.round(y / CELL_TOTAL) * CELL_TOTAL;

      const { widthCells, heightCells } = active.data.current;

      const maxX = (GRID_COLS - widthCells) * CELL_TOTAL;
      const maxY = (GRID_ROWS - heightCells) * CELL_TOTAL;

      if (snappedX > maxX || snappedY > maxY || snappedX < 0 || snappedY < 0) {
        toast.error("Cannot drop widget outside grid bounds");
        setPreview(null);
        return;
      }

      const templateData = TEMPLATES.find((t) => t.id === active.id);

      setWidgets((ws) => [
        ...ws,
        {
          id: `w-${Date.now()}`,
          type: active.id,
          x: snappedX,
          y: snappedY,
          width: widthCells * CELL_TOTAL,
          height: heightCells * CELL_TOTAL,
          scale: 1,
          title: templateData?.title || "",
          description: templateData?.description || "",
          thumbnail: templateData?.thumbnail || "",
        },
      ]);
      setPreview(null);
      return;
    }

    if (active.data.current?.widget && over?.id === "canvas-area") {
      setWidgets((ws) =>
        ws.map((w) => {
          if (w.id !== active.id) return w;
          const newX = Math.round((w.x + delta.x) / CELL_TOTAL) * CELL_TOTAL;
          const newY = Math.round((w.y + delta.y) / CELL_TOTAL) * CELL_TOTAL;

          const widthCells = w.width / CELL_TOTAL;
          const heightCells = w.height / CELL_TOTAL;
          const maxX = (GRID_COLS - widthCells) * CELL_TOTAL;
          const maxY = (GRID_ROWS - heightCells) * CELL_TOTAL;

          if (newX > maxX || newY > maxY || newX < 0 || newY < 0) {
            toast.error("Widget can't be moved outside grid");
            return w;
          }

          return { ...w, x: newX, y: newY };
        })
      );
      setPreview(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setPreview(null)}
      >
        <motion.div
          animate={{ x: drawerOpen ? -285 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex justify-end items-center space-x-3 mb-4"
        >
          <button
            onClick={() => {
              setWidgets(savedWidgets);
              setPreview(null);
              toast.error("Changes discarded");
            }}
            className="btn-discard px-4 py-2 cursor-pointer rounded-md flex items-center transition font-bold"
          >
            <img src={UndoIcon} className="mr-1" alt="undo icon" /> Discard
          </button>
          <button
            onClick={() => {
              setSavedWidgets(widgets);
              localStorage.setItem("widgets", JSON.stringify(widgets));
              const counts = widgets.reduce((acc, w) => {
                acc[w.type] = (acc[w.type] || 0) + 1;
                return acc;
              }, {});
              localStorage.setItem("widgetCounts", JSON.stringify(counts));
              toast.success("Saved successfully");
            }}
            className="btn-save px-4 py-2 cursor-pointer rounded-md flex items-center transition font-bold"
          >
            <img src={CheckIcon} className="mr-1" alt="save icon" /> Save
          </button>
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            className={`p-2 py-3 cursor-pointer rounded-md hover:bg-gray-200 transition ${
              drawerOpen ? "hidden" : ""
            }`}
          >
            {drawerOpen ? "" : <img src={DrawerIcon} alt="" />}
          </button>
        </motion.div>

        <div className="flex relative flex-1 h-full">
          <CanvasGrid
            widgets={widgets}
            setWidgets={setWidgets}
            preview={preview}
          />
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
      </DndContext>
    </>
  );
}
