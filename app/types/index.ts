export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
}

export type TodoFilter = "pending" | "completed" | "deleted" | "new";

export interface ActionData {
  errors?: {
    title?: string;
    description?: string;
    email?: string;
    password?: string;
    username?: string;
    general?: string;
  };
  success?: boolean;
}