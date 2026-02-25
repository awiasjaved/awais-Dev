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
  "rgba(139,92,246,0.8)",   // purple
  "rgba(59,130,246,0.8)",   // blue
  "rgba(236,72,153,0.8)",   // pink
  "rgba(16,185,129,0.8)",   // green
  "rgba(245,158,11,0.8)",   // amber
  "rgba(239,68,68,0.8)",    // red
  "rgba(99,102,241,0.8)",   // indigo
  "rgba(20,184,166,0.8)",   // teal
];

const LIGHT_COLORS = [
  "rgba(251,191,36,0.8)",   // yellow
  "rgba(249,115,22,0.8)",   // orange
  "rgba(239,68,68,0.8)",    // red
  "rgba(16,185,129,0.8)",   // green
  "rgba(59,130,246,0.8)",   // blue
  "rgba(236,72,153,0.8)",   // pink
  "rgba(139,92,246,0.8)",   // purple
  "rgba(20,184,166,0.8)",   // teal
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
      // Update cursor position always
      setCursor({ x: e.clientX, y: e.clientY });

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 8) return;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const colors = darkMode ? DARK_COLORS : LIGHT_COLORS;

      // Spawn 2-3 particles at once with different colors
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

      // Update cursor color to latest color
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
      {/* CUSTOM CURSOR CIRCLE */}
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
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Muhammad Awais
        </motion.h1>

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
          <p>Email: your@eemail.com</p>
          <p>GitHub: github.com/yourusername</p>
        </div>
      </section>
    </main>
  );
}