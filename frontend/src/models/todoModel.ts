export interface TodoModel {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface CreateTodoModel {
  title: string;
  description: string;
  completed: boolean;
}

export interface UpdateTodoModel {
  title?: string;
  description?: string;
  completed?: boolean;
}
