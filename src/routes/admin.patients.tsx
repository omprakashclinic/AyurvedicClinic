import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/site/AdminPlaceholder";
export const Route = createFileRoute("/admin/patients")({ component: () => <AdminPlaceholder title="Patients" desc="Patient records, history and prescriptions."/> });
