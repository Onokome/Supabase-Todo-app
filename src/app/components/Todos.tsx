"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export interface Todo {
  id: string;
  user_id: string;
  task: string;
  is_complete: boolean;
  inserted_at: string;
}

type Props = {
  user: User;
};

export default function Todos({ user }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function fetchTodos() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("inserted_at", { ascending: false });

      if (error) throw error;
      setTodos((data as Todo[]) ?? []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Fetch todos error", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("todos")
      .insert([{ task: newTask.trim() }])
      .select();

    setLoading(false);

    if (error) {
      console.error("Insert todo error", error);
      setErrorMessage(error.message);
      return;
    }

    if (data) setTodos((prev) => [...(data as Todo[]), ...prev]);
    setNewTask("");
  }

  async function toggleComplete(id: string, current: boolean) {
    setErrorMessage(null);
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !current })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Update todo error", error);
      setErrorMessage(error.message);
      return;
    }
    await fetchTodos();
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditingText(todo.task);
  }

  async function saveEdit(id: string) {
    if (!editingText.trim()) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase
        .from("todos")
        .update({ task: editingText.trim() })
        .eq("id", id)
        .select();

      if (error) throw error;

      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, task: editingText.trim() } : t))
      );

      setEditingId(null);
      setEditingText("");
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Update task error", err);
      setErrorMessage(err.message);
    }
  }

  async function deleteTodo(id: string) {
    setErrorMessage(null);
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Delete todo error", error);
      setErrorMessage(error.message);
      return;
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className=" w-full mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Your tasks</h1>

      <form onSubmit={addTodo} className="flex gap-2 md:gap-10 mb-4">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="max-w-lg flex-1 bg-white rounded-2xl py-3 px-4 border border-gray-300 focus:border-[#50C2C9] focus:ring-2 focus:ring-[#50C2C9] focus:outline-none transition-colors"
          disabled={loading}
          aria-label="New task description"
        />
        <button
          type="submit"
          className="bg-[#50C2C9] text-white px-3 py-3 md:px-6 rounded-2xl font-medium hover:bg-[#3da7ae] hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#50C2C9] focus:ring-offset-2 disabled:opacity-50 transition-colors"
          disabled={loading || !newTask.trim()}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {errorMessage && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {loading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}

      {loading && todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Loading your tasks...
        </div>
      ) : (
        <>
          {todos.length === 0 ? (
            <div className="py-4 text-gray-500 ">
              No tasks yet. Add one above to get started!
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 bg-transparent  focus:outline-none py-1 px-2"
                          aria-label="Edit task"
                        />
                      ) : (
                        <span
                          className={`flex-1 ${
                            todo.is_complete
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {todo.task}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(todo.id)}
                            disabled={loading}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(todo)}
                            className="text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              toggleComplete(todo.id, todo.is_complete)
                            }
                            className="text-green-600 px-3 py-1 rounded-lg text-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {todo.is_complete ? "Undo" : "Done"}
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
