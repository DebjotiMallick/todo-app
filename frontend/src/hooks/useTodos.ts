import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "../api/axiosInstance";

// const fetchTodos = async () => {
//   const response = await axiosInstance.get("/todos");
//   return response.data;
// };

const fetchTodos = async () => {
  try {
    const response = await fetch(
      "https://todo.debjotimallick.store/api/todos/"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data; // return so it's usable
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw error; // propagate the error to React Query or caller
  }
};

export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
};
