import { useCreateTodo } from "@/hooks/useCreateTodos";
import { useTodos } from "@/hooks/useTodos";
import type { TodoModel, CreateTodoModel } from "@/models/todoModel";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  completed: z.boolean(),
});

const Todo = () => {
  const { data, isLoading, isError } = useTodos();
  const { mutate: createTodo } = useCreateTodo();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newTodo: CreateTodoModel = {
      title: values.title,
      description: values.description,
      completed: values.completed,
    };
    createTodo(newTodo);
    form.reset();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <p>Error loading todos</p>;

  return (
    <div className="p-4 space-y-6">
      <div className="border rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Add New Todo</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter todo title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter todo description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Todo</Button>
          </form>
        </Form>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Your Todos</h2>
        {data && data.length > 0 ? (
          data.map((todo: TodoModel) => (
            <div
              key={todo.id}
              className="border rounded-xl p-3 shadow-sm flex items-center justify-between"
            >
              <div>
                <h3
                  className={
                    todo.completed
                      ? "line-through text-gray-400"
                      : "font-medium"
                  }
                >
                  {todo.title}
                </h3>
                <p className="text-sm text-gray-600">{todo.description}</p>
              </div>
              <span className="text-sm text-gray-500">
                {todo.completed ? "✔️ Done" : "⏳ Pending"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default Todo;
