import SeoLayer from "@/components/seo/SeoLayer";
import { pageMetadata } from "@/lib/seo";

// The canonical is declared per page, not in the root layout, so /woozyx3 doesn't inherit one
// pointing at the home page.
export const metadata = pageMetadata({ path: "/" });

export default function Home() {
  return <SeoLayer app={null} />;
}
