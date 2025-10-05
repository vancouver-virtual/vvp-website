'use client';

import { useState } from 'react';
import tokens from '../../design/tokens.json';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        minWidth: '100vw',
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        background: tokens.colors.bg.base,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: `${tokens.spacing['3xl']}px`,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: tokens.typography.weight.heavy,
            color: tokens.colors.on.bg,
            textAlign: 'center',
            marginBottom: `${tokens.spacing['2xl']}px`,
            lineHeight: '1.2',
          }}
        >
          Reach out for a meeting with us
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: `${tokens.spacing.lg}px` }}>
            <label
              htmlFor="company"
              style={{
                display: 'block',
                fontSize: tokens.typography.size.small,
                color: tokens.colors.on.bgSecondary,
                marginBottom: `${tokens.spacing.xs}px`,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.letterSpacing.wide,
              }}
            >
              Company or Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: `${tokens.spacing.md}px`,
                background: tokens.colors.glass.bg,
                border: `1px solid ${tokens.colors.glass.border}`,
                borderRadius: `${tokens.radii.md}px`,
                color: tokens.colors.on.bg,
                fontSize: tokens.typography.size.body,
                outline: 'none',
                transition: `border-color ${tokens.motion.dur.base}ms ${tokens.motion.ease.standard}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.focus.ring;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.glass.border;
              }}
            />
          </div>

          <div style={{ marginBottom: `${tokens.spacing.lg}px` }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: tokens.typography.size.small,
                color: tokens.colors.on.bgSecondary,
                marginBottom: `${tokens.spacing.xs}px`,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.letterSpacing.wide,
              }}
            >
              Contact Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: `${tokens.spacing.md}px`,
                background: tokens.colors.glass.bg,
                border: `1px solid ${tokens.colors.glass.border}`,
                borderRadius: `${tokens.radii.md}px`,
                color: tokens.colors.on.bg,
                fontSize: tokens.typography.size.body,
                outline: 'none',
                transition: `border-color ${tokens.motion.dur.base}ms ${tokens.motion.ease.standard}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.focus.ring;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.glass.border;
              }}
            />
          </div>

          <div style={{ marginBottom: `${tokens.spacing.xl}px` }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: tokens.typography.size.small,
                color: tokens.colors.on.bgSecondary,
                marginBottom: `${tokens.spacing.xs}px`,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.letterSpacing.wide,
              }}
            >
              Email to Contact *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: `${tokens.spacing.md}px`,
                background: tokens.colors.glass.bg,
                border: `1px solid ${tokens.colors.glass.border}`,
                borderRadius: `${tokens.radii.md}px`,
                color: tokens.colors.on.bg,
                fontSize: tokens.typography.size.body,
                outline: 'none',
                transition: `border-color ${tokens.motion.dur.base}ms ${tokens.motion.ease.standard}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.focus.ring;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.glass.border;
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: `${tokens.spacing.md}px`,
              background: tokens.colors.focus.ring,
              border: 'none',
              borderRadius: `${tokens.radii.md}px`,
              color: tokens.colors.on.bg,
              fontSize: tokens.typography.size.body,
              fontWeight: tokens.typography.weight.bold,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.letterSpacing.wide,
              cursor: 'pointer',
              transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
