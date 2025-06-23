import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import type { UpdateTodoModel } from "@/models/todoModel";

interface UpdateTodoParams {
  todoId: number;
  todoData: UpdateTodoModel;
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
