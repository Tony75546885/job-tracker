import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  ExternalLink,
  Calendar,
  Edit2,
} from "lucide-react";
import type { Application } from "../types";

interface Props {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({ app, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
      } transition-shadow`}
    >
      <div className="mb-1 flex items-start justify-between" {...attributes} {...listeners}>
        <h3 className="cursor-grab font-semibold text-gray-900 text-sm">
          {app.company}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="mb-2 text-xs text-gray-600">{app.position}</p>

      {app.techStack.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {app.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(app.appliedAt).toLocaleDateString("pl-PL")}
        </span>
        {app.url && (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {app.salary && (
        <p className="mt-1 text-xs font-medium text-green-600">{app.salary}</p>
      )}
    </div>
  );
}
