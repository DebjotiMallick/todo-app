import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import type { CreateTodoModel } from "@/models/todoModel";

const createTodo = async (newTodo: CreateTodoModel) => {
  const response = await axiosInstance.post("/todos/", newTodo);
  return response.data;
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
