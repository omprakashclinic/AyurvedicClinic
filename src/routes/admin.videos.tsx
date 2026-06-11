import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/site/AdminPlaceholder";
export const Route = createFileRoute("/admin/videos")({ component: () => <AdminPlaceholder title="Doctor Videos" desc="Manage YouTube knowledge library."/> });
