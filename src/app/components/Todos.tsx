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

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Fetch todos error", error);
      setErrorMessage(error.message);
      return;
    }

    setTodos((data as Todo[]) ?? []);
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

    if (data) setTodos((prev) => [ ...(data as Todo[]), ...prev]);
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
    } catch (err:any) {
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
    <div className="p-4 mx-auto ">
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
            {editingId === todo.id ? (
              <input
                className="border px-2 flex-1 mr-2"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <span
                className={`cursor-pointer ${
                  todo.is_complete ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.task}
              </span>
            )}

            <div className="flex gap-2 items-center">
              {editingId === todo.id ? (
                <>
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="text-sm px-2 py-1 bg-green-500 text-white rounded"
                    disabled={loading}
                  >
                    {loading ? 'Saving' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm px-2 py-1 border rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-sm px-2 py-1 border rounded"
                  >
                    Edit
                  </button>
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
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
