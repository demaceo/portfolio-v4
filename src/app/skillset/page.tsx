import Toolbelt from "@/components/features/skills/Toolbelt/Toolbelt";
import ServiceSpectrum from "@/components/features/skills/ServiceSpectrum/ServiceSpectrum";
import PrinciplesList from "@/components/features/skills/PrinciplesList/PrinciplesList";
import Layout from "@/components/ui/Layout/Layout";
import FloatingContactButton from "@/components/features/contact/FloatingContactButton/FloatingContactButton";

export default function SkillsetPage() {
  return (
    <Layout>
      <ServiceSpectrum />
      <Toolbelt />
      <PrinciplesList />
      <FloatingContactButton />
    </Layout>
  );
}
