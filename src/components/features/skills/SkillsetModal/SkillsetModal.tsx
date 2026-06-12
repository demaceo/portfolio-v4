import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import services from "@/data/services";
import tools from "@/data/toolbelt";
import { ModalProps } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import "./SkillsetModal.css";

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

// Tools shown larger as the "signature stack" rail.
const signatureStack = ["React", "TypeScript", "Next.js", "Node.js", "AWS"];

const plateVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 56 : -56 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -56 : 56 }),
};

const SkillsetModal: React.FC<ModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<SkillsetTab>("services");

  // Services carousel state
  const [serviceIndex, setServiceIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Toolbelt state
  const [toolQuery, setToolQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const service = services[serviceIndex];

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

  const categories = useMemo(() => {
    const discovered = Array.from(new Set(tools.map((tool) => tool.category)));

    const prioritized = orderedCategories.filter((category) =>
      discovered.includes(category)
    );

    const remaining = discovered
      .filter((category) => !prioritized.includes(category))
      .sort((a, b) => a.localeCompare(b));

    return [...prioritized, ...remaining];
  }, []);

  const filteredTools = useMemo(() => {
    const normalizedQuery = toolQuery.trim().toLowerCase();

    return tools.filter((tool) => {
      const categoryMatches =
        selectedCategory === "All" || tool.category === selectedCategory;

      const queryMatches =
        normalizedQuery.length === 0 ||
        tool.tooltip.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [selectedCategory, toolQuery]);

  const toolsByCategory = useMemo(() => {
    return filteredTools.reduce((acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, typeof tools>);
  }, [filteredTools]);

  const visibleCategories = useMemo(() => {
    return Object.keys(toolsByCategory).sort((a, b) => {
      const aIndex = categories.indexOf(a);
      const bIndex = categories.indexOf(b);

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [categories, toolsByCategory]);

  return (
    <ModalFrame
      onClose={onClose}
      title="Skillset"
      size="lg"
      variant="light"
      titleId="skillset-title"
      closeAriaLabel="Close skillset modal"
    >
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
            href="https://www.milehighinterface.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/logos/mhi-logo.png"
              alt="Mile High Interface LLC"
              width={22}
              height={22}
              className="skill-studio-logo"
            />
            <span>Mile High Interface LLC</span>
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
              transition={{ duration: 0.2, ease: "easeOut" }}
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
                    transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                        priority
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

          {/* ── Toolbelt: proficiency wall ─────────────── */}
          {activeTab === "tools" && (
            <motion.section
              key="tools"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="skill-tools"
              role="tabpanel"
              id="tools-panel"
              aria-labelledby="tools-tab"
            >
              <div className="wall-toolbar">
                <label className="wall-search" htmlFor="tools-query">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="wall-search-icon"
                    aria-hidden="true"
                  />
                  <input
                    id="tools-query"
                    type="search"
                    value={toolQuery}
                    onChange={(event) => setToolQuery(event.target.value)}
                    placeholder="Search tools or categories"
                    aria-label="Search tools or categories"
                  />
                </label>

                <div className="wall-chips" role="group" aria-label="Tool categories">
                  <button
                    type="button"
                    className={`wall-chip ${selectedCategory === "All" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("All")}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`wall-chip ${selectedCategory === category ? "active" : ""}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wall-scroll">
                {visibleCategories.length === 0 ? (
                  <div className="wall-empty">
                    <h3>No matching tools</h3>
                    <p>Try a different search term or switch category filters.</p>
                  </div>
                ) : (
                  visibleCategories.map((category) => (
                    <section key={category} className="wall-group">
                      <header className="wall-group-head">
                        <h3>{category}</h3>
                        <span className="wall-group-count">
                          {toolsByCategory[category].length}
                        </span>
                      </header>

                      <motion.div
                        className="wall-grid"
                        role="list"
                        aria-label={`${category} tools`}
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.025 } },
                        }}
                      >
                        {toolsByCategory[category].map((tool, index) => {
                          const isSignature = signatureStack.includes(tool.tooltip);
                          return (
                            <motion.div
                              key={`${category}-${tool.tooltip}-${index}`}
                              className={`wall-tile ${isSignature ? "signature" : ""}`}
                              role="listitem"
                              title={tool.tooltip}
                              variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 },
                              }}
                            >
                              <FontAwesomeIcon
                                className="wall-tile-icon"
                                icon={tool.icon}
                              />
                              <span className="wall-tile-label">{tool.tooltip}</span>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </section>
                  ))
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </ModalFrame>
  );
};

export default SkillsetModal;
