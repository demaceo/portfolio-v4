import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
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
  sb1: "Outcome: conversion-focused web experiences with production analytics.",
  sb2: "Outcome: app flows that feel native, fast, and easy to learn.",
  sb3: "Outcome: accessible, responsive interfaces that scale in codebase and team size.",
  sb4: "Outcome: predictable integrations and stable system-to-system communication.",
  sb5: "Outcome: repeatable releases with deployment confidence and lower operational drag.",
  sb6: "Outcome: clean domain models, faster queries, and durable data governance.",
  sb7: "Outcome: less manual overhead through targeted automation and scripting.",
};

const getServiceSummary = (description: string): string => {
  const firstSentence = description.split(". ")[0]?.trim();
  if (!firstSentence) return description;
  return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
};

const SkillsetModal: React.FC<ModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<SkillsetTab>("services");
  const [expandedService, setExpandedService] = useState<string | null>(
    services[0]?.id ?? null
  );
  const [toolQuery, setToolQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      titleId="skillset-title"
      closeAriaLabel="Close skillset modal"
    >
      <div className="skillset-modal-content">
        <header className="skillset-intro">
          <p className="skillset-eyebrow">Capability Overview</p>
          <h2>Focused execution across product, engineering, and delivery.</h2>
          <p>
            The goal here is clarity: what I offer, how I work, and which tools I
            use to ship reliable product outcomes.
          </p>
        </header>

        <div className="skillset-modal-tabs" role="tablist" aria-label="Skillset sections">
          <button
            className={`skillset-tab ${activeTab === "services" ? "active" : ""}`}
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
            className={`skillset-tab ${activeTab === "tools" ? "active" : ""}`}
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

        <div className="skillset-modal-body">
          <AnimatePresence mode="wait">
            {activeTab === "services" && (
              <motion.section
                key="services"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="skillset-section"
                role="tabpanel"
                id="services-panel"
                aria-labelledby="services-tab"
              >
                <article className="studio-card" aria-label="Mile High Interface profile">
                  <div className="studio-brand">
                    <Image
                      src="/logos/mhi-logo.png"
                      alt="Mile High Interface LLC"
                      width={56}
                      height={56}
                      className="studio-logo"
                      priority
                    />
                    <div>
                      <p className="studio-label">Mile High Interface LLC</p>
                      <h3>Full-stack product and interface delivery studio.</h3>
                    </div>
                  </div>
                  <div className="studio-links">
                    <a
                      href="https://www.milehighinterface.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                    <a
                      href="https://github.com/demaceo/mhi"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source
                    </a>
                  </div>
                </article>

                <div className="services-stack" role="list" aria-label="Service offerings">
                  {services.map((service) => {
                    const isExpanded = expandedService === service.id;
                    return (
                      <article
                        key={service.id}
                        className={`service-item ${isExpanded ? "expanded" : ""}`}
                        role="listitem"
                      >
                        <button
                          type="button"
                          className="service-item-trigger"
                          onClick={() =>
                            setExpandedService((prev) =>
                              prev === service.id ? null : service.id
                            )
                          }
                          aria-expanded={isExpanded}
                          aria-controls={`service-detail-${service.id}`}
                        >
                          <span className="service-item-head">
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={28}
                              height={28}
                            />
                            <span className="service-item-title">{service.title}</span>
                          </span>
                          <span className="service-toggle-indicator" aria-hidden="true">
                            {isExpanded ? "-" : "+"}
                          </span>
                        </button>

                        <p className="service-item-summary">
                          {getServiceSummary(service.description)}
                        </p>
                        <p className="service-item-outcome">
                          {serviceOutcomes[service.id]}
                        </p>

                        {isExpanded && (
                          <p id={`service-detail-${service.id}`} className="service-item-detail">
                            {service.description}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {activeTab === "tools" && (
              <motion.section
                key="tools"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="skillset-section"
                role="tabpanel"
                id="tools-panel"
                aria-labelledby="tools-tab"
              >
                <div className="tools-toolbar">
                  <label className="tools-search" htmlFor="tools-query">
                    <span>Search</span>
                    <input
                      id="tools-query"
                      type="search"
                      value={toolQuery}
                      onChange={(event) => setToolQuery(event.target.value)}
                      placeholder="Find tools or categories"
                    />
                  </label>

                  <div className="tools-category-filter" role="tablist" aria-label="Tool categories">
                    <button
                      type="button"
                      className={`category-chip ${selectedCategory === "All" ? "active" : ""}`}
                      onClick={() => setSelectedCategory("All")}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={`category-chip ${
                          selectedCategory === category ? "active" : ""
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {visibleCategories.length === 0 ? (
                  <div className="tools-empty-state">
                    <h3>No matching tools</h3>
                    <p>Try a different search term or switch category filters.</p>
                  </div>
                ) : (
                  <div className="tools-categories">
                    {visibleCategories.map((category) => (
                      <article key={category} className="tool-category">
                        <header>
                          <h3>{category}</h3>
                          <span>{toolsByCategory[category].length}</span>
                        </header>

                        <div className="tool-pill-grid" role="list" aria-label={`${category} tools`}>
                          {toolsByCategory[category].map((tool, index) => (
                            <div
                              key={`${category}-${tool.tooltip}-${index}`}
                              className="tool-pill"
                              role="listitem"
                              title={tool.tooltip}
                            >
                              <FontAwesomeIcon className="tool-pill-icon" icon={tool.icon} />
                              <span>{tool.tooltip}</span>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ModalFrame>
  );
};

export default SkillsetModal;
