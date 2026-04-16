import React from "react";
import { Task } from "../types";

interface BinModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedTasks: Task[];
  onEmptyBin: () => void;
}

export default function BinModal({ isOpen, onClose, deletedTasks, onEmptyBin }: BinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg shadow-2xl w-full max-w-lg border border-zinc-700 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-zinc-700 flex justify-between items-center bg-zinc-800/80">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">🗑️ Recycle Bin</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer px-2 text-xl font-bold">✕</button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
          {deletedTasks.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 italic">No tasks in bin</div>
          ) : (
            deletedTasks.map((task) => (
              <div key={task.id} className="bg-zinc-700 p-4 rounded-md flex flex-col gap-2">
                <span className="text-white line-through opacity-70">{task.content}</span>
                {task.description && (
                  <span className="text-zinc-400 text-xs mt-[-4px] line-through opacity-70">{task.description}</span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-wider w-fit px-2 py-0.5 rounded opacity-70 ${
                  task.priority === 'High' ? 'bg-red-500/20 text-red-500' : 
                  task.priority === 'Mid' ? 'bg-amber-500/20 text-amber-500' : 
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {task.priority || "Mid"}
                </span>
              </div>
            ))
          )}
        </div>

        {deletedTasks.length > 0 && (
          <div className="p-4 border-t border-zinc-700 bg-zinc-800/80 flex justify-end">
            <button 
              onClick={onEmptyBin}
              className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-md transition-colors cursor-pointer text-sm font-semibold"
            >
              Empty Bin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
