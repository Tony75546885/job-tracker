import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ApplicationCard } from "./ApplicationCard";
import type { Application, ApplicationStatus } from "../types";

interface Props {
  id: ApplicationStatus;
  label: string;
  color: string;
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({
  id,
  label,
  color,
  applications,
  onEdit,
  onDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`flex min-h-[200px] w-72 flex-shrink-0 flex-col rounded-xl bg-gray-50 ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <div className="flex items-center gap-2 p-3 pb-2">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
        <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {applications.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 p-2">
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
