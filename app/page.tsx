"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaReact, FaNodeJs, FaBars, FaTimes, FaWhatsapp, FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiJsonwebtokens,
  SiMysql,
  SiGithub,
  SiGit,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTailwindcss,
  SiLinkedin,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  driftX: number;
  driftY: number;
}

const DARK_COLORS = [
  "rgba(139,92,246,0.8)",
  "rgba(59,130,246,0.8)",
  "rgba(236,72,153,0.8)",
  "rgba(16,185,129,0.8)",
  "rgba(245,158,11,0.8)",
  "rgba(239,68,68,0.8)",
  "rgba(99,102,241,0.8)",
  "rgba(20,184,166,0.8)",
];

const LIGHT_COLORS = [
  "rgba(251,191,36,0.8)",
  "rgba(249,115,22,0.8)",
  "rgba(239,68,68,0.8)",
  "rgba(16,185,129,0.8)",
  "rgba(59,130,246,0.8)",
  "rgba(236,72,153,0.8)",
  "rgba(139,92,246,0.8)",
  "rgba(20,184,166,0.8)",
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorColor, setCursorColor] = useState("rgba(139,92,246,1)");
  const counterRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const colorIndexRef = useRef(0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 8) return;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const colors = darkMode ? DARK_COLORS : LIGHT_COLORS;
      const count = Math.floor(Math.random() * 2) + 2;
      const newParticles: SmokeParticle[] = [];

      for (let i = 0; i < count; i++) {
        const color = colors[colorIndexRef.current % colors.length];
        colorIndexRef.current++;
        newParticles.push({
          id: counterRef.current++,
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * 55 + 25,
          color,
          driftX: (Math.random() - 0.5) * 100,
          driftY: -(Math.random() * 110 + 40),
        });
      }

      setCursorColor(
        colors[colorIndexRef.current % colors.length].replace(
          /[\d.]+\)$/,
          "1)",
        ),
      );
      setParticles((prev) => [...prev.slice(-60), ...newParticles]);
    },
    [darkMode],
  );

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <main
      onMouseMove={handleMouseMove}
      className={`min-h-screen overflow-x-hidden transition-colors duration-500 relative cursor-none ${
        darkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-white via-gray-100 to-white text-gray-900"
      }`}
    >
      {/* CUSTOM CURSOR */}
      <div
        style={{
          position: "fixed",
          left: cursor.x - 16,
          top: cursor.y - 16,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `2.5px solid ${cursorColor}`,
          boxShadow: `0 0 12px ${cursorColor}, 0 0 24px ${cursorColor}`,
          background: cursorColor.replace(/[\d.]+\)$/, "0.15)"),
          pointerEvents: "none",
          zIndex: 9999,
          transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
        }}
      />

      {/* SMOKE PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0.95,
                scale: 0.3,
                x: p.x - p.size / 2,
                y: p.y - p.size / 2,
              }}
              animate={{
                opacity: 0,
                scale: 4,
                x: p.x - p.size / 2 + p.driftX,
                y: p.y - p.size / 2 + p.driftY,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onAnimationComplete={() => removeParticle(p.id)}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: `radial-gradient(circle at 40% 40%, ${p.color} 0%, transparent 70%)`,
                filter: "blur(10px)",
                pointerEvents: "none",
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      

       {/* NAVBAR — Pill style like screenshot */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-5">
        <nav
          className={`max-w-6xl mx-auto rounded-2xl border px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-500 backdrop-blur-xl ${
            darkMode
              ? "bg-[#0e0e0e]/90 border-white/10 shadow-[0_4px_40px_rgba(0,0,0,0.7)]"
              : "bg-white/90 border-black/10 shadow-[0_4px_40px_rgba(0,0,0,0.1)]"
          }`}
        >
          {/* NAME */}
          <h1
            className={`text-sm md:text-base font-bold tracking-[0.2em] uppercase ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Muhammad Awais
          </h1>

          {/* DESKTOP NAV LINKS + DARK MODE TOGGLE */}
          <div className="hidden md:flex items-center gap-8">
            {["ABOUT", "TECHNOLOGIES", "PROJECTS", "CONTACT"].map((link) => (
              <a
                key={link}
                href={`#${link}`}
                className={`text-xs font-semibold tracking-[0.15em] transition-colors duration-300 relative group ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link}
                <span
                  className={`absolute -bottom-0.5 left-0 w-full h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full ${
                    darkMode ? "bg-violet-400" : "bg-orange-400"
                  }`}
                />
              </a>
            ))}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-500 focus:outline-none shadow-md border cursor-pointer flex-shrink-0 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-yellow-300 border-yellow-400"
              }`}
              aria-label="Toggle Dark Mode"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-500 shadow-md ${
                  darkMode
                    ? "translate-x-7 bg-indigo-500"
                    : "translate-x-0 bg-white"
                }`}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>
          </div>

          {/* MOBILE — DARK MODE + MENU BUTTON */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-500 focus:outline-none shadow-md border cursor-pointer flex-shrink-0 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-yellow-300 border-yellow-400"
              }`}
              aria-label="Toggle Dark Mode"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all duration-500 shadow-md ${
                  darkMode
                    ? "translate-x-6 bg-indigo-500"
                    : "translate-x-0 bg-white"
                }`}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-900 hover:bg-black/5"
              }`}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`md:hidden max-w-6xl mx-auto mt-2 rounded-2xl border overflow-hidden backdrop-blur-xl ${
                darkMode
                  ? "bg-[#0e0e0e]/95 border-white/10 shadow-[0_4px_40px_rgba(0,0,0,0.7)]"
                  : "bg-white/95 border-black/10 shadow-[0_4px_40px_rgba(0,0,0,0.1)]"
              }`}
            >
              <div className="flex flex-col py-2">
                {["ABOUT", "TECHNOLOGIES", "PROJECTS", "CONTACT"].map(
                  (link) => (
                    <a
                      key={link}
                      href={`#${link}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-6 py-3 text-sm font-semibold tracking-[0.15em] transition-colors duration-300 ${
                        darkMode
                          ? "text-gray-400 hover:text-white hover:bg-white/5"
                          : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
                      }`}
                    >
                      {link}
                    </a>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* HERO */}
      <section className="flex flex-col justify-center px-6 py-28 md:py-32 max-w-6xl mx-auto">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
          {/* TEXT CONTENT */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Muhammad{" "}
              <span
                className={
                  darkMode
                    ? "bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-violet-600 via-orange-500 to-pink-600 bg-clip-text text-transparent"
                }
              >
                Awais
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15 }}
              className={`text-xl md:text-2xl lg:text-3xl mb-6 font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              MERN Stack Developer
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className={`h-1 w-24 md:w-32 mb-6 mx-auto md:mx-0 rounded-full ${
                darkMode
                  ? "bg-gradient-to-r from-violet-400 to-cyan-400"
                  : "bg-gradient-to-r from-violet-600 to-orange-500"
              }`}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className={`text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              I build modern, scalable and high-performance web applications
              using React, Next.js, Node.js and MongoDB.
            </motion.p>
          </div>

          {/* PROFILE IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="relative flex-shrink-0 order-1 md:order-2"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div
                className="absolute -inset-3 rounded-full blur-2xl opacity-50"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, #8b5cf6, #06b6d4, #ec4899)"
                    : "linear-gradient(135deg, #7c3aed, #f97316, #db2777)",
                }}
              />

              <div
                className={`relative p-1.5 rounded-full bg-gradient-to-br ${
                  darkMode
                    ? "from-violet-500 via-cyan-400 to-pink-500"
                    : "from-violet-600 via-orange-500 to-pink-600"
                } shadow-2xl`}
              >
                <div
                  className={`rounded-full p-1 ${
                    darkMode ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  <Image
                    src="/images/awais-Dev.png"
                    alt="Muhammad Awais - MERN Stack Developer"
                    width={280}
                    height={280}
                    priority
                    className="w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover object-top"
                  />
                </div>
              </div>

              <div
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap shadow-lg border ${
                  darkMode
                    ? "bg-gray-900/90 border-white/10 text-violet-300"
                    : "bg-white/90 border-black/10 text-violet-700"
                }`}
              >
                Available for Work
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="ABOUT" className="scroll-mt-28 px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">About Me</h3>
            <div
              className={`h-1 w-20 mx-auto rounded-full ${
                darkMode
                  ? "bg-gradient-to-r from-violet-400 to-cyan-400"
                  : "bg-gradient-to-r from-violet-600 to-orange-500"
              }`}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`space-y-5 text-base md:text-lg leading-relaxed ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p>
                Hi, I&apos;m{" "}
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Muhammad Awais
                </span>
                , a passionate MERN Stack Developer focused on building modern,
                scalable, and high-performance web applications. I enjoy turning
                ideas into clean, user-friendly digital products that solve
                real-world problems.
              </p>
              <p>
                I work across the full stack — from responsive frontends with
                React &amp; Next.js to robust backends using Node.js, Express,
                and MongoDB. I have hands-on experience with REST APIs, JWT
                authentication, admin dashboards, and e-commerce solutions.
                I&apos;m always learning new tools and best practices to deliver
                better results.
              </p>
              <p
                className={`font-medium ${
                  darkMode ? "text-violet-300" : "text-violet-700"
                }`}
              >
                Currently open to freelance projects and full-time opportunities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "Stack", value: "MERN" },
                { label: "Focus", value: "Full-Stack" },
                { label: "Build", value: "Web Apps" },
                { label: "Status", value: "Available" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`backdrop-blur-lg border p-5 rounded-2xl text-center shadow-lg transition-colors duration-500 ${
                    darkMode
                      ? "bg-white/10 border-white/20"
                      : "bg-black/5 border-black/10"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold tracking-widest uppercase mb-2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section
        id="TECHNOLOGIES"
        className={`scroll-mt-28 px-6 py-20 md:py-24 transition-colors duration-500 ${
          darkMode ? "bg-black/30" : "bg-black/5"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-6"
          >
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">
              Technologies
            </h3>
            <div
              className={`h-1 w-20 mx-auto rounded-full mb-6 ${
                darkMode
                  ? "bg-gradient-to-r from-violet-400 to-cyan-400"
                  : "bg-gradient-to-r from-violet-600 to-orange-500"
              }`}
            />
            <p
              className={`max-w-2xl mx-auto text-base md:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Tools and technologies I use to build fast, scalable, and
              modern web applications.
            </p>
          </motion.div>

          <div className="space-y-12 mt-12">
            {[
              {
                title: "Frontend",
                skills: [
                  { name: "React.js", icon: <FaReact size={36} color="#61DAFB" /> },
                  {
                    name: "Next.js",
                    icon: (
                      <SiNextdotjs
                        size={36}
                        className={darkMode ? "text-white" : "text-black"}
                      />
                    ),
                  },
                  { name: "HTML5", icon: <SiHtml5 size={36} color="#E34C26" /> },
                  { name: "CSS3", icon: <SiCss3 size={36} color="#264DE4" /> },
                  { name: "JavaScript", icon: <SiJavascript size={36} color="#F7DF1E" /> },
                  { name: "Tailwind CSS", icon: <SiTailwindcss size={36} color="#06B6D4" /> },
                ],
              },
              {
                title: "Backend",
                skills: [
                  { name: "Node.js", icon: <FaNodeJs size={36} color="#68A063" /> },
                  {
                    name: "Express.js",
                    icon: (
                      <SiExpress
                        size={36}
                        className={darkMode ? "text-white" : "text-gray-800"}
                      />
                    ),
                  },
                  { name: "Python", icon: <SiPython size={36} color="#3776AB" /> },
                  { name: "JWT Auth", icon: <SiJsonwebtokens size={36} color="#D63AFF" /> },
                ],
              },
              {
                title: "Database & API",
                skills: [
                  { name: "MongoDB", icon: <SiMongodb size={36} color="#47A248" /> },
                  { name: "MySQL", icon: <SiMysql size={36} color="#4479A1" /> },
                  { name: "REST API", icon: <TbApi size={36} color="#F97316" /> },
                  {
                    name: "API Integration",
                    icon: (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                          stroke="#38BDF8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  },
                ],
              },
              {
                title: "Tools",
                skills: [
                  { name: "GitHub", icon: <SiGithub size={36} color="#333" /> },
                  { name: "Git", icon: <SiGit size={36} color="#333" /> },
                ],
              },
            ].map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
              >
                <h4
                  className={`text-lg font-semibold mb-6 tracking-wide ${
                    darkMode ? "text-violet-300" : "text-violet-700"
                  }`}
                >
                  {group.title}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {group.skills.map((skill) => (
                    <motion.div
                      key={skill.name}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className={`backdrop-blur-lg border p-5 rounded-2xl text-center shadow-lg transition-colors duration-500 flex flex-col items-center gap-3 ${
                        darkMode
                          ? "bg-white/10 border-white/20 hover:border-violet-400/40"
                          : "bg-white border-black/10 hover:border-violet-400/40"
                      }`}
                    >
                      {skill.icon}
                      <span className="text-sm font-medium">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="PROJECTS"
        className={`scroll-mt-28 px-6 py-20 md:py-24 transition-colors duration-500 ${
          darkMode ? "bg-black/40" : "bg-black/5"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">Projects</h3>
            <div
              className={`h-1 w-20 mx-auto rounded-full mb-6 ${
                darkMode
                  ? "bg-gradient-to-r from-violet-400 to-cyan-400"
                  : "bg-gradient-to-r from-violet-600 to-orange-500"
              }`}
            />
            <p
              className={`max-w-2xl mx-auto text-base md:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              A selection of projects I&apos;ve built — focused on real-world
              functionality, clean code, and great user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Al-Saeed Foundation",
                desc: "A full charity foundation website for education, healthcare, and social welfare. Features donation system, bilingual content (English/Urdu), school information, and responsive design for community outreach.",
                tech: ["Next.js", "React", "Tailwind CSS", "Responsive"],
                image: "/images/alsaeedfoundation.png",
                link: "https://al-saeed-foundation.vercel.app/",
                badge: "Live Project",
              },
              {
                title: "Al-Saeed Admin Dashboard",
                desc: "A full-stack admin panel for managing foundation data with secure login, role-based access, CRUD operations, data tables, and analytics for efficient content and user management.",
                tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
                image: "/images/alsaeed-adminportal.png",
                badge: "Admin Dashboard",
              },
              {
                title: "Little Mu'mins",
                desc: "An e-commerce book shop for Islamic children's books with product catalog, cart system, category filters by age and type, and a warm, child-friendly design for nurturing young hearts.",
                tech: ["Next.js", "React", "E-commerce", "Responsive"],
                image: "/images/littlemumins.png",
                link: "https://little-mumins.vercel.app/",
                badge: "Live Project",
              },
            ].map((project, index) => {
              const cardClass = `backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 flex flex-col w-full ${
                project.link ? "cursor-pointer" : ""
              } ${
                darkMode
                  ? "bg-white/10 border-white/20 hover:border-violet-400/30"
                  : "bg-white border-black/10 hover:border-violet-400/30"
              }`;

              const cardContent = (
                <>
                  <div className="relative w-full aspect-video overflow-hidden group">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        darkMode
                          ? "from-black/70 via-black/20 to-transparent"
                          : "from-black/50 via-black/10 to-transparent"
                      }`}
                    />
                    {project.link && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                        <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 text-gray-900 text-sm font-semibold shadow-lg">
                          Visit Website
                          <FaExternalLinkAlt size={12} />
                        </span>
                      </div>
                    )}
                    <span
                      className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                        darkMode
                          ? "bg-violet-500/30 text-violet-200 backdrop-blur-sm"
                          : "bg-white/90 text-violet-700"
                      }`}
                    >
                      {project.badge}
                    </span>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h4 className="text-xl md:text-2xl font-bold mb-3">
                      {project.title}
                    </h4>

                    <p
                      className={`mb-5 leading-relaxed flex-1 text-sm md:text-base ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            darkMode
                              ? "bg-white/10 text-gray-300 border border-white/10"
                              : "bg-black/5 text-gray-700 border border-black/10"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );

              return project.link ? (
                <motion.a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -6 }}
                  className={cardClass}
                >
                  {cardContent}
                </motion.a>
              ) : (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -6 }}
                  className={cardClass}
                >
                  {cardContent}
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-12 rounded-2xl border p-6 md:p-8 ${
              darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"
            }`}
          >
            <h4
              className={`text-xl md:text-2xl font-semibold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Additional GitHub Projects
            </h4>
            <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Note: only `AdaxionTech` repositories are company projects. Others
              are personal/collaboration repositories.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  url: "https://github.com/awiasjaved/alsaeed_back",
                  company: false,
                },
                {
                  url: "https://github.com/awiasjaved/alsaeed_portal",
                  company: false,
                },
                { url: "https://github.com/awiasjaved/awais-Dev", company: false },
                {
                  url: "https://github.com/awiasjaved/ai-recruitment-platform-frontend",
                  company: false,
                },
                {
                  url: "https://github.com/awiasjaved/sohail-autos-toba",
                  company: false,
                },
                { url: "https://github.com/awiasjaved/DevSpire", company: false },
                {
                  url: "https://github.com/awiasjaved/yaseen_backend",
                  company: false,
                },
                {
                  url: "https://github.com/awiasjaved/ALSaeed_Foundation",
                  company: false,
                },
                {
                  url: "https://github.com/awiasjaved/phrmacy_app",
                  company: false,
                },
                {
                  url: "https://github.com/awiasjaved/little_mumins",
                  company: false,
                },
                {
                  url: "https://github.com/awiasjaved/little_mumins_backend",
                  company: false,
                },
                {
                  url: "https://github.com/AdaxionTech/heyginie_backend",
                  company: true,
                },
                {
                  url: "https://github.com/AdaxionTech/partner_portal",
                  company: true,
                },
              ].map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-xl border px-3 py-2 text-sm transition-colors break-all ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-violet-400/40"
                      : "border-black/10 bg-black/5 text-gray-700 hover:text-gray-900 hover:border-violet-400/40"
                  }`}
                >
                  {repo.url.replace("https://github.com/", "")}
                  {repo.company ? " (Company)" : ""}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="CONTACT"
        className={`scroll-mt-28 px-6 py-20 md:py-24 transition-colors duration-500 ${
          darkMode ? "bg-black/30" : "bg-black/5"
        }`}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">
              Contact Me
            </h3>
            <div
              className={`h-1 w-20 mx-auto rounded-full mb-6 ${
                darkMode
                  ? "bg-gradient-to-r from-violet-400 to-cyan-400"
                  : "bg-gradient-to-r from-violet-600 to-orange-500"
              }`}
            />
            <p
              className={`max-w-2xl mx-auto text-base md:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Have a project in mind or want to collaborate? Feel free to reach
              out — I&apos;m always open to discussing new opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                label: "Email",
                value: "muhammadawaisjaved388@gmail.com",
                href: "mailto:muhammadawaisjaved388@gmail.com",
                icon: <MdEmail size={32} className="text-red-500" />,
              },
              {
                label: "GitHub",
                value: "awiasjaved",
                href: "https://github.com/awiasjaved",
                icon: (
                  <SiGithub
                    size={32}
                    className={darkMode ? "text-white" : "text-gray-900"}
                  />
                ),
              },
              {
                label: "LinkedIn",
                value: "Muhammad Awais",
                href: "https://www.linkedin.com/in/muhammad-awais-436459222/",
                icon: <SiLinkedin size={32} className="text-blue-500" />,
              },
              {
                label: "WhatsApp",
                value: "+92 305 7359818",
                href: "https://wa.me/923057359818",
                icon: <FaWhatsapp size={32} className="text-green-500" />,
              },
            ].map((contact, index) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className={`backdrop-blur-lg border p-6 rounded-2xl shadow-lg transition-colors duration-500 flex flex-col items-center gap-3 text-center ${
                  darkMode
                    ? "bg-white/10 border-white/20 hover:border-violet-400/40"
                    : "bg-white border-black/10 hover:border-violet-400/40"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    darkMode ? "bg-white/5" : "bg-black/5"
                  }`}
                >
                  {contact.icon}
                </div>
                <p
                  className={`text-sm font-semibold tracking-wide uppercase ${
                    darkMode ? "text-violet-300" : "text-violet-700"
                  }`}
                >
                  {contact.label}
                </p>
                <p
                  className={`text-xs md:text-sm break-all ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {contact.value}
                </p>
              </motion.a>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className={`mt-12 text-sm ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Let&apos;s build something amazing together.
          </motion.p>
        </div>
      </section>
    </main>
  );
}
