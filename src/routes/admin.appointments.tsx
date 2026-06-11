import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/site/AdminPlaceholder";
export const Route = createFileRoute("/admin/appointments")({ component: () => <AdminPlaceholder title="Appointments" desc="Manage upcoming, pending and completed appointments."/> });
