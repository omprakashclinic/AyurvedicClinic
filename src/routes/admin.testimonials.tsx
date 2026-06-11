import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/site/AdminPlaceholder";
export const Route = createFileRoute("/admin/testimonials")({ component: () => <AdminPlaceholder title="Testimonials" desc="Moderate and feature patient stories."/> });
