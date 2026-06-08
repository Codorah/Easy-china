"use client";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  badge:  React.ReactNode;
  title1: string;
  title2: string;
  desc:   string;
  ctas:   React.ReactNode;
  stats:  React.ReactNode;
}

export function HeroEntrance({ badge, title1, title2, desc, ctas, stats }: Props) {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduce ? {} : {
      initial:    { opacity: 0, y: 28 },
      animate:    { opacity: 1, y: 0  },
      transition: { delay, duration: 0.7, ease },
    };

  return (
    <div className="hero-bg-left flex flex-col justify-center px-[clamp(2rem,8%,6rem)] py-32 md:py-40">
      <motion.div {...fadeUp(0.08)} className="self-start mb-8">{badge}</motion.div>

      <motion.h1
        {...fadeUp(0.18)}
        className="font-display font-extrabold text-[var(--color-text)] mb-6 text-[clamp(2.2rem,4vw,3.8rem)] leading-[var(--leading-display)] tracking-[var(--tracking-display)]"
      >
        {title1}
        <br />
        <em className="not-italic text-[var(--color-accent)]">{title2}</em>
      </motion.h1>

      <motion.p
        {...fadeUp(0.3)}
        className="text-[var(--color-muted)] max-w-[460px] mb-10 text-[var(--text-md)] leading-[var(--leading-body)]"
      >
        {desc}
      </motion.p>

      <motion.div {...fadeUp(0.42)} className="mb-12">{ctas}</motion.div>

      <motion.div {...fadeUp(0.56)}>{stats}</motion.div>
    </div>
  );
}
