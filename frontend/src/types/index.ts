export type ApplicationStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface Application {
  id: string;
  company: string;
  position: string;
  url: string | null;
  status: ApplicationStatus;
  notes: string | null;
  salary: string | null;
  techStack: string[];
  appliedAt: string;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const STATUS_COLUMNS: {
  id: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { id: "APPLIED", label: "Aplikowano", color: "bg-blue-500" },
  { id: "INTERVIEW", label: "Rozmowa", color: "bg-yellow-500" },
  { id: "OFFER", label: "Oferta", color: "bg-green-500" },
  { id: "REJECTED", label: "Odrzucone", color: "bg-red-500" },
];
