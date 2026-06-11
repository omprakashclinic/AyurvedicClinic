import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/site/AdminPlaceholder";
export const Route = createFileRoute("/admin/settings")({ component: () => <AdminPlaceholder title="Website Settings" desc="Branding, contact info, social handles."/> });
