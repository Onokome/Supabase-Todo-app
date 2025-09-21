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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchTodos();
  }, [user?.id]);

  async function fetchTodos() {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from<Todo>("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Fetch todos error", error);
      setErrorMessage(error.message);
      return;
    }

    setTodos(data ?? []);
  }

  async function addTodo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from<Todo>("todos")
      .insert([{ task: newTask.trim(), user_id: user.id }])
      .select();

    setLoading(false);

    if (error) {
      console.error("Insert todo error", error);
      setErrorMessage(error.message);
      return;
    }

    if (data) setTodos((prev) => [...prev, ...data]);
    setNewTask("");
  }

  async function toggleComplete(id: string, current: boolean) {
    setErrorMessage(null);
    const { error } = await supabase
      .from<Todo>("todos")
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

  async function deleteTodo(id: string) {
    setErrorMessage(null);
    const { error } = await supabase.from<Todo>("todos").delete().eq("id", id);

    if (error) {
      console.error("Delete todo error", error);
      setErrorMessage(error.message);
      return;
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">My Todos</h2>

      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          className="border rounded px-2 flex-1"
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={loading}
        >
          Add
        </button>
      </form>

      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {loading && <p className="text-sm text-gray-500 mb-2">Loading…</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between mb-2">
            <span
              onClick={() => toggleComplete(todo.id, todo.is_complete)}
              className={`cursor-pointer ${
                todo.is_complete ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.task}
            </span>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => toggleComplete(todo.id, todo.is_complete)}
                className="text-sm px-2 py-1 border rounded"
              >
                {todo.is_complete ? "Undo" : "Done"}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
