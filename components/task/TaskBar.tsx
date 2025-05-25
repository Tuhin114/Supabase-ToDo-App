"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category, Subtask, Task } from "@/types/Task";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Calendar, Clock, Plus, Trash2, X } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskDetailsProps {
  task: Task;
  categories: Category[];
  onTaskUpdate: (task: Task) => void;
  onAddCategory: (category: Category) => void;
  onClose: () => void;
}

export function TaskBar({
  task,
  categories,
  onTaskUpdate,
  onAddCategory,
  onClose,
}: TaskDetailsProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newTag, setNewTag] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleSave = () => {
    onTaskUpdate(editedTask);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTask.tags.includes(newTag.trim())) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskObj: Subtask = {
        id: `${editedTask.id}-${Date.now()}`,
        title: newSubtask.trim(),
        completed: false,
      };
      setEditedTask({
        ...editedTask,
        subtasks: [...editedTask.subtasks, newSubtaskObj],
      });
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      ),
    });
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.filter(
        (subtask) => subtask.id !== subtaskId
      ),
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
        name: newCategoryName.trim(),
      };
      onAddCategory(newCategory);
      //   setEditedTask({ ...editedTask, category: newCategory.id });
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  const timeEstimateOptions = [
    "15 mins",
    "30 mins",
    "45 mins",
    "1 hr",
    "2 hrs",
    "3 hrs",
    "4 hrs",
    "1 day",
    "2 days",
    "3 days",
    "1 week",
    "2 weeks",
    "1 month",
    "2 months",
    "3 months",
    "1 yr",
  ];
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <ChevronRight />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-secondary w-full sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle className="font-semibold text-2xl">
            Task Details
          </SheetTitle>
          <SheetDescription>
            Make changes to your task here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Task Title */}
          <div>
            <Input
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className=" text-lg font-medium "
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <Label className=" text-sm font-medium">Description</Label>
            <Textarea
              value={editedTask.description || ""}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              className="  mt-2 "
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className=" text-sm font-medium">Status</Label>
              <Select
                value={editedTask.status}
                onValueChange={(value) =>
                  setEditedTask({
                    ...editedTask,
                    status: value as Task["status"],
                  })
                }
              >
                <SelectTrigger className="  mt-2 ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" shadow-lg">
                  <SelectItem value="to do">To Do</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="in review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="on hold">On Hold</SelectItem>
                  <SelectItem value="stuck">Stuck</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className=" text-sm font-medium">Priority</Label>
              <Select
                value={editedTask.priority}
                onValueChange={(value) =>
                  setEditedTask({
                    ...editedTask,
                    priority: value as Task["priority"],
                  })
                }
              >
                <SelectTrigger className="  mt-2 ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" shadow-lg">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div>
            <Label className=" text-sm font-medium">Category</Label>
            <div className="flex gap-2 mt-2">
              <Select
                value={editedTask.category?.id || ""}
                onValueChange={(value) =>
                  setEditedTask({
                    ...editedTask,
                    category: categories.find((c) => c.id === value) || {
                      id: value,
                      name: value,
                    },
                  })
                }
              >
                <SelectTrigger className="flex-1 ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" shadow-lg">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog
                open={isAddingCategory}
                onOpenChange={setIsAddingCategory}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="">
                    <Plus className="h-4 w-4 mr-2" /> Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className=" shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="">Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="  "
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddCategory} className="">
                        Add Category
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingCategory(false)}
                        className=""
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className=" text-sm font-medium">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full   mt-2 justify-start hover:bg-gray-50"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editedTask.startDate
                      ? format(new Date(editedTask.startDate), "MMM dd, yyyy")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0  shadow-lg">
                  <CalendarComponent
                    mode="single"
                    selected={
                      editedTask.startDate
                        ? new Date(editedTask.startDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setEditedTask({
                        ...editedTask,
                        startDate: date || new Date(),
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className=" text-sm font-medium">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full   mt-2 justify-start hover:bg-gray-50"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editedTask.dueDate
                      ? format(new Date(editedTask.dueDate), "MMM dd, yyyy")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0  shadow-lg">
                  <CalendarComponent
                    mode="single"
                    selected={
                      editedTask.dueDate
                        ? new Date(editedTask.dueDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setEditedTask({
                        ...editedTask,
                        dueDate: date || new Date(),
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time Estimate */}
          <div>
            <Label className=" text-sm font-medium">Time Estimate</Label>
            <Select
              value={editedTask.timeAllocated}
              onValueChange={(value) =>
                setEditedTask({ ...editedTask, timeAllocated: value })
              }
            >
              <SelectTrigger className="  mt-2 ">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className=" shadow-lg">
                {timeEstimateOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label className=" text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedTask.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 "
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="  flex-1 "
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button onClick={handleAddTag} size="sm" className="">
                <Plus className="h-4 w-4 mr-2" /> Add Tag
              </Button>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <Label className=" text-sm font-medium">Subtasks</Label>
            <div className="space-y-2 mt-2">
              {editedTask.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-3  rounded-lg border border-gray-200"
                >
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => handleToggleSubtask(subtask.id)}
                    className=""
                  />
                  <span
                    className={cn(
                      "flex-1 ",
                      subtask.completed && "line-through text-gray-500"
                    )}
                  >
                    {subtask.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className=""
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add New Subtask"
                className="  flex-1 "
                onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
              />
              <Button onClick={handleAddSubtask} size="sm" className="">
                <Plus className="h-4 w-4 mr-2" /> Add Subtask
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
