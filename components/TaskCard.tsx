import React from "react";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  columnId: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, columnId: string, taskId: string) => void;
  onDragEnd: () => void;
  onRemove: (columnId: string, taskId: string) => void;
  onEdit: (columnId: string, task: Task) => void;
}

export default function TaskCard({ task, columnId, onDragStart, onDragEnd, onRemove, onEdit }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, columnId, task.id)}
      onDragEnd={onDragEnd}
      className="bg-zinc-700 p-4 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:bg-zinc-600 transition-colors flex justify-between items-center group"
    >
      <div className="flex flex-col gap-2">
        <span className="text-white select-none">{task.content}</span>
        {task.description && (
            <span className="text-zinc-400 text-xs mt-0.5 select-none line-clamp-2 leading-relaxed">{task.description}</span>
        )}
        <span className={`text-[10px] font-bold uppercase tracking-wider w-fit px-2 py-0.5 mt-1 rounded ${
          task.priority === 'High' ? 'bg-red-500/20 text-red-400' : 
          task.priority === 'Mid' ? 'bg-amber-500/20 text-amber-400' : 
          'bg-blue-500/20 text-blue-400'
        }`}>
          {task.priority || "Mid"}
        </span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(columnId, task)}
          className="text-zinc-400 font-bold hover:text-blue-400 cursor-pointer p-1"
          aria-label="Edit Task"
        >
          ✏️
        </button>
        <button
          onClick={() => onRemove(columnId, task.id)}
          className="text-zinc-400 font-bold hover:text-red-400 cursor-pointer p-1 text-lg"
          aria-label="Remove Task"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
