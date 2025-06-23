import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import type { TodoModel } from "@/models/todoModel";

interface UpdateTodoParams {
  todoId: number;
  todoData: Partial<TodoModel>;
}

const updateTodo = async ({ todoId, todoData }: UpdateTodoParams) => {
  const response = await axiosInstance.patch(`/todos/${todoId}`, todoData);
  return response.data;
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
