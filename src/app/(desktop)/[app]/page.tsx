import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SeoLayer from "@/components/seo/SeoLayer";
import { APP_ROUTES, type AppKey } from "@/lib/constants/appRoutes";
import { pageMetadata } from "@/lib/seo";

// One page for every app route (/mindset, /skillset, /projects, /scrapbook), generated from
// APP_ROUTES. Anything else under the desktop group is a 404, as before.
//
// The desktop itself, and the overlay that opens for this path, come from the group layout and
// `useModalState`; this page only supplies the metadata and the server-rendered text.
export const dynamicParams = false;

type Params = { app: string };

const routeFor = (app: string) => APP_ROUTES.find((route) => route.key === app);

export function generateStaticParams(): Params[] {
  return APP_ROUTES.map((route) => ({ app: route.key }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const route = routeFor((await params).app);
  if (!route) return {};
  return pageMetadata({
    title: route.title,
    description: route.description,
    path: route.path,
    indexable: route.indexable,
  });
}

export default async function AppRoutePage({ params }: { params: Promise<Params> }) {
  const route = routeFor((await params).app);
  if (!route) notFound();
  return <SeoLayer app={route.key as AppKey} />;
}
