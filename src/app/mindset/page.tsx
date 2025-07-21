import AboutMe from "@/components/shared/AboutMe/AboutMe";
import Layout from "@/components/ui/Layout/Layout";
import FloatingContactButton from "@/components/features/contact/FloatingContactButton/FloatingContactButton";

export default function MindsetPage() {
  return (
    <Layout>
      <AboutMe />
      <FloatingContactButton />
    </Layout>
  );
}
