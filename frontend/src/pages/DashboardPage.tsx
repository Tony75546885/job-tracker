import { useNavigate } from "react-router-dom";
import { LogOut, Briefcase } from "lucide-react";
import { KanbanBoard } from "../components/KanbanBoard";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Briefcase className="text-white" size={16} />
            </div>
            <span className="text-lg font-bold text-gray-900">Job Tracker</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              <LogOut size={14} />
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <KanbanBoard />
      </main>
    </div>
  );
}
