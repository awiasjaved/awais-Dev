"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaReact, FaNodeJs, FaBars, FaTimes } from "react-icons/fa";
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
      <section
        id="ABOUT"
        className="flex flex-col justify-center px-6 py-28 md:py-32 max-w-6xl mx-auto"
      >
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

      {/* SKILLS */}
      <section id="TECHNOLOGIES" className="px-6 py-24">
        <h3 className="text-3xl font-semibold text-center mb-16">Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "React.js",
              icon: <FaReact size={36} color="#61DAFB" />,
            },
            {
              name: "Next.js",
              icon: (
                <SiNextdotjs
                  size={36}
                  className={darkMode ? "text-white" : "text-black"}
                />
              ),
            },
            {
              name: "Node.js",
              icon: <FaNodeJs size={36} color="#68A063" />,
            },
            {
              name: "Express.js",
              icon: (
                <SiExpress
                  size={36}
                  className={darkMode ? "text-white" : "text-gray-800"}
                />
              ),
            },
            {
              name: "MongoDB",
              icon: <SiMongodb size={36} color="#47A248" />,
            },
            {
              name: "REST API",
              icon: <TbApi size={36} color="#F97316" />,
            },
            {
              name: "JWT Auth",
              icon: <SiJsonwebtokens size={36} color="#D63AFF" />,
            },
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
            {
              name: "MySQL",
              icon: <SiMysql size={36} color="#4479A1" />,
            },
            {
              name: "GITHUB",
              icon: <SiGithub size={36} color="#333" />,
            },
            {
              name: "GIT",
              icon: <SiGit size={36} color="#333" />,
            },
            {
              name: "Python",
              icon: <SiPython size={36} color="#3776AB" />,
            },
            {
              name: "HTML5",
              icon: <SiHtml5 size={36} color="#E34C26" />,
            },
            {
              name: "CSS3",
              icon: <SiCss3 size={36} color="#264DE4" />,
            },
            {
              name: "JavaScript",
              icon: <SiJavascript size={36} color="#F7DF1E" />,
            },
            {
              name: "tailwindcss",
              icon: <SiTailwindcss size={36} color="#06B6D4" />,
            },
            
          ].map((skill, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`backdrop-blur-lg border p-6 rounded-2xl text-center shadow-xl transition-colors duration-500 flex flex-col items-center gap-3 ${
                darkMode
                  ? "bg-white/10 border-white/20"
                  : "bg-black/5 border-black/10"
              }`}
            >
              {skill.icon}
              <span className="text-sm font-medium">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="PROJECTS"
        className={`px-6 py-24 backdrop-blur-lg transition-colors duration-500 ${
          darkMode ? "bg-black/40" : "bg-black/5"
        }`}
      >
        <h3 className="text-3xl font-semibold text-center mb-16">Projects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {[
            {
              title: "Admin Dashboard",
              desc: "Full-stack admin panel with authentication, CRUD operations and analytics.",
            },
            {
              title: "E-commerce API",
              desc: "REST API with cart, orders and secure payment integration.",
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`backdrop-blur-xl border p-8 rounded-2xl shadow-2xl transition-colors duration-500 ${
                darkMode
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-black/10"
              }`}
            >
              <h4 className="text-xl font-bold mb-4">{project.title}</h4>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {project.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="CONTACT" className="px-6 py-24 text-center">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold mb-6"
        >
          Contact US
        </motion.h3>
        <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Let's build something amazing together.
        </p>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <a
            href="mailto:muhammadawaisjaved388@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <img
              src="/images/Email.png"
              alt="Email"
              className="w-24 rounded-xl hover:scale-105 transition duration-300 shadow-lg"
            />
          </a>
          <a
            href="https://github.com/awiasjaved"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <img
              src="/images/github.jpg"
              alt="Linked In"
              className="w-16 rounded-xl hover:scale-105 transition duration-300 shadow-lg"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-awais-436459222/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <img
              src="/images/linkedin.png"
              alt="GitHub"
              className="w-20 rounded-xl hover:scale-105 transition duration-300 shadow-lg"
            />
          </a>
          <a
            href="https://wa.me/923057359818"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <img
              src="/images/whatsapp.png"
              alt="Whatsapp"
              className="w-18 rounded-xl hover:scale-105 transition duration-300 shadow-lg"
            />
          </a>
        </div>
      </section>
    </main>
  );
}
