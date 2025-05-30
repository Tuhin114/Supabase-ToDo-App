import { Task } from "@/types/Task";

export const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Plan product launch event",
    description:
      "Coordinate all aspects of the upcoming product launch including marketing, logistics, and invites.",
    status: "inprogress",
    priority: "high",
    time: {
      start: new Date("2025-06-01T09:00:00.000Z"),
      end: new Date("2025-06-30T17:00:00.000Z"),
      timeEstimate: "1 month",
      allDay: false,
    },
    tags: ["event", "product", "launch"],
    category: { id: "1", name: "Work" },
    subtasks: [
      { id: "1a", title: "Finalize venue", completed: true },
      { id: "1b", title: "Send invitations", completed: false },
    ],
    completed: false,
    color: "sky",
    createdAt: new Date("2025-05-10"),
    updatedAt: new Date("2025-05-20"),
  },
  {
    id: "2",
    title: "Organize family reunion",
    description:
      "Plan the yearly family get-together with food, games, and travel arrangements.",
    status: "todo",
    priority: "moderate",
    time: {
      start: new Date("2025-07-05T10:00:00.000Z"),
      end: new Date("2025-07-07T18:00:00.000Z"),
      timeEstimate: "3 days",
      allDay: true,
    },
    tags: ["family", "travel", "holiday"],
    category: { id: "2", name: "Personal" },
    subtasks: [
      { id: "2a", title: "Book location", completed: false },
      { id: "2b", title: "Coordinate potluck", completed: false },
    ],
    completed: false,
    color: "rose",
    createdAt: new Date("2025-05-12"),
    updatedAt: new Date("2025-05-18"),
  },
  {
    id: "3",
    title: "Write blog series on productivity",
    description:
      "Create a multi-part blog series on productivity techniques and tools.",
    status: "inreview",
    priority: "high",
    time: {
      start: new Date("2025-05-15T12:00:00.000Z"),
      end: new Date("2025-06-10T16:00:00.000Z"),
      timeEstimate: "4 weeks",
      allDay: false,
    },
    tags: ["writing", "blog", "productivity"],
    category: { id: "1", name: "Work" },
    subtasks: [
      { id: "3a", title: "Outline series topics", completed: true },
      { id: "3b", title: "Draft first two posts", completed: true },
      { id: "3c", title: "Review and edit", completed: false },
    ],
    completed: false,
    color: "emerald",
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-21"),
  },
  {
    id: "4",
    title: "Update passport and visa",
    description:
      "Renew passport and apply for travel visa before trip to Europe.",
    status: "waiting",
    priority: "moderate",
    time: {
      start: new Date("2025-06-01T08:30:00.000Z"),
      end: new Date("2025-06-01T10:30:00.000Z"),
      timeEstimate: "2 hrs",
      allDay: false,
    },
    tags: ["documents", "travel"],
    category: { id: "2", name: "Personal" },
    subtasks: [
      { id: "4a", title: "Schedule appointment", completed: true },
      { id: "4b", title: "Fill out application", completed: false },
    ],
    completed: false,
    color: "amber",
    createdAt: new Date("2025-04-25"),
    updatedAt: new Date("2025-05-10"),
  },
  {
    id: "5",
    title: "Fix bugs from sprint backlog",
    description:
      "Address critical and high-priority bugs left in the current sprint backlog.",
    status: "stuck",
    priority: "high",
    time: {
      start: new Date("2025-05-27T11:00:00.000Z"),
      end: new Date("2025-05-27T16:00:00.000Z"),
      timeEstimate: "5 hrs",
      allDay: false,
    },
    tags: ["bug", "development", "critical"],
    category: { id: "1", name: "Work" },
    subtasks: [
      { id: "5a", title: "Reproduce issue on staging", completed: false },
      { id: "5b", title: "Fix and deploy", completed: false },
    ],
    completed: false,
    color: "violet",
    createdAt: new Date("2025-05-15"),
    updatedAt: new Date("2025-05-28"),
  },
  {
    id: "6",
    title: "Review quarterly expenses",
    description:
      "Go through all business-related expenses for Q2 and submit reports.",
    status: "done",
    priority: "low",
    time: {
      start: new Date("2025-05-10T09:00:00.000Z"),
      end: new Date("2025-05-10T11:00:00.000Z"),
      timeEstimate: "2 hrs",
      allDay: false,
    },
    tags: ["finance", "review"],
    category: { id: "1", name: "Work" },
    subtasks: [],
    completed: true,
    color: "orange",
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-10"),
  },
  {
    id: "7",
    title: "Backup personal files",
    description:
      "Organize and back up important documents and media to cloud storage.",
    status: "onhold",
    priority: "low",
    time: {
      start: new Date("2025-06-01T15:00:00.000Z"),
      end: new Date("2025-06-01T17:00:00.000Z"),
      timeEstimate: "2 hrs",
      allDay: false,
    },
    tags: ["backup", "files", "personal"],
    category: { id: "2", name: "Personal" },
    subtasks: [],
    completed: false,
    color: "rose",
    createdAt: new Date("2025-05-17"),
    updatedAt: new Date("2025-05-18"),
  },
];

export const sampleSubTasks = [
  {
    id: "1",
    title: "Analyze competitor content",
    completed: true,
  },
  {
    id: "2",
    title: "Create content calendar",
    completed: false,
  },
  {
    id: "3",
    title: "Gather required documents",
    completed: true,
  },
  {
    id: "4",
    title: "Book appointment",
    completed: false,
  },
];

export const colorOptionsData = [
  {
    value: "sky",
    label: "Sky",
    bgClass: "bg-sky-400 data-[state=checked]:bg-sky-400",
    borderClass: "border-sky-400 data-[state=checked]:border-sky-400",
  },
  {
    value: "amber",
    label: "Amber",
    bgClass: "bg-amber-400 data-[state=checked]:bg-amber-400",
    borderClass: "border-amber-400 data-[state=checked]:border-amber-400",
  },
  {
    value: "violet",
    label: "Violet",
    bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
    borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
  },
  {
    value: "rose",
    label: "Rose",
    bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
    borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
  },
  {
    value: "emerald",
    label: "Emerald",
    bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
    borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
  },
  {
    value: "orange",
    label: "Orange",
    bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
    borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
  },
];

export const timeUnitOptions = [
  { value: "mins", label: "Minutes" },
  { value: "hrs", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
  { value: "yrs", label: "Years" },
];
