
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Widget from "../widget/Widget";
import {
  CELL_SIZE,
  CELL_GAP,
  CELL_TOTAL,
  GRID_COLS,
  GRID_ROWS,
} from "../../constants";

export default function CanvasGrid({ widgets, setWidgets, preview }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-area" });

  return (
    <div
      id="canvas-area"
      ref={setNodeRef}
      className={`relative w-screen h-screen overflow-hidden ${
        isOver ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
          gap: `${CELL_GAP}px`,
          padding: `${CELL_GAP}px`,
        }}
      >
        {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-300 bg-white"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              boxSizing: "border-box",
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      {preview && (
        <div
          className="absolute opacity-50 pointer-events-none"
          style={{
            left: preview.col * CELL_TOTAL + CELL_GAP,
            top: preview.row * CELL_TOTAL + CELL_GAP,
            width: preview.widthCells * CELL_TOTAL - CELL_GAP,
            height: preview.heightCells * CELL_TOTAL - CELL_GAP,
            backgroundColor: preview.isDraggingNew
              ? "#888"
              : "rgba(144, 238, 144, 0.7)",
            border: `2px dashed ${
              preview.isDraggingNew
                ? "rgba(59, 130, 246, 0.7)"
                : "rgba(0, 128, 0, 0.7)"
            }`,
            borderRadius: 4,
            zIndex: 10,
          }}
        />
      )}

      {widgets.map((w) => (
        <Widget
          key={w.id}
          widget={w}
          update={(p) =>
            setWidgets((ws) =>
              ws.map((x) => (x.id === w.id ? { ...x, ...p } : x))
            )
          }
          remove={() => setWidgets((ws) => ws.filter((x) => x.id !== w.id))}
          duplicate={() => {
            const copy = { ...w, id: `w-${Date.now()}` };
            setWidgets((ws) => [...ws, copy]);
          }}
        />
      ))}
    </div>
  );
}
