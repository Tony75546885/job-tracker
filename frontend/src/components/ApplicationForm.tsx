import { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import type { Application } from "../types";

interface Props {
  initial?: Application | null;
  onSubmit: (data: Partial<Application>) => void;
  onClose: () => void;
}

export function ApplicationForm({ initial, onSubmit, onClose }: Props) {
  const [company, setCompany] = useState(initial?.company ?? "");
  const [position, setPosition] = useState(initial?.position ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [salary, setSalary] = useState(initial?.salary ?? "");
  const [techStack, setTechStack] = useState(
    initial?.techStack?.join(", ") ?? "",
  );
  const [followUpAt, setFollowUpAt] = useState(
    initial?.followUpAt?.slice(0, 10) ?? "",
  );
  const [pasteText, setPasteText] = useState("");
  const [parsing, setParsing] = useState(false);

  const handleParse = async () => {
    if (!pasteText.trim()) return;
    setParsing(true);
    try {
      const { data } = await api.post("/ai/parse-job", { text: pasteText });
      if (data.company) setCompany(data.company);
      if (data.position) setPosition(data.position);
      if (data.techStack) setTechStack(data.techStack.join(", "));
      if (data.salary) setSalary(data.salary);
      toast.success("Ogłoszenie sparsowane!");
      setPasteText("");
    } catch {
      toast.error("Nie udało się sparsować ogłoszenia");
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      company,
      position,
      url: url || undefined,
      notes: notes || undefined,
      salary: salary || undefined,
      techStack: techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      followUpAt: followUpAt || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? "Edytuj aplikację" : "Nowa aplikacja"}
          </h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 rounded-lg border border-dashed border-purple-300 bg-purple-50 p-3">
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-purple-700">
            <Sparkles size={14} />
            Wklej opis oferty (AI auto-fill)
          </label>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Wklej tekst ogłoszenia o pracę..."
            className="mb-2 w-full rounded border border-purple-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows={3}
          />
          <button
            onClick={handleParse}
            disabled={parsing || !pasteText.trim()}
            className="flex items-center gap-1 rounded bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {parsing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {parsing ? "Parsuję..." : "Parsuj ogłoszenie"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Firma *
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stanowisko *
              </label>
              <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Link do oferty
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="https://..."
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Wynagrodzenie
              </label>
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="np. 15-20k PLN"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Follow-up
              </label>
              <input
                value={followUpAt}
                onChange={(e) => setFollowUpAt(e.target.value)}
                type="date"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tech Stack (oddzielony przecinkami)
            </label>
            <input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notatki
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {initial ? "Zapisz" : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
