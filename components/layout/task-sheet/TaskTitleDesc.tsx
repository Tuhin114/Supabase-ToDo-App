import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TitleDescriptionFieldsProps {
  defaultTitle?: string;
  defaultDescription?: string;
  disabled?: boolean;
  className?: string;
}

export const TitleDescriptionFields = memo<TitleDescriptionFieldsProps>(
  ({
    defaultTitle = "",
    defaultDescription = "",
    disabled = false,
    className = "space-y-4",
  }) => (
    <div className={className}>
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultTitle}
          disabled={disabled}
          placeholder="Enter task title..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultDescription}
          rows={3}
          disabled={disabled}
          placeholder="Add task description..."
        />
      </div>
    </div>
  )
);

TitleDescriptionFields.displayName = "TitleDescriptionFields";
