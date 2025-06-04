import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Handle toggle complete which will do the complete to incomplete and vice versa and also update the status field to done and for reverse to todo and update the update_at

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  // Step 1: Fetch the task
  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select("id, completed, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !task) {
    throw new Error("Task not found");
  }

  // Step 2: Toggle values
  const updatedTask = {
    completed: !task.completed,
    status: task.completed ? "todo" : "done",
  };

  // Step 3: Update in Supabase
  const { data, error: updateError } = await supabase
    .from("tasks")
    .update(updatedTask)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updateError) {
    throw new Error("Failed to update task");
  }

  return NextResponse.json(data);
}
