import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/site/AdminPlaceholder";
export const Route = createFileRoute("/admin/gallery")({ component: () => <AdminPlaceholder title="Gallery Management" desc="Upload, categorise and organise images."/> });
