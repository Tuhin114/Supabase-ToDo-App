import React, {
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
  memo,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export interface TaskTagsProps {
  defaultTags: string[];
}

interface TagItemProps {
  tag: string;
  onRemove: (tag: string) => void;
}

const TagItem = memo(({ tag, onRemove }: TagItemProps) => (
  <Badge
    variant="outline"
    className="flex items-center gap-1 pr-1 bg-secondary"
  >
    {tag}
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-auto p-0"
      onClick={() => onRemove(tag)}
    >
      <X className="h-3 w-3" />
    </Button>
  </Badge>
));

export const TaskTags: React.FC<TaskTagsProps> = memo(({ defaultTags }) => {
  const [tags, setTags] = useState<string[]>(defaultTags || []);
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = useCallback(() => {
    const trimmed = newTag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setNewTag("");
  }, [newTag, tags]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags]
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <div>
      {/* Hidden form field for tags */}
      <input type="hidden" name="tags" value={JSON.stringify(safeTags)} />

      <Label className="text-sm font-medium">Tags</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {safeTags.map((tag, index) => (
          <TagItem
            key={`${tag}-${index}`}
            tag={tag}
            onRemove={handleRemoveTag}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          value={newTag}
          onChange={handleInputChange}
          placeholder="Add new tag..."
          className="flex-1"
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={!newTag.trim()}
          variant="secondary"
        >
          Add
        </Button>
      </div>
    </div>
  );
});

// Ensure default export matches named for proper import
export default TaskTags;
