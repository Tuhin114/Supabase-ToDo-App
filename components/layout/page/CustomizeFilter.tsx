// components/layout/page/CustomizeFilter.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ListFilter, ChevronDownIcon } from "lucide-react";

const STATUS_OPTIONS = [
  "todo",
  "inprogress",
  "inreview",
  "done",
  "waiting",
  "onhold",
  "stuck",
] as const;
const PRIORITY_OPTIONS = ["high", "moderate", "low"] as const;

export type StatusType = (typeof STATUS_OPTIONS)[number];
export type PriorityType = (typeof PRIORITY_OPTIONS)[number];

interface CustomizedFilterProps {
  /** Current selections (arrays) from parent */
  selectedStatus: StatusType[];
  selectedPriority: PriorityType[];
  /** Called when user clicks “Save” in the dropdown */
  onSave: (
    newStatusSelections: StatusType[],
    newPrioritySelections: PriorityType[]
  ) => void;
  /** Called when user clicks “Clear” in the dropdown */
  onClear: () => void;
}

export default function CustomizedFilter({
  selectedStatus,
  selectedPriority,
  onSave,
  onClear,
}: CustomizedFilterProps) {
  // local “temp” selections inside the open dropdown
  const [tempStatus, setTempStatus] = useState<StatusType[]>([]);
  const [tempPriority, setTempPriority] = useState<PriorityType[]>([]);
  const [open, setOpen] = useState(false);

  // Whenever the parent’s selected arrays change, mirror them into temp
  useEffect(() => {
    setTempStatus(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    setTempPriority(selectedPriority);
  }, [selectedPriority]);

  // Are any filters currently applied?
  const isFiltered = selectedStatus.length > 0 || selectedPriority.length > 0;

  const toggleTempStatus = (status: StatusType) => {
    setTempStatus((prev) =>
      prev.includes(status)
        ? prev.filter((v) => v !== status)
        : [...prev, status]
    );
  };

  const toggleTempPriority = (priority: PriorityType) => {
    setTempPriority((prev) =>
      prev.includes(priority)
        ? prev.filter((v) => v !== priority)
        : [...prev, priority]
    );
  };

  const handleSave = () => {
    onSave(tempStatus, tempPriority);
    setOpen(false);
  };

  const handleClear = () => {
    onClear();
    setTempStatus([]);
    setTempPriority([]);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={isFiltered ? "default" : "outline"}>
          <ListFilter className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">
            {isFiltered ? "Filter Applied" : "Customize Filter"}
          </span>
          <span className="lg:hidden">
            {isFiltered ? "Filtered" : "Filter"}
          </span>
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-4 w-64">
        {/* Status Section */}
        <div className="mb-4">
          <p className="font-semibold mb-2 text-sm">Status</p>
          {STATUS_OPTIONS.map((status) => (
            <label key={status} className="flex items-center space-x-2 mb-1">
              <Checkbox
                checked={tempStatus.includes(status)}
                onCheckedChange={() => toggleTempStatus(status)}
              />
              <span className="capitalize text-sm">{status}</span>
            </label>
          ))}
        </div>

        {/* Priority Section */}
        <div className="mb-4">
          <p className="font-semibold mb-2 text-sm">Priority</p>
          {PRIORITY_OPTIONS.map((priority) => (
            <label key={priority} className="flex items-center space-x-2 mb-1">
              <Checkbox
                checked={tempPriority.includes(priority)}
                onCheckedChange={() => toggleTempPriority(priority)}
              />
              <span className="capitalize text-sm">{priority}</span>
            </label>
          ))}
        </div>

        {/* Clear + Save Buttons */}
        <div className="flex justify-between gap-2">
          <Button variant="ghost" className="w-full" onClick={handleClear}>
            Clear
          </Button>
          <Button className="w-full" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
