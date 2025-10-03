'use client';

import { useRouter } from 'next/navigation';
import tokens from '../../design/tokens.json';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      style={{
        background: 'transparent',
        border: `1px solid ${tokens.colors.glass.border}`,
        borderRadius: `${tokens.radii.pill}px`,
        padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`,
        color: tokens.colors.on.bg,
        fontSize: tokens.typography.size.small,
        fontWeight: tokens.typography.weight.medium,
        cursor: 'pointer',
        transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = tokens.colors.glass.highlight;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      ← Back
    </button>
  );
}
