import { CategoryDetails } from "@/types/Category";
import { createClient } from "@/utils/supabase/server";
import { getRanges, parseTimeEstimateToHours } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  // const {
  //   data: { user },
  //   error: authError,
  // } = await supabase.auth.getUser();

  // if (authError || !user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "week";

    // Fetch category name
    const { data: category, error: catErr } = await supabase
      .from("categories")
      .select("name")
      .eq("id", params.id)
      .single();
    if (catErr || !category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );

    // Fetch tasks created in range
    const ranges = getRanges(range);
    const startRange = ranges[0].start;
    const endRange = ranges[ranges.length - 1].end;

    const { data: tasks, error: taskErr } = await supabase
      .from("tasks")
      .select("id, status, priority, time, created_at, completed")
      .eq("category_id", params.id)
      .gte("created_at", startRange.toISOString())
      .lte("created_at", endRange.toISOString());
    if (taskErr) throw taskErr;

    // Fetch related subtasks
    const taskIds = tasks.map((t) => t.id);
    const { data: subtasks, error: subtaskErr } = await supabase
      .from("subtasks")
      .select("task_id, completed")
      .in("task_id", taskIds);

    if (subtaskErr) throw subtaskErr;

    // Base aggregates
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const overdueTasks = tasks.filter((t) => {
      if (!t.time?.end) return false;
      const end = new Date(t.time.end);
      return !t.completed && end < new Date();
    }).length;

    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter((st) => st.completed).length;

    const totalTimeEstimated = tasks.reduce((sum, t) => {
      return (
        sum +
        (t.time?.timeEstimate
          ? parseTimeEstimateToHours(t.time.timeEstimate)
          : 0)
      );
    }, 0);

    const timeSpent = tasks
      .filter((t) => t.completed)
      .reduce((sum, t) => {
        return (
          sum +
          (t.time?.timeEstimate
            ? parseTimeEstimateToHours(t.time.timeEstimate)
            : 0)
        );
      }, 0);
    const priority = { high: 0, moderate: 0, low: 0 };
    tasks.forEach((t) => {
      priority[t.priority as keyof typeof priority]++;
    });

    const status = {
      todo: 0,
      inprogress: 0,
      inreview: 0,
      done: 0,
      waiting: 0,
      onhold: 0,
      stuck: 0,
    };
    tasks.forEach((t) => {
      status[t.status as keyof typeof status]++;
    });

    // Build trend data over ranges
    const trend = ranges.map((r) => {
      const rangeTasks = tasks.filter((t) => {
        const created = new Date(t.created_at);
        return created >= r.start && created <= r.end;
      });

      const taskIdsInRange = rangeTasks.map((t) => t.id);
      const rangeSubtasks = subtasks.filter((st) =>
        taskIdsInRange.includes(st.task_id)
      );

      const totalTasks = rangeTasks.length;
      const completedTasks = rangeTasks.filter((t) => t.completed).length;
      const overdueTasks = rangeTasks.filter((t) => {
        if (!t.time?.end) return false;
        const end = new Date(t.time.end);
        return !t.completed && end < new Date();
      }).length;

      const totalTimeEstimated = rangeTasks.reduce((sum, t) => {
        return (
          sum +
          (t.time?.timeEstimate
            ? parseTimeEstimateToHours(t.time.timeEstimate)
            : 0)
        );
      }, 0);

      const timeSpent = rangeTasks
        .filter((t) => t.completed)
        .reduce((sum, t) => {
          return (
            sum +
            (t.time?.timeEstimate
              ? parseTimeEstimateToHours(t.time.timeEstimate)
              : 0)
          );
        }, 0);

      const totalSubtasks = rangeSubtasks.length;
      const completedSubtasks = rangeSubtasks.filter(
        (st) => st.completed
      ).length;

      return {
        label: r.label,
        count: {
          totalTasks,
          completedTasks,
          overdueTasks,
          totalTimeEstimated,
          timeSpent,
          totalSubtasks,
          completedSubtasks,
        },
      };
    });

    const response: CategoryDetails = {
      id: params.id,
      name: category.name,
      tasks: { totalTasks, completedTasks, completionPercentage, overdueTasks },
      timeEstimated: { totalTimeEstimated, timeSpent },
      priority,
      status,
      subtasks: { totalSubtasks, completedSubtasks },
      trend,
    };

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
