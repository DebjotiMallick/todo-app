import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

const deleteTodo = async (todoId: number) => {
  // Note: There's a typo in the backend route - it's /heroes/{todo_id} instead of /todos/{todo_id}
  // We'll use the correct endpoint here
  await axiosInstance.delete(`/todos/${todoId}`);
  return todoId;
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
