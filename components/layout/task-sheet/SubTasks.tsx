import { useState, useCallback, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Subtask } from "@/types/Task";
import { Edit2, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export interface SubTaskProps {
  defaultSubtasks: Subtask[];
}

// Memoized individual subtask component to prevent unnecessary re-renders
interface SubtaskItemProps {
  subtask: Subtask;
  isEditing: boolean;
  editedTitle: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onStartEdit: (id: string, title: string) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onEditTitleChange: (title: string) => void;
}

function SubtaskItem({
  subtask,
  isEditing,
  editedTitle,
  onToggle,
  onRemove,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTitleChange,
}: SubtaskItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSaveEdit(subtask.id);
      } else if (e.key === "Escape") {
        onCancelEdit();
      }
    },
    [subtask.id, onSaveEdit, onCancelEdit]
  );

  const handleToggle = useCallback(() => {
    onToggle(subtask.id);
  }, [subtask.id, onToggle]);

  const handleRemove = useCallback(() => {
    onRemove(subtask.id);
  }, [subtask.id, onRemove]);

  const handleStartEdit = useCallback(() => {
    onStartEdit(subtask.id, subtask.title);
  }, [subtask.id, subtask.title, onStartEdit]);

  const handleSaveEdit = useCallback(() => {
    onSaveEdit(subtask.id);
  }, [subtask.id, onSaveEdit]);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-background/30 transition-colors group">
      <Checkbox
        checked={subtask.completed}
        onCheckedChange={handleToggle}
        aria-label={`Mark "${subtask.title}" as ${subtask.completed ? "incomplete" : "complete"}`}
      />

      {isEditing ? (
        <Input
          ref={inputRef}
          value={editedTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 h-8 px-2 py-1 text-sm"
          autoFocus
          aria-label="Edit subtask title"
        />
      ) : (
        <div className="flex-1 flex items-center gap-2 group/text">
          <span
            onClick={handleStartEdit}
            className={cn(
              "flex-1 cursor-pointer text-sm py-1 px-1 rounded hover:bg-background/30 transition-colors",
              subtask.completed && "line-through text-muted-foreground"
            )}
            title="Click to edit"
          >
            {subtask.title}
          </span>
          <Button
            variant="ghost"
            onClick={handleStartEdit}
            className="opacity-0  group-hover/text:opacity-100 h-8 w-8 p-0"
            aria-label="Edit subtask"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive-foreground"
        aria-label={`Delete "${subtask.title}"`}
      >
        <Trash className="h-4 w-4 text-primary" onClick={handleRemove} />
      </Button>

      {/* <Trash className="h-4 w-4 text-primary" onClick={handleRemove} /> */}
    </div>
  );
}

export function SubTasks({ defaultSubtasks }: SubTaskProps) {
  // console.log("defaultSubtasks:", defaultSubtasks);
  const [subtasks, setSubtasks] = useState<Subtask[]>(defaultSubtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const newSubtaskInputRef = useRef<HTMLInputElement>(null);

  // Memoized handlers to prevent unnecessary re-renders
  const handleAddSubtask = useCallback(() => {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;

    const newItem: Subtask = {
      id: uuidv4(),
      title: trimmed,
      completed: false,
    };

    setSubtasks([...subtasks, newItem]);
    setNewSubtask("");

    // Focus back to input for better UX
    setTimeout(() => newSubtaskInputRef.current?.focus(), 0);
  }, [newSubtask, subtasks, setSubtasks]);

  const handleToggleSubtask = useCallback(
    (id: string) => {
      setSubtasks(
        subtasks.map((subtask) =>
          subtask.id === id
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        )
      );
    },
    [subtasks, setSubtasks]
  );

  const handleRemoveSubtask = useCallback(
    (id: string) => {
      setSubtasks(subtasks.filter((subtask) => subtask.id !== id));

      // Clear editing state if the deleted item was being edited
      if (editingId === id) {
        setEditingId(null);
        setEditedTitle("");
      }
    },
    [subtasks, setSubtasks, editingId]
  );

  const handleStartEdit = useCallback((id: string, title: string) => {
    setEditingId(id);
    setEditedTitle(title);
  }, []);

  const handleSaveEdit = useCallback(
    (id: string) => {
      const trimmed = editedTitle.trim();
      if (!trimmed) {
        // Don't save empty titles
        setEditingId(null);
        setEditedTitle("");
        return;
      }

      setSubtasks(
        subtasks.map((subtask) =>
          subtask.id === id ? { ...subtask, title: trimmed } : subtask
        )
      );
      setEditingId(null);
      setEditedTitle("");
    },
    [editedTitle, subtasks, setSubtasks]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditedTitle("");
  }, []);

  const handleEditTitleChange = useCallback((title: string) => {
    setEditedTitle(title);
  }, []);

  const handleNewSubtaskKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSubtask();
      }
    },
    [handleAddSubtask]
  );

  const handleNewSubtaskChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewSubtask(e.target.value);
    },
    []
  );

  // Calculate completion stats
  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const hasSubtasks = totalCount > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Subtasks
          {hasSubtasks && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({completedCount}/{totalCount} completed)
            </span>
          )}
        </Label>
      </div>

      {hasSubtasks && (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              isEditing={editingId === subtask.id}
              editedTitle={editedTitle}
              onToggle={handleToggleSubtask}
              onRemove={handleRemoveSubtask}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onEditTitleChange={handleEditTitleChange}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          ref={newSubtaskInputRef}
          value={newSubtask}
          onChange={handleNewSubtaskChange}
          onKeyDown={handleNewSubtaskKeyDown}
          placeholder="Add new subtask..."
          className="flex-1"
          aria-label="New subtask title"
        />
        <Button
          onClick={handleAddSubtask}
          variant="secondary"
          disabled={!newSubtask.trim()}
          className="shrink-0"
        >
          Add
        </Button>
        <input type="hidden" name="subtasks" value={JSON.stringify(subtasks)} />
      </div>

      {!hasSubtasks && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <div className="mb-2">No subtasks yet</div>
          <div>Break down your task into smaller steps</div>
        </div>
      )}
    </div>
  );
}
