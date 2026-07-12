import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import services from "@/data/services";
import tools from "@/data/toolbelt";
import { TECH_ICON_MAP, TECH_ICON_FALLBACK } from "@/lib/constants/techIcons";
import { ModalProps, type Service } from "@/lib/types";
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

// A service renders as a vertical stack of panels. Panel 0 ("Overview") is
// synthesized from the service's outcome + description; any extra panels defined
// in the data follow it and are reached by swiping vertically.
type RenderPanel = {
  label: string;
  outcome?: string;
  body?: string;
  points?: string[];
  kind?: "list" | "tags";
};

const buildPanels = (s: Service): RenderPanel[] => [
  { label: "Overview", outcome: s.outcome, body: s.description },
  ...(s.panels ?? []),
];

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

  // Vertical carousel state — which info panel within the current service.
  const [panelIndex, setPanelIndex] = useState(0);
  const [vDirection, setVDirection] = useState<1 | -1>(1);

  const reduceMotion = useReducedMotion();

  const service = services[serviceIndex];
  const panels = useMemo(() => buildPanels(service), [service]);
  const panelCount = panels.length;
  const panel = panels[panelIndex] ?? panels[0];

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

  // Vertical panel slide — the y-axis mirror of plateVariants.
  const panelVariants: Variants = useMemo(
    () => ({
      enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 24 : -24 }),
      center: {
        opacity: 1,
        y: 0,
        transition: reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      },
      exit: (dir: number) => ({
        opacity: 0,
        y: dir > 0 ? -20 : 20,
        transition: reduceMotion ? { duration: 0 } : { duration: 0.14, ease: "easeIn" },
      }),
    }),
    [reduceMotion]
  );

  const navigateService = (dir: 1 | -1) => {
    if (services.length <= 1) return;
    setDirection(dir);
    setServiceIndex((prev) => (prev + dir + services.length) % services.length);
    // Reset the vertical axis whenever the service changes.
    setPanelIndex(0);
    setVDirection(1);
  };

  const goToService = (index: number) => {
    if (index === serviceIndex) return;
    setDirection(index > serviceIndex ? 1 : -1);
    setServiceIndex(index);
    setPanelIndex(0);
    setVDirection(1);
  };

  const navigatePanel = (dir: 1 | -1) => {
    const next = panelIndex + dir;
    if (next < 0 || next > panelCount - 1) return; // clamp — no wrap
    setVDirection(dir);
    setPanelIndex(next);
  };

  const goToPanel = (index: number) => {
    if (index === panelIndex) return;
    setVDirection(index > panelIndex ? 1 : -1);
    setPanelIndex(index);
  };

  const onStageKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        navigateService(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        navigateService(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        navigatePanel(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        navigatePanel(1);
        break;
    }
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
              <div
                className={styles.plateStage}
                aria-live="polite"
                tabIndex={0}
                role="group"
                aria-roledescription="carousel"
                aria-label="Services — swipe or use arrow keys: left/right to change service, up/down for details"
                onKeyDown={onStageKeyDown}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.article
                    key={serviceIndex}
                    custom={direction}
                    variants={plateVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={styles.servicePlate}
                    drag
                    dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    dragElastic={0.08}
                    dragDirectionLock
                    onDragEnd={(_, { offset, velocity }) => {
                      // dragDirectionLock keeps the off-axis offset ~0, so the
                      // larger absolute offset tells us which axis the user meant.
                      if (Math.abs(offset.x) >= Math.abs(offset.y)) {
                        const power = Math.abs(offset.x) + Math.abs(velocity.x) * 0.25;
                        if (power > 70) navigateService(offset.x > 0 ? -1 : 1);
                      } else {
                        const power = Math.abs(offset.y) + Math.abs(velocity.y) * 0.25;
                        if (power > 70) navigatePanel(offset.y > 0 ? -1 : 1);
                      }
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

                    {/* Vertical panel viewport — pinned header stays above this. */}
                    <div className={styles.panelViewport}>
                      <AnimatePresence mode="wait" custom={vDirection} initial={false}>
                        <motion.div
                          key={panelIndex}
                          custom={vDirection}
                          variants={panelVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className={styles.panelSlide}
                          role="group"
                          aria-roledescription="slide"
                          aria-label={`Panel ${panelIndex + 1} of ${panelCount}: ${panel.label}`}
                        >
                          {panelIndex > 0 && (
                            <span className={styles.panelEyebrow}>{panel.label}</span>
                          )}

                          {panel.outcome && (
                            <p className={styles.plateOutcome}>{panel.outcome}</p>
                          )}

                          {panel.body && (
                            <p className={styles.plateDescription}>{panel.body}</p>
                          )}

                          {panel.points &&
                            (panel.kind === "tags" ? (
                              <ul className={styles.panelTags}>
                                {panel.points.map((pt) => (
                                  <li key={pt} className={styles.panelTag}>
                                    <FontAwesomeIcon
                                      icon={TECH_ICON_MAP[pt] ?? TECH_ICON_FALLBACK}
                                      className={styles.panelTagIcon}
                                      aria-hidden="true"
                                    />
                                    {pt}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <ul className={styles.panelPoints}>
                                {panel.points.map((pt) => (
                                  <li key={pt} className={styles.panelPoint}>
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className={styles.panelPointIcon}
                                      aria-hidden="true"
                                    />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.article>
                </AnimatePresence>

                {/* Vertical rail — sibling of the draggable article to avoid
                    tap-vs-drag conflicts. Hidden when a service has only Overview. */}
                {panelCount > 1 && (
                  <div className={styles.plateVRail} aria-label="Service details">
                    <button
                      type="button"
                      className={styles.plateVArrow}
                      onClick={() => navigatePanel(-1)}
                      disabled={panelIndex === 0}
                      aria-label="Previous detail"
                    >
                      <FontAwesomeIcon icon={faChevronUp} />
                    </button>

                    <div className={styles.plateVDots}>
                      {panels.map((p, i) => (
                        <button
                          key={p.label}
                          type="button"
                          className={`${styles.plateVDot} ${i === panelIndex ? styles.active : ""}`}
                          aria-current={i === panelIndex ? "true" : undefined}
                          aria-label={`Show ${p.label}`}
                          onClick={() => goToPanel(i)}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      className={styles.plateVArrow}
                      onClick={() => navigatePanel(1)}
                      disabled={panelIndex === panelCount - 1}
                      aria-label="Next detail"
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  </div>
                )}
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
