import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Get all tasks for a category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { id: categoryId } = await params;
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: categoryTasks, error } = await supabase
      .from("tasks")
      .select(
        `
      *,
      subtasks(*)
      
    `
      )
      .eq("category_id", categoryId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(categoryTasks);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
