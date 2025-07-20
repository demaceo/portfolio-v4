"use client";

import React from "react";
import "./AboutMe.css";

const AboutMe: React.FC = () => {
  return (
    <section className="about-me-container">
      <div className="about-me-title-container">
        <h1 className="about-me-title shadowed-text">About Demaceo</h1>
      </div>
      <div className="about-me-content">
        <p>
          I’m a lifelong learner who thrives on connecting ideas, people, and
          possibilities. Whether breaking down complex problems or zooming out
          to see the bigger picture, I’m comfortable navigating ambiguity and
          turning challenges into actionable solutions.
        </p>
        <p>
          Known for my adaptability, empathy, and reliability, I deliver results
          - whether working solo or collaborating with a team. I’m eager to
          explore new technologies, spark meaningful conversations, and apply
          knowledge to create tangible, positive impact.
        </p>
        <p>
          I excel at untangling problems, uncovering connections, and getting to
          the root of “why.” Complexity doesn’t intimidate me - it inspires
          growth and fresh perspectives. I approach challenges with integrity,
          focusing on genuine collaboration and shared purpose.
        </p>
        <p>
          I naturally take a big picture approach, noticing patterns others
          might overlook while always keeping the human element front and
          center. Genuine conversations, honest collaboration, and a shared
          sense of purpose energize me, and integrity is fundamental to how I
          show up.
        </p>
        <p>
          Empathy drives how I build relationships and foster collaboration. I
          listen deeply, value diverse viewpoints, and aim to create meaningful
          change. Guided by continuous growth - personal, professional, and
          collective - I’m motivated to make a difference wherever insight meets
          action.
        </p>
        <br />
        <h2 className="shadowed-text">TLDR</h2>
        <p>
          Whether I’m leading a project, supporting a team, or exploring new
          ideas, I bring together curiosity, reliability, and a genuine desire
          to make a difference. I’m at my best where insight meets action, and
          where growth is both the journey and the goal.
        </p>
        <ul className="about-me-list">
          <li>
            <span
              className="pill-tag"
              data-tooltip="See patterns, simplify complexity, and generate creative solutions while building trust through actively listening and collaborating"
            >
              <strong>Intuitive Problem Solver</strong>
            </span>
          </li>
          {/* <li>
            <span
              className="pill-tag"
              data-tooltip="Energized by change, challenge, and continuous learning"
            >
              <strong>Adaptive Learner</strong>
            </span>
          </li> */}
          <li>
            <span
              className="pill-tag"
              data-tooltip="Listen deeply, build trust, and foster inclusive collaboration"
            >
              <strong>Empathetic Connector</strong>
            </span>
          </li>
          <li>
            <span
              className="pill-tag"
              data-tooltip="Detail-oriented, organized, and steady - someone you can count on to follow through"
            >
              <strong>Analytical & Reliable</strong>
            </span>
          </li>
          <li>
            <span
              className="pill-tag"
              data-tooltip="Quick to understand and articulate new concepts; skilled at building rapport with people from all walks of life"
            >
              <strong>Transparent Communicator</strong>
            </span>
          </li>
          <li>
            <span
              className="pill-tag"
              data-tooltip="Driven by curiosity, integrity, and a desire to make a positive impact"
            >
              <strong>Purpose-Driven Innovator</strong>
            </span>
          </li>
          <li>
            <span
              className="pill-tag"
              data-tooltip="under construction: stay tuned to find out!"
            >
              <strong>& more...</strong>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default AboutMe;
