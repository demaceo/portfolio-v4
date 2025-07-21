import Toolbelt from "../components/Toolbelt/Toolbelt";
import ServiceSpectrum from "../components/ServiceSpectrum/ServiceSpectrum";
import PrinciplesList from "../components/PrinciplesList/PrinciplesList";
import Layout from "../components/Layout/Layout";
import FloatingContactButton from "../components/FloatingContactButton/FloatingContactButton";

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
