export type Task = {
  id: string;
  content: string;
  description?: string;
  priority: "High" | "Mid" | "Low";
};

export type ColumnState = {
  [key: string]: {
    name: string;
    items: Task[];
  };
};
