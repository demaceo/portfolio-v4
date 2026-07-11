import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import services from "@/data/services";
import tools from "@/data/toolbelt";
import { ModalProps } from "@/lib/types";
import { AppView } from "@/components/features/shell";
import ToolbeltGraph from "./ToolbeltGraph";
import styles from "./SkillsetAppView.module.css";

type SkillsetTab = "services" | "tools";

const orderedCategories = [
  "Frontend",
  "Backend",
  "Cloud",
  "DevOps",
  "Design",
  "Collaboration",
  "Package Management",
  "Project Management",
  "Documentation",
];

const serviceOutcomes: Record<string, string> = {
  sb1: "Conversion-focused web experiences with production analytics.",
  sb2: "App flows that feel native, fast, and easy to learn.",
  sb3: "Accessible, responsive interfaces that scale in codebase and team size.",
  sb4: "Predictable integrations and stable system-to-system communication.",
  sb5: "Repeatable releases with deployment confidence and lower operational drag.",
  sb6: "Clean domain models, faster queries, and durable data governance.",
  sb7: "Less manual overhead through targeted automation and scripting.",
};

// Tools highlighted with the signature stroke/glow in the toolbelt graph.
const signatureStack = ["React", "JavaScript", "Next.js", "Node.js", "AWS"];

interface SkillsetAppViewProps extends ModalProps {
  initialServiceId?: string;
}

const SkillsetAppView: React.FC<SkillsetAppViewProps> = ({
  onClose,
  initialServiceId,
}) => {
  const [activeTab, setActiveTab] = useState<SkillsetTab>("services");

  // Services carousel state — seeded once from a MenuBar deep link, if any.
  const [serviceIndex, setServiceIndex] = useState(() => {
    const idx = services.findIndex((s) => s.id === initialServiceId);
    return idx === -1 ? 0 : idx;
  });
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();

  const service = services[serviceIndex];

  // Plate slide timings collapse to instant under prefers-reduced-motion; the
  // enter/exit offsets stay so AnimatePresence still swaps plates correctly.
  const plateVariants: Variants = useMemo(
    () => ({
      enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
      center: {
        opacity: 1,
        x: 0,
        transition: reduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      },
      exit: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? -28 : 28,
        transition: reduceMotion ? { duration: 0 } : { duration: 0.16, ease: "easeIn" },
      }),
    }),
    [reduceMotion]
  );

  const navigateService = (dir: 1 | -1) => {
    if (services.length <= 1) return;
    setDirection(dir);
    setServiceIndex((prev) => (prev + dir + services.length) % services.length);
  };

  const goToService = (index: number) => {
    if (index === serviceIndex) return;
    setDirection(index > serviceIndex ? 1 : -1);
    setServiceIndex(index);
  };

  return (
    <AppView onClose={onClose} title="Skillset" titleId="skillset-title">
      <div className={styles.skillset}>
        {/* ── Tabs ─────────────────────────────────────── */}
        <div className={styles.skillTopbar}>
          <div className={styles.skillTabs} role="tablist" aria-label="Skillset sections">
            <button
              className={`${styles.skillTab} ${activeTab === "services" ? styles.active : ""}`}
              onClick={() => setActiveTab("services")}
              role="tab"
              id="services-tab"
              aria-controls="services-panel"
              aria-selected={activeTab === "services"}
              type="button"
            >
              Services
            </button>
            <button
              className={`${styles.skillTab} ${activeTab === "tools" ? styles.active : ""}`}
              onClick={() => setActiveTab("tools")}
              role="tab"
              id="tools-tab"
              aria-controls="tools-panel"
              aria-selected={activeTab === "tools"}
              type="button"
            >
              Toolbelt
            </button>
          </div>

          <a
            className={styles.skillStudioByline}
            href="https://www.anappidea.llc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/logos/mhi-logo.png"
              alt="An App Idea, LLC"
              width={22}
              height={22}
              className={styles.skillStudioLogo}
            />
            <span>An App Idea, LLC</span>
          </a>
        </div>

        {/* Both panels stay mounted so the Toolbelt graph keeps its
            expanded / dragged / search state across tab switches. The inactive
            panel is hidden — see .skill-services[hidden] / .skill-tools[hidden]. */}
        <section
          className={styles.skillServices}
          role="tabpanel"
          id="services-panel"
          aria-labelledby="services-tab"
          hidden={activeTab !== "services"}
        >
              <div className={styles.plateStage} aria-live="polite">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.article
                    key={serviceIndex}
                    custom={direction}
                    variants={plateVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={styles.servicePlate}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.08}
                    onDragEnd={(_, { offset, velocity }) => {
                      const power = Math.abs(offset.x) + Math.abs(velocity.x) * 0.25;
                      if (power > 70) navigateService(offset.x > 0 ? -1 : 1);
                    }}
                  >
                    <div className={styles.plateIconHalo} aria-hidden="true">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={72}
                        height={72}
                        className={styles.plateIcon}
                      />
                    </div>

                    <span
                      className={styles.plateCounter}
                      aria-label={`Service ${serviceIndex + 1} of ${services.length}`}
                    >
                      <span className={styles.counterCurrent}>
                        {String(serviceIndex + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.counterSep}> / </span>
                      <span className={styles.counterTotal}>
                        {String(services.length).padStart(2, "0")}
                      </span>
                    </span>

                    <h2 className={styles.plateTitle}>{service.title}</h2>

                    {serviceOutcomes[service.id] && (
                      <p className={styles.plateOutcome}>{serviceOutcomes[service.id]}</p>
                    )}

                    <p className={styles.plateDescription}>{service.description}</p>
                  </motion.article>
                </AnimatePresence>
              </div>

              <div className={styles.plateNav}>
                <button
                  type="button"
                  className={styles.plateArrow}
                  onClick={() => navigateService(-1)}
                  aria-label="Previous service"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div className={styles.plateDots} aria-label="Service navigation">
                  {services.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.plateDot} ${i === serviceIndex ? styles.active : ""}`}
                      aria-current={i === serviceIndex ? "true" : undefined}
                      aria-label={`Go to ${s.title}`}
                      onClick={() => goToService(i)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.plateArrow}
                  onClick={() => navigateService(1)}
                  aria-label="Next service"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
        </section>

        {/* ── Toolbelt: collapsible force-directed graph ─ */}
        <section
          className={styles.skillTools}
          role="tabpanel"
          id="tools-panel"
          aria-labelledby="tools-tab"
          hidden={activeTab !== "tools"}
        >
          <ToolbeltGraph
            tools={tools}
            orderedCategories={orderedCategories}
            signatureStack={signatureStack}
            active={activeTab === "tools"}
          />
        </section>
      </div>
    </AppView>
  );
};

export default SkillsetAppView;
