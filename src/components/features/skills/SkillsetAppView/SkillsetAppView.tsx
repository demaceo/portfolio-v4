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
import "./SkillsetAppView.css";

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

const SkillsetAppView: React.FC<ModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<SkillsetTab>("services");

  // Services carousel state
  const [serviceIndex, setServiceIndex] = useState(0);
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
      <div className="skillset">
        {/* ── Tabs ─────────────────────────────────────── */}
        <div className="skill-topbar">
          <div className="skill-tabs" role="tablist" aria-label="Skillset sections">
            <button
              className={`skill-tab ${activeTab === "services" ? "active" : ""}`}
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
              className={`skill-tab ${activeTab === "tools" ? "active" : ""}`}
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
            className="skill-studio-byline"
            href="https://www.anappidea.llc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/logos/mhi-logo.png"
              alt="An App Idea, LLC"
              width={22}
              height={22}
              className="skill-studio-logo"
            />
            <span>An App Idea, LLC</span>
          </a>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Services: capability plates carousel ───── */}
          {activeTab === "services" && (
            <motion.section
              key="services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
              className="skill-services"
              role="tabpanel"
              id="services-panel"
              aria-labelledby="services-tab"
            >
              <div className="plate-stage" aria-live="polite">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.article
                    key={serviceIndex}
                    custom={direction}
                    variants={plateVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="service-plate"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.08}
                    onDragEnd={(_, { offset, velocity }) => {
                      const power = Math.abs(offset.x) + Math.abs(velocity.x) * 0.25;
                      if (power > 70) navigateService(offset.x > 0 ? -1 : 1);
                    }}
                  >
                    <div className="plate-icon-halo" aria-hidden="true">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={72}
                        height={72}
                        className="plate-icon"
                      />
                    </div>

                    <span
                      className="plate-counter"
                      aria-label={`Service ${serviceIndex + 1} of ${services.length}`}
                    >
                      <span className="counter-current">
                        {String(serviceIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="counter-sep"> / </span>
                      <span className="counter-total">
                        {String(services.length).padStart(2, "0")}
                      </span>
                    </span>

                    <h2 className="plate-title">{service.title}</h2>

                    {serviceOutcomes[service.id] && (
                      <p className="plate-outcome">{serviceOutcomes[service.id]}</p>
                    )}

                    <p className="plate-description">{service.description}</p>
                  </motion.article>
                </AnimatePresence>
              </div>

              <div className="plate-nav">
                <button
                  type="button"
                  className="plate-arrow"
                  onClick={() => navigateService(-1)}
                  aria-label="Previous service"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div className="plate-dots" aria-label="Service navigation">
                  {services.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`plate-dot ${i === serviceIndex ? "active" : ""}`}
                      aria-current={i === serviceIndex ? "true" : undefined}
                      aria-label={`Go to ${s.title}`}
                      onClick={() => goToService(i)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="plate-arrow"
                  onClick={() => navigateService(1)}
                  aria-label="Next service"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </motion.section>
          )}

          {/* ── Toolbelt: collapsible force-directed graph ─ */}
          {activeTab === "tools" && (
            <motion.section
              key="tools"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
              className="skill-tools"
              role="tabpanel"
              id="tools-panel"
              aria-labelledby="tools-tab"
            >
              <ToolbeltGraph
                tools={tools}
                orderedCategories={orderedCategories}
                signatureStack={signatureStack}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </AppView>
  );
};

export default SkillsetAppView;
