"use client";

import React, { useState, useEffect } from "react";

import { Task, ColumnState } from "../types";
import TaskCard from "../components/TaskCard";
import BinModal from "../components/BinModal";
import EditModal from "../components/EditModal";

const initialColumns: ColumnState = {
  pending: { name: "Pending", items: [] },
  inProgress: { name: "In-Progress", items: [] },
  completed: { name: "Completed", items: [] },
};

export default function App() { 
  const [columns, setColumns] = useState<ColumnState>(initialColumns);
  const [isMounted, setIsMounted] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"All" | "High" | "Mid" | "Low">("All");
  const [activeColumns, setActiveColumn] = useState<keyof typeof columns>("pending");
  const [activePriority, setActivePriority] = useState<"High" | "Mid" | "Low">("Mid");
  const [draggedItem, setDraggedItem] = useState<{ columnId: keyof typeof columns; taskId: string } | null>(null);
  const [activeDragColumn, setActiveDragColumn] = useState<string | null>(null);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [isBinOpen, setIsBinOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{task: Task, columnId: string} | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem("task-up-data");
    const savedBin = localStorage.getItem("task-up-bin");
    if (savedData) {
      try {
        setColumns(JSON.parse(savedData));
      } catch (err) {
        console.error("Failed to parse local storage data");
      }
    }
    if (savedBin) {
      try {
        setDeletedTasks(JSON.parse(savedBin));
      } catch (err) {
        console.error("Failed to parse bin data");
      }
    }
  }, []);

  // Save to local storage whenever columns or bin change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("task-up-data", JSON.stringify(columns));
      localStorage.setItem("task-up-bin", JSON.stringify(deletedTasks));
    }
  }, [columns, deletedTasks, isMounted]);

  // Wait for client to mount before rendering to prevent hydration mismatch
  if (!isMounted) return null;

  const addNewTask = () => {
    if(newTask.trim() === "") return;

    const updatedColumns = {
      ...columns,
      [activeColumns]: {
        ...columns[activeColumns],
        items: [
          ...columns[activeColumns].items,
          {
            id: Date.now().toString(),
            content: newTask,
            description: newTaskDesc,
            priority: activePriority,
          }
        ]
      }
    };

    setColumns(updatedColumns);
    setNewTask("");
    setNewTaskDesc("");
    
  }

  const removeTask = (columnId: keyof typeof columns, taskId: string) => {
    const taskToDelete = columns[columnId].items.find(task => task.id === taskId);
    if (taskToDelete) {
      setDeletedTasks(prev => [taskToDelete, ...prev]);
    }

    const updatedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: columns[columnId].items.filter(task => task.id !== taskId)
      }
    };
    setColumns(updatedColumns);
  }

  const updateTask = (columnId: string, updatedTask: Task) => {
    const updatedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: columns[columnId].items.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      }
    };
    setColumns(updatedColumns);
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, columnId: keyof typeof columns, taskId: string) => {
    setDraggedItem({ columnId, taskId });
  };

  const handleDragEnd = () => {
    setActiveDragColumn(null);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (activeDragColumn !== targetColumnId) {
      setActiveDragColumn(targetColumnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: keyof typeof columns) => {
    e.preventDefault();
    setActiveDragColumn(null);
    if (!draggedItem) return;

    const { columnId, taskId } = draggedItem;

    // If dropping in the same column, do nothing
    if (columnId === targetColumnId) return;

    const updatedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: columns[columnId].items.filter(task => task.id !== taskId)
      },
      [targetColumnId]: {
        ...columns[targetColumnId],
        items: [
          ...columns[targetColumnId].items,
          columns[columnId].items.find(task => task.id === taskId)!
        ]
      }
    };

    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  const columnStyles: Record<string, { header: string; border: string }> = {
    pending: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400",
    },
    inProgress: {
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-400",
    },
    completed: {
      header: "bg-gradient-to-r from-green-600 to-green-400",
      border: "border-green-400"
    },
  }

  return(
    <>
      <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex item-center justify-center">
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <div className="w-full max-w-3xl pt-10 pb-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-sm flex items-center gap-3">
               Task Up
            </h1>
          </div>
          <div className="mb-8 flex flex-col sm:flex-row w-full max-w-3xl gap-[10px] items-stretch">
            <div className="flex flex-col sm:flex-row w-full flex-1 shadow-lg rounded-lg overflow-hidden border border-zinc-700">
              <div className="flex-1 flex flex-col bg-zinc-800">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Task Title *"
                  className="p-3 bg-transparent text-white outline-none font-medium border-b border-zinc-700"
                  onKeyDown={(e) => e.key === "Enter" && addNewTask()}
                />
                <input
                  type="text"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="px-3 py-2 bg-transparent text-zinc-300 outline-none text-sm"
                  onKeyDown={(e) => e.key === "Enter" && addNewTask()}
                />
              </div>

              <select
                value={activePriority}
                onChange={(e) => setActivePriority(e.target.value as "High" | "Mid" | "Low")}
                className="p-3 bg-zinc-700 text-white border-l border-zinc-600 outline-none cursor-pointer"
              >
                <option value="High">High Priority</option>
                <option value="Mid">Mid Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <select
                value={activeColumns}
                onChange={(e) => setActiveColumn(e.target.value as keyof typeof columns)}
                className="p-3 bg-zinc-700 text-white border-l border-zinc-600 outline-none cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="inProgress">In-Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <button
                onClick={addNewTask}
                className="p-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Add Task
              </button>
            </div>

            <button 
              onClick={() => setIsBinOpen(true)}
              className="p-3 sm:px-6 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 border border-zinc-700 shadow-lg rounded-lg cursor-pointer"
              title="Recycle Bin"
            >
              🗑️ {deletedTasks.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{deletedTasks.length}</span>}
            </button>
          </div>

          <div className="w-full max-w-6xl mb-6 px-2 md:px-0 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search tasks..."
                className="w-full p-4 bg-zinc-800/80 text-white outline-none border border-zinc-700 rounded-lg shadow-sm focus:border-blue-500 transition-colors placeholder:text-zinc-500"
              />
            </div>
            
            <div className="relative flex items-center bg-zinc-800/80 border border-zinc-700 rounded-lg shadow-sm focus-within:border-blue-500 transition-colors px-2">
              <span className="text-zinc-400 pl-2">Filter:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as "All" | "High" | "Mid" | "Low")}
                className="p-4 bg-transparent text-white outline-none cursor-pointer pr-4"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Mid">Mid</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6 w-full max-w-6xl items-start justify-center flex-col md:flex-row pb-12">
            {Object.entries(columns).map(([columnId, column]) => (
              <div 
                key={columnId}
                onDragOver={(e) => handleDragOver(e, columnId)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, columnId as keyof typeof columns)}
                className={`flex-1 min-w-[300px] w-full flex flex-col h-[500px] md:h-[65vh] rounded-lg shadow-xl overflow-hidden border-t-4 transition-all duration-200 ${
                  activeDragColumn === columnId ? "bg-zinc-700/80 scale-[1.02] shadow-2xl " : "bg-zinc-800 "
                }${columnStyles[columnId]?.border || ""}`}
              >
                <div className={`p-4 ${columnStyles[columnId]?.header || "bg-zinc-700"}`}>
                  <h2 className="text-xl font-semibold text-white">{column.name}</h2>
                  <p className="text-zinc-200 text-sm mt-1">{column.items.length} tasks</p>
                </div>
                
                <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto">
                  {column.items
                    .filter(task => {
                      const matchesSearch = task.content.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
                      return matchesSearch && matchesPriority;
                    })
                    .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      columnId={columnId}
                      onDragStart={handleDragStart as any}
                      onDragEnd={handleDragEnd}
                      onRemove={removeTask as any}
                      onEdit={(colId, t) => setEditingTask({ task: t, columnId: colId })}
                    />
                  ))}
                  {column.items.filter(task => {
                      const matchesSearch = task.content.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
                      return matchesSearch && matchesPriority;
                    }).length === 0 && (
                    <div className="text-center text-zinc-500 py-8 border-2 border-dashed border-zinc-700 rounded-md select-none">
                      {(searchQuery || filterPriority !== "All") ? "No matching tasks" : "Drop tasks here"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bin Modal */}
      <BinModal 
        isOpen={isBinOpen} 
        onClose={() => setIsBinOpen(false)} 
        deletedTasks={deletedTasks} 
        onEmptyBin={() => setDeletedTasks([])} 
      />
      <EditModal
        isOpen={!!editingTask}
        task={editingTask?.task || null}
        onClose={() => setEditingTask(null)}
        onSave={(updatedTask) => {
          if (editingTask) updateTask(editingTask.columnId, updatedTask);
        }}
      />
    </>
  )
}
