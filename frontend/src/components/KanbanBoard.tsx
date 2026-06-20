import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationForm } from "./ApplicationForm";
import { ApplicationCard } from "./ApplicationCard";
import {
  useApplications,
  useCreateApplication,
  useUpdateApplication,
  useUpdateStatus,
  useDeleteApplication,
} from "../hooks/useApplications";
import type { Application, ApplicationStatus } from "../types";
import { STATUS_COLUMNS } from "../types";

export function KanbanBoard() {
  const { data: applications, isLoading, error } = useApplications();
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const statusMutation = useUpdateStatus();
  const deleteMutation = useDeleteApplication();

  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const groupedApps = STATUS_COLUMNS.map((col) => ({
    ...col,
    applications: (applications ?? []).filter((a) => a.status === col.id),
  }));

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications?.find((a) => a.id === event.active.id);
    if (app) setActiveApp(app);
  };

  const handleDragOver = () => {};

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveApp(null);
    const { active, over } = event;
    if (!over) return;

    const app = applications?.find((a) => a.id === active.id);
    if (!app) return;

    const targetColumn = STATUS_COLUMNS.find((c) => c.id === over.id);
    const targetApp = applications?.find((a) => a.id === over.id);
    const newStatus: ApplicationStatus | undefined =
      targetColumn?.id ?? targetApp?.status;

    if (newStatus && newStatus !== app.status) {
      statusMutation.mutate(
        { id: app.id, status: newStatus },
        {
          onError: () => toast.error("Nie udało się zmienić statusu"),
        },
      );
    }
  };

  const handleCreate = (data: Partial<Application>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        toast.success("Aplikacja dodana!");
      },
      onError: () => toast.error("Nie udało się dodać aplikacji"),
    });
  };

  const handleUpdate = (data: Partial<Application>) => {
    if (!editingApp) return;
    updateMutation.mutate(
      { id: editingApp.id, ...data },
      {
        onSuccess: () => {
          setEditingApp(null);
          toast.success("Zaktualizowano!");
        },
        onError: () => toast.error("Nie udało się zaktualizować"),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Na pewno chcesz usunąć tę aplikację?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Usunięto"),
      onError: () => toast.error("Nie udało się usunąć"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        Nie udało się załadować aplikacji. Spróbuj odświeżyć stronę.
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Moje aplikacje
          <span className="ml-2 text-base font-normal text-gray-400">
            ({applications?.length ?? 0})
          </span>
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={16} />
          Dodaj aplikację
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {groupedApps.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              color={col.color}
              applications={col.applications}
              onEdit={setEditingApp}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApp && (
            <ApplicationCard
              app={activeApp}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

      {showForm && (
        <ApplicationForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}

      {editingApp && (
        <ApplicationForm
          initial={editingApp}
          onSubmit={handleUpdate}
          onClose={() => setEditingApp(null)}
        />
      )}
    </>
  );
}
