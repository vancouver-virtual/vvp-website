'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../../design/tokens.json';

gsap.registerPlugin(ScrollTrigger);

const visionStatements = [
  "Virtual production, real results.",
  "Creativity first, technology second.",
  "Premium craft, proven delivery."
];

export default function VisionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statementRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const statements = statementRefs.current.filter(Boolean);
    if (statements.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Show only middle statement, no animations
      statements.forEach((statement, index) => {
        if (!statement) return;
        gsap.set(statement, { opacity: index === 1 ? 1 : 0, scale: 1, y: 0 });
      });
      return;
    }

    // Set initial state
    statements.forEach((statement) => {
      if (!statement) return;
      gsap.set(statement, { opacity: 0, scale: 0.8, y: 30 });
    });

    let tickerCleanup: (() => void) | null = null;

    const timer = setTimeout(() => {
      // Find parent horizontal scroll trigger
      const parentTriggers = ScrollTrigger.getAll();
      const parentScrollTrigger = parentTriggers.find(t => t.vars.pin === true);

      if (!parentScrollTrigger) return;

      // Read progress window from data attributes (set by parent)
      const visionStart = parseFloat(container.dataset.progressStart || '0.10');
      const visionEnd = parseFloat(container.dataset.progressEnd || '1.0');
      const visionRange = visionEnd - visionStart;

      // Use GSAP ticker to sync with parent ScrollTrigger
      const tickerFunc = () => {
        const parentProgress = parentScrollTrigger.progress;

        if (parentProgress >= visionStart && parentProgress <= visionEnd) {
          const localProgress = (parentProgress - visionStart) / visionRange;

          // Each statement gets 1/3 of the progress
          statements.forEach((statement, index) => {
            if (!statement) return;

            const progressPerStatement = 1 / visionStatements.length;

            const statementStart = index * progressPerStatement;
            const fadeInEnd = statementStart + (progressPerStatement * 0.3);
            const holdEnd = statementStart + (progressPerStatement * 0.7);
            const statementEnd = (index + 1) * progressPerStatement;

            if (localProgress < statementStart) {
              gsap.set(statement, { opacity: 0, scale: 0.8, y: 30 });
            } else if (localProgress >= statementStart && localProgress < fadeInEnd) {
              const phaseProgress = (localProgress - statementStart) / (fadeInEnd - statementStart);
              gsap.set(statement, {
                opacity: phaseProgress,
                scale: 0.8 + (phaseProgress * 0.2),
                y: 30 - (phaseProgress * 30)
              });
            } else if (localProgress >= fadeInEnd && localProgress < holdEnd) {
              gsap.set(statement, { opacity: 1, scale: 1, y: 0 });
            } else if (localProgress >= holdEnd && localProgress < statementEnd) {
              const phaseProgress = (localProgress - holdEnd) / (statementEnd - holdEnd);
              gsap.set(statement, {
                opacity: 1 - phaseProgress,
                scale: 1 + (phaseProgress * 0.1),
                y: -(phaseProgress * 20)
              });
            } else {
              gsap.set(statement, { opacity: 0, scale: 1.1, y: -20 });
            }
          });
        } else if (parentProgress < visionStart) {
          // Before Vision section
          statements.forEach((statement) => {
            if (!statement) return;
            gsap.set(statement, { opacity: 0, scale: 0.8, y: 30 });
          });
        }
      };

      gsap.ticker.add(tickerFunc);

      tickerCleanup = () => {
        gsap.ticker.remove(tickerFunc);
      };
    }, 400);

    return () => {
      clearTimeout(timer);
      if (tickerCleanup) {
        tickerCleanup();
      }
    };
  }, []);


  return (
    <div
      ref={containerRef}
      data-progress-start="0.10"
      data-progress-end="1.0"
      style={{
        position: 'relative',
        minWidth: '100vw',
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        background: tokens.colors.bg.base,
      }}
    >
      {/* Single "Our Vision" header - absolute position within Vision section */}
      <div style={{
        position: 'absolute',
        top: `${tokens.spacing['3xl']}px`,
        left: `${tokens.spacing['3xl']}px`,
        fontSize: tokens.typography.size.body,
        color: tokens.colors.on.bgSecondary,
        letterSpacing: tokens.typography.letterSpacing.wide,
        textTransform: 'uppercase',
        fontWeight: tokens.typography.weight.regular,
        zIndex: 10,
      }}>
        Our Vision
      </div>

      {/* Stacked panels (not scrolling, driven by parent GSAP timeline) */}
      {visionStatements.map((statement, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            ref={el => statementRefs.current[index] = el}
            style={{
              width: '100%',
              maxWidth: '1000px',
              padding: `${tokens.spacing['3xl']}px`,
              fontSize: 'clamp(48px, 5vw, 64px)',
              fontWeight: tokens.typography.weight.heavy,
              color: tokens.colors.on.bg,
              lineHeight: '1.2',
              letterSpacing: '-0.5px',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {statement}
          </div>
        </div>
      ))}
    </div>
  );
}
