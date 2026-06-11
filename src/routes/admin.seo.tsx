import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/site/AdminPlaceholder";
export const Route = createFileRoute("/admin/seo")({ component: () => <AdminPlaceholder title="SEO Settings" desc="Global meta tags, sitemap and analytics."/> });
