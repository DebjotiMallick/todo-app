import { useCreateTodo } from "@/hooks/useCreateTodos";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import { useUpdateTodo } from "@/hooks/useUpdateTodo";
import { useTodos } from "@/hooks/useTodos";
import type {
  TodoModel,
  CreateTodoModel,
  UpdateTodoModel,
} from "@/models/todoModel";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const Todo = () => {
  const { data, isLoading, isError } = useTodos();
  const { mutate: createTodo } = useCreateTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  // Initialize the form for creating todos
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Initialize the form for editing todos
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Handle form submission for creating todos
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newTodo: CreateTodoModel = {
      ...values,
      completed: false,
    };
    createTodo(newTodo);
    form.reset();
  };

  // Handle editing a todo
  const handleEdit = (todo: TodoModel) => {
    setEditingTodoId(todo.id);
    editForm.reset({
      title: todo.title,
      description: todo.description,
    });
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingTodoId(null);
    editForm.reset();
  };

  // Handle saving edited todo
  const handleSaveEdit = (todoId: number) => {
    const values = editForm.getValues();
    const updatedTodo: UpdateTodoModel = {
      title: values.title,
      description: values.description,
    };
    updateTodo({ todoId, todoData: updatedTodo });
    setEditingTodoId(null);
  };

  // Handle toggling todo completion status
  const handleToggleComplete = (todo: TodoModel) => {
    updateTodo({
      todoId: todo.id,
      todoData: { completed: !todo.completed },
    });
  };

  // Handle deleting a todo
  const handleDelete = (todoId: number) => {
    deleteTodo(todoId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <p>Error loading todos</p>;

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>
            Create a new task for your todo list
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Textarea
                        placeholder="Enter todo description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Todo</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
          <CardDescription>Manage your tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data && data.length > 0 ? (
            data.map((todo: TodoModel) => (
              <Card key={todo.id} className="overflow-hidden">
                {editingTodoId === todo.id ? (
                  <div className="p-4">
                    <Form {...editForm}>
                      <div className="space-y-4">
                        <FormField
                          control={editForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={editForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(todo.id)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                ) : (
                  <div className="flex items-start p-4">
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-medium ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                        onClick={() => handleToggleComplete(todo)}
                        style={{ cursor: "pointer" }}
                      >
                        {todo.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {todo.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={todo.completed ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleComplete(todo)}
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(todo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this todo? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(todo.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No todos yet. Add one above!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Todo;
