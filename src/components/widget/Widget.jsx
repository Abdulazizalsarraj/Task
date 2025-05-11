import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useDraggable } from "@dnd-kit/core";
import { Trash2, FolderOpen } from "lucide-react";
import { CELL_TOTAL } from "../../constants";
import { TEMPLATES } from "../drawer/Drawer";
import { motion, AnimatePresence } from "framer-motion";

export default function Widget({ widget, update, remove, duplicate }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: widget.id,
    data: { widget: true },
  });

  const rndRef = useRef();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onResizeStop = (e, direction, ref, delta, position) => {
    const newWidth = Math.round(ref.offsetWidth / CELL_TOTAL) * CELL_TOTAL;
    const newHeight = Math.round(ref.offsetHeight / CELL_TOTAL) * CELL_TOTAL;

    update({
      width: newWidth,
      height: newHeight,
      x: position.x,
      y: position.y,
    });
  };

  const templateInfo = TEMPLATES.find(
    (template) => template.id === widget.type
  );

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    remove();
    setShowDeleteModal(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(false);
  };

  return (
    <>
      <Rnd
        ref={rndRef}
        size={{ width: widget.width, height: widget.height }}
        position={{ x: widget.x, y: widget.y }}
        disableDragging={true}
        bounds="parent"
        minWidth={CELL_TOTAL}
        minHeight={CELL_TOTAL}
        grid={[CELL_TOTAL, CELL_TOTAL]}
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomLeft: false,
          topLeft: false,
          bottomRight: true,
        }}
        onResizeStop={onResizeStop}
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          borderRadius: "8px",
          overflow: "hidden",
          transform: `scale(${widget.scale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="h-full flex flex-col"
        >
          <div className="flex flex-col items-end space-y-2 p-2 absolute top-2 right-2 z-10">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={duplicate}
              className="h-6 w-6 flex justify-center items-center  border text-[#F7A603] border-[#F7A603] cursor-pointer rounded-full translate-x-4 p-1 hover:bg-[#F7A603] hover:text-white transition-colors"
              title="Duplicate widget"
            >
              <FolderOpen className=" w-3 h-[13.5px] " />
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleDelete}
              className="h-6 w-6 flex justify-center items-center border border-[#EB8063] cursor-pointer rounded-full translate-x-4 p-1 text-[#EB8063] hover:bg-[#EB8063]  hover:text-white transition-colors"
              title="Delete widget"
            >
              <Trash2 className="w-3 h-[13.5px]" />
            </button>
          </div>

          <div className="flex  items-center  h-full text-center p-2">
            <div className="flex flex-col">
              {templateInfo?.title && (
                <h3
                  className="text-sm font-semibold text-gray-800 mb-1"
                  style={{ fontSize: `${Math.min(14, widget.width / 8)}px` }}
                >
                  {templateInfo.title}
                </h3>
              )}
              {templateInfo?.description && (
                <p
                  className="text-xs text-gray-500 line-clamp-2"
                  style={{ fontSize: `${Math.min(14, widget.width / 10)}px` }}
                >
                  {templateInfo.description}
                </p>
              )}
              {!templateInfo?.title && (
                <div className="text-sm text-gray-700">{widget.type}</div>
              )}
            </div>
            {templateInfo?.thumbnail && (
              <img
                src={templateInfo.thumbnail}
                alt={templateInfo.title}
                className="w-16 h-16 object-contain mb-2 rounded flex-1/2 mr-5"
              />
            )}
          </div>
        </div>
        <div
          style={{
            width: "12px",
            height: "12px",
            position: "absolute",
            bottom: 0,
            right: 0,
            cursor: "se-resize",
            backgroundColor: "transparent",
          }}
          className="react-rnd-handle"
        />
      </Rnd>

      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-0 bg-white/30 flex items-center justify-center z-[9999]"
              onClick={handleCancelDelete}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.2,
              }}
              className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none"
            >
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 pointer-events-auto border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Delete Widget?
                </h3>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to permanently delete this widget? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-5 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
