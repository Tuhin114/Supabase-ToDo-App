"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { colorOptionsData } from "@/constants/data";
import { TaskColor } from "@/types/Task";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ColorPickerProps {
  defaultColor?: TaskColor;
}

export function TaskColorPicker({ defaultColor }: ColorPickerProps) {
  const [color, setColor] = useState<TaskColor>(defaultColor || "sky");

  return (
    <div className="space-y-1.5">
      <Label htmlFor="color">Color</Label>
      <RadioGroup
        value={color}
        onValueChange={(val: TaskColor) => setColor(val)}
        className="flex gap-2"
      >
        {colorOptionsData.map(({ value, label, bgClass, borderClass }) => (
          <RadioGroupItem
            key={value}
            id={`color-${value}`}
            value={value}
            aria-label={label}
            className={cn(
              "size-6 rounded-full shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors",
              bgClass,
              borderClass
            )}
          />
        ))}
      </RadioGroup>

      {/* ✅ Hidden input to send to FormData */}
      <input type="hidden" name="color" value={color} />
    </div>
  );
}
