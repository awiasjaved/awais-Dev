"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

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
        colors[colorIndexRef.current % colors.length].replace(/[\d.]+\)$/, "1)")
      );
      setParticles((prev) => [...prev.slice(-60), ...newParticles]);
    },
    [darkMode]
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

      {/* DARK MODE TOGGLE */}
      <div className="fixed top-5 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative w-16 h-8 rounded-full transition-colors duration-500 focus:outline-none shadow-lg border cursor-pointer ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-yellow-300 border-yellow-400"
          }`}
          aria-label="Toggle Dark Mode"
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all duration-500 shadow-md ${
              darkMode ? "translate-x-8 bg-indigo-500" : "translate-x-0 bg-white"
            }`}
          >
            {darkMode ? "🌙" : "☀️"}
          </span>
        </button>
      </div>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">

        {/* FANCY NAME */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 relative"
        >
          {/* Glow behind name */}
          <div
            className="absolute inset-0 blur-3xl opacity-40 rounded-full"
            style={{
              background: darkMode
                ? "radial-gradient(ellipse, rgba(139,92,246,0.6) 0%, rgba(59,130,246,0.4) 50%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(249,115,22,0.5) 0%, rgba(234,179,8,0.4) 50%, transparent 70%)",
              transform: "scale(1.4)",
            }}
          />

          {/* Main Name */}
          <h1
            className="relative text-6xl md:text-8xl font-black tracking-tight leading-none"
            style={{
              fontFamily: "'Georgia', serif",
              background: darkMode
                ? "linear-gradient(135deg, #fff 0%, #a78bfa 30%, #818cf8 55%, #67e8f9 80%, #fff 100%)"
                : "linear-gradient(135deg, #1e1e1e 0%, #7c3aed 30%, #db2777 60%, #ea580c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: darkMode
                ? "drop-shadow(0 0 30px rgba(139,92,246,0.7)) drop-shadow(0 0 60px rgba(99,102,241,0.4))"
                : "drop-shadow(0 0 20px rgba(124,58,237,0.5)) drop-shadow(0 0 40px rgba(219,39,119,0.3))",
              letterSpacing: "-0.02em",
            }}
          >
            MUHAMMAD AWAIS
            <span
              style={{
                fontSize: "1.15em",
                background: darkMode
                  ? "linear-gradient(135deg, #f0abfc 0%, #c084fc 25%, #818cf8 50%, #38bdf8 75%, #a5f3fc 100%)"
                  : "linear-gradient(135deg, #7c3aed 0%, #db2777 40%, #ea580c 80%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                letterSpacing: "0.08em",
              }}
            >
              
            </span>
          </h1>

          {/* Decorative underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="mt-3 mx-auto rounded-full"
            style={{
              height: "3px",
              width: "60%",
              background: darkMode
                ? "linear-gradient(90deg, transparent, #a78bfa, #67e8f9, transparent)"
                : "linear-gradient(90deg, transparent, #7c3aed, #db2777, transparent)",
              boxShadow: darkMode
                ? "0 0 12px rgba(167,139,250,0.8)"
                : "0 0 12px rgba(124,58,237,0.6)",
            }}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`text-2xl md:text-3xl mb-6 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Full Stack React & Node.js Developer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={darkMode ? "max-w-2xl text-gray-500" : "max-w-2xl text-gray-600"}
        >
          I build modern, scalable and high-performance web applications using
          React, Next.js, Node.js and MongoDB.
        </motion.p>
      </section>

      {/* SKILLS */}
      <section className="px-6 py-24">
        <h3 className="text-3xl font-semibold text-center mb-16">Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            "React.js", "Next.js", "Node.js", "Express.js",
            "MongoDB", "REST API", "JWT Auth", "API Integration",
          ].map((skill, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`backdrop-blur-lg border p-6 rounded-2xl text-center shadow-xl transition-colors duration-500 ${
                darkMode ? "bg-white/10 border-white/20" : "bg-black/5 border-black/10"
              }`}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section
        className={`px-6 py-24 backdrop-blur-lg transition-colors duration-500 ${
          darkMode ? "bg-black/40" : "bg-black/5"
        }`}
      >
        <h3 className="text-3xl font-semibold text-center mb-16">Projects</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Admin Dashboard",
              desc: "Full-stack admin panel with authentication, CRUD operations and analytics.",
            },
            {
              title: "E-commerce API",
              desc: "REST API with cart, orders and secure payment integration.",
            },
            {
              title: "QR Scanner App",
              desc: "React Native app with QR scanning and secure login.",
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`backdrop-blur-xl border p-8 rounded-2xl shadow-2xl transition-colors duration-500 ${
                darkMode ? "bg-white/10 border-white/20" : "bg-white border-black/10"
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
      <section className="px-6 py-24 text-center">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold mb-6"
        >
          Contact Me
        </motion.h3>
        <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Let's build something amazing together.
        </p>
        <div className="space-y-2">
         <p>
  Email:{" "}
  <a
    href="mailto:muhammadawaisjaved388@gmail.com"
    className={`underline ${
      darkMode
        ? "text-indigo-400 hover:text-indigo-300"
        : "text-indigo-600 hover:text-indigo-500"
    }`}
  >
    muhammadawaisjaved388@gmail.com
  </a>
</p>
          <p>
            GitHub:{" "}
            <a
              href="https://github.com/awiasjaved"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}
            >
              github.com/awiasjaved
            </a>
          </p>
          <p>
            Linked In:{" "}
            <a
              href="https://www.linkedin.com/in/muhammad-awais-436459222/"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}
            >
              Muhammad Awais
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}