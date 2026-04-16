import React, { useState, useEffect } from "react";
import { Task } from "../types";

interface EditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export default function EditModal({ task, isOpen, onClose, onSave }: EditModalProps) {
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"High" | "Mid" | "Low">("Mid");

  useEffect(() => {
    if (task) {
      setContent(task.content);
      setDescription(task.description || "");
      setPriority(task.priority);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (content.trim() === "") return;
    onSave({
      ...task,
      content,
      description,
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg shadow-2xl w-full max-w-md border border-zinc-700 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-700 flex justify-between items-center bg-zinc-800/80">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">✏️ Edit Task</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer px-2 text-xl font-bold">✕</button>
        </div>
        
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Title</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-3 bg-zinc-700 text-white outline-none rounded-md border border-zinc-600 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 bg-zinc-700 text-white outline-none rounded-md border border-zinc-600 focus:border-blue-500 transition-colors min-h-[100px] resize-y"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "High" | "Mid" | "Low")}
              className="p-3 bg-zinc-700 text-white outline-none rounded-md border border-zinc-600 focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-700 bg-zinc-800/80 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white rounded-md transition-colors cursor-pointer text-sm font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors cursor-pointer text-sm font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
