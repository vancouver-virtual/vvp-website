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
  const sectionRef = useRef<HTMLDivElement>(null);
  const statementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const statements = statementsRef.current.filter(Boolean);
    if (statements.length === 0) return;

    // Set initial state
    statements.forEach((statement) => {
      if (!statement) return;
      const spans = statement.querySelectorAll('span');
      gsap.set(statement, { opacity: 0 });
      gsap.set(spans, { opacity: 0, scale: 0.8, y: 30 });
    });

    const timer = setTimeout(() => {
      // Pin the Vision section content while we scroll through statements
      const scrollHeight = window.innerHeight * visionStatements.length * 1.5; // 1.5vh per statement

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${scrollHeight}`,
        pin: content,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Each statement gets equal portion with gaps
          statements.forEach((statement, index) => {
            if (!statement) return;

            const spans = statement.querySelectorAll('span');

            const progressPerStatement = 1 / visionStatements.length;
            const statementStart = index * progressPerStatement;
            const fadeInEnd = statementStart + (progressPerStatement * 0.25);
            const holdEnd = statementStart + (progressPerStatement * 0.75);
            const statementEnd = (index + 1) * progressPerStatement;

            if (progress < statementStart) {
              // Before this statement
              gsap.set(statement, { opacity: 0 });
              gsap.set(spans, { opacity: 0, scale: 0.8, y: 30 });
            } else if (progress >= statementStart && progress < fadeInEnd) {
              // Fade in and grow
              const phaseProgress = (progress - statementStart) / (fadeInEnd - statementStart);
              gsap.set(statement, { opacity: phaseProgress });
              spans.forEach((span) => {
                gsap.set(span, {
                  opacity: phaseProgress,
                  scale: 0.8 + (phaseProgress * 0.2),
                  y: 30 - (phaseProgress * 30)
                });
              });
            } else if (progress >= fadeInEnd && progress < holdEnd) {
              // Hold at peak
              gsap.set(statement, { opacity: 1 });
              spans.forEach((span) => {
                gsap.set(span, {
                  opacity: 1,
                  scale: 1,
                  y: 0
                });
              });
            } else if (progress >= holdEnd && progress < statementEnd) {
              // Fade out
              const phaseProgress = (progress - holdEnd) / (statementEnd - holdEnd);
              gsap.set(statement, { opacity: 1 - phaseProgress });
              spans.forEach((span) => {
                gsap.set(span, {
                  opacity: 1 - phaseProgress,
                  scale: 1 + (phaseProgress * 0.1),
                  y: -(phaseProgress * 20)
                });
              });
            } else {
              // After this statement
              gsap.set(statement, { opacity: 0 });
              gsap.set(spans, { opacity: 0, scale: 1.1, y: -20 });
            }
          });
        }
      });
    }, 400);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section || trigger.vars.pin === content) {
          trigger.kill();
        }
      });
    };
  }, []);

  const splitTextIntoSpans = (text: string) => {
    const words = text.split(' ');
    return words.map((word, i) => (
      <span key={i} style={{ display: 'inline-block', marginRight: '0.3em' }}>
        {word}
      </span>
    ));
  };

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: `${100 * visionStatements.length * 1.5}vh`, // Extended for vertical scroll
        background: tokens.colors.bg.base,
      }}
    >
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tokens.colors.bg.base,
        }}
      >
        {/* Pre-header */}
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

        {/* Vision Statements - Stacked and animated */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1000px',
          padding: `${tokens.spacing['3xl']}px`,
        }}>
          {visionStatements.map((statement, index) => (
            <div
              key={index}
              ref={el => statementsRef.current[index] = el}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                fontSize: '64px',
                fontWeight: tokens.typography.weight.heavy,
                color: tokens.colors.on.bg,
                lineHeight: '1.2',
                letterSpacing: '-0.5px',
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              {splitTextIntoSpans(statement)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
