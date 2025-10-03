import tokens from '../../../../design/tokens.json';
import BackButton from '@/components/BackButton';
import ContactButton from '@/components/ContactButton';

export async function generateStaticParams() {
  return [
    { slug: 'commercial' },
    { slug: 'cinema' },
    { slug: 'sports' },
    { slug: 'podcasting' },
    { slug: 'live-event-space' },
    { slug: 'product-reveal-stage' },
    { slug: 'music-videos' },
    { slug: 'immersive-experiences' },
  ];
}

const servicesData: Record<string, {
  title: string;
  category: string;
  description: string;
  overview: string;
  capabilities: string[];
  images?: string[];
}> = {
  commercial: {
    title: 'Commercial',
    category: 'Services',
    description: 'Creating compelling brand stories through cutting-edge virtual production technology.',
    overview: 'Our commercial virtual production services deliver world-class results for brands seeking to push creative boundaries. We combine advanced LED wall technology with immersive environments to create stunning visuals that capture attention and drive engagement.',
    capabilities: [
      'Brand storytelling and product launches',
      'High-end commercial production',
      'Real-time visual effects integration',
      'Multi-camera setups with virtual environments',
      'Flexible production schedules',
    ],
  },
  cinema: {
    title: 'Cinema',
    category: 'Services',
    description: 'Transforming filmmaking with immersive virtual production environments.',
    overview: 'Our cinema-grade virtual production stage brings Hollywood-level technology to your film projects. Create entire worlds, control lighting in real-time, and see final VFX on set.',
    capabilities: [
      'Feature film production support',
      'Real-time background replacement',
      'Advanced color grading workflows',
      'ICVFX pipeline integration',
      'High-resolution LED volumes',
    ],
  },
  sports: {
    title: 'Sports',
    category: 'Services',
    description: 'Dynamic sports content production with virtual environments.',
    overview: 'Elevate sports broadcasting and content creation with our virtual production capabilities. Create dynamic environments for analysis, highlights, and promotional content.',
    capabilities: [
      'Sports broadcasting enhancements',
      'Virtual studio environments',
      'Real-time graphics integration',
      'Multi-sport compatibility',
      'Live event support',
    ],
  },
  podcasting: {
    title: 'Podcasting',
    category: 'Services',
    description: 'Elevate your podcast with immersive visual environments.',
    overview: 'Transform your podcast into a visual experience. Our virtual production stage allows you to create any environment imaginable for your show.',
    capabilities: [
      'Custom virtual environments',
      'Multi-camera podcast setups',
      'Real-time background changes',
      'Professional lighting control',
      'Streaming-ready production',
    ],
  },
  'live-event-space': {
    title: 'Live Event Space',
    category: 'Services',
    description: 'Create unforgettable live events with virtual production technology.',
    overview: 'Host corporate events, product launches, and live performances in stunning virtual environments that transport your audience anywhere.',
    capabilities: [
      'Corporate event production',
      'Virtual environment design',
      'Live audience integration',
      'Interactive experiences',
      'Hybrid event support',
    ],
  },
  'product-reveal-stage': {
    title: 'Product Reveal Stage',
    category: 'Services',
    description: 'Launch your products in style with immersive reveal experiences.',
    overview: 'Make your product launches memorable with virtual environments tailored to showcase your innovation and brand identity.',
    capabilities: [
      'Custom reveal environments',
      'Product-focused lighting',
      'Interactive presentations',
      'Multi-angle coverage',
      'Social media optimized content',
    ],
  },
  'music-videos': {
    title: 'Music Videos',
    category: 'Services',
    description: 'Create stunning music videos with limitless creative possibilities.',
    overview: 'Push creative boundaries with virtual production for music videos. Create impossible locations, control every aspect of your environment, and achieve your vision.',
    capabilities: [
      'Unlimited location possibilities',
      'Real-time visual effects',
      'Dynamic lighting control',
      'Multi-performance setups',
      'Cost-effective production',
    ],
  },
  'immersive-experiences': {
    title: 'Immersive Experiences',
    category: 'Services',
    description: 'Create next-generation immersive experiences that captivate audiences.',
    overview: 'Design and produce fully immersive experiences that blur the line between physical and digital. Perfect for installations, exhibitions, and experimental content.',
    capabilities: [
      'Custom immersive installations',
      'Interactive environments',
      'Multi-sensory experiences',
      'Experimental content production',
      'Exhibition and showcase support',
    ],
  },
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const service = servicesData[slug];

  if (!service) {
    return (
      <div style={{
        minHeight: '100vh',
        background: tokens.colors.bg.base,
        color: tokens.colors.on.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div>Service not found</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: tokens.colors.bg.base,
      color: tokens.colors.on.bg,
    }}>
      {/* Header / Back Navigation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: `${tokens.spacing.xl}px ${tokens.spacing['3xl']}px`,
        background: tokens.colors.glass.bg,
        backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`,
        borderBottom: `1px solid ${tokens.colors.glass.border}`,
        zIndex: tokens.z.menu,
        display: 'flex',
        alignItems: 'center',
        gap: `${tokens.spacing.xl}px`,
      }}>
        <BackButton />
        <div style={{
          fontSize: tokens.typography.size.small,
          color: tokens.colors.on.bgSecondary,
          letterSpacing: tokens.typography.letterSpacing.wide,
          textTransform: 'uppercase',
        }}>
          {service.category}
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        paddingTop: '120px',
        padding: `120px ${tokens.spacing['3xl']}px ${tokens.spacing['3xl']}px`,
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          marginBottom: `${tokens.spacing['3xl']}px`,
        }}>
          <h1 style={{
            fontSize: '72px',
            fontWeight: tokens.typography.weight.heavy,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            lineHeight: '1',
            margin: `0 0 ${tokens.spacing.xl}px 0`,
          }}>
            {service.title}
          </h1>
          <p style={{
            fontSize: '24px',
            color: tokens.colors.on.bgSecondary,
            lineHeight: '1.4',
            maxWidth: '800px',
            margin: 0,
          }}>
            {service.description}
          </p>
        </div>

        {/* Overview Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: `${tokens.spacing['3xl']}px`,
          marginBottom: `${tokens.spacing['3xl']}px`,
        }}>
          <div>
            <h2 style={{
              fontSize: '14px',
              fontWeight: tokens.typography.weight.medium,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.letterSpacing.wide,
              color: tokens.colors.on.bgSecondary,
              marginBottom: `${tokens.spacing.lg}px`,
            }}>
              Overview
            </h2>
            <p style={{
              fontSize: tokens.typography.size.body,
              lineHeight: '1.6',
              color: tokens.colors.on.bg,
              margin: 0,
            }}>
              {service.overview}
            </p>
          </div>

          <div>
            <h2 style={{
              fontSize: '14px',
              fontWeight: tokens.typography.weight.medium,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.letterSpacing.wide,
              color: tokens.colors.on.bgSecondary,
              marginBottom: `${tokens.spacing.lg}px`,
            }}>
              Capabilities
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: `${tokens.spacing.md}px`,
            }}>
              {service.capabilities.map((capability, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: tokens.typography.size.body,
                    lineHeight: '1.6',
                    color: tokens.colors.on.bg,
                    paddingLeft: `${tokens.spacing.lg}px`,
                    position: 'relative',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: tokens.colors.on.bgSecondary,
                  }}>→</span>
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Placeholder for images/content */}
        <div style={{
          background: '#2C2E33',
          borderRadius: `${tokens.radii.lg}px`,
          padding: `${tokens.spacing['3xl']}px`,
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.colors.on.bgSecondary,
          fontSize: tokens.typography.size.body,
        }}>
          Image Gallery / Video Content Area
        </div>

        {/* Contact CTA */}
        <ContactButton serviceName={service.title} />
      </div>
    </div>
  );
}
