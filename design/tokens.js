// U-Origins Design System — Token Definitions v1
// Single source of truth for all visual primitives.
// Load this before any component file.

const T = window.UOriginsTokens = {

  // ─── Color ───────────────────────────────────────────────────────────────

  color: {
    // Backgrounds
    bgPage:     '#f0eee9',  // outermost page wash
    bgMain:     '#fdfcf8',  // primary content area
    bgSurface:  '#fafaf7',  // sidebar / timeline panel
    bgCard:     '#ffffff',  // cards, modals, dropdowns

    // Borders & dividers
    border:     '#eae5d8',  // rule lines, track
    borderFaint:'#eeeeee',  // subtle internal dividers (modal column)

    // UI fills
    tagBg:      '#f4f1e8',  // tag chips, toggle-group background
    inputTrack: '#eae5d8',  // range input track

    // Text ramp — darkest to lightest
    textPrimary:   '#1a1815',  // headings, primary labels
    textSecondary: '#2a251f',  // body headings, active controls
    textBody:      '#3a352d',  // long-form prose
    textMuted:     '#6b6a63',  // secondary labels, era chips
    textSubtle:    '#8a8578',  // captions, timestamps, eyebrow text
    textDisabled:  '#b8b2a0',  // unavailable / coming-soon items

    // Brand / accent
    brand:         '#c25b3f',  // terracotta — primary CTA, active borders, thumb
    brandDark:     '#8b3a24',  // logo gradient end, hover state
    brandGradient: 'linear-gradient(135deg, #c25b3f, #8b3a24)',

    // Overlays
    overlayModal:  'rgba(30, 25, 20, 0.45)',   // EventModal backdrop
    overlayFocus:  'rgba(24, 20, 16, 0.60)',   // DesignCanvas focus overlay
    overlayBlur:   'blur(6px)',                // backdrop-filter value
  },

  // ─── Typography ──────────────────────────────────────────────────────────

  font: {
    family: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",

    // Size scale (px) — named by role
    size: {
      caption:    10,   // super-tiny labels (logo subtitle)
      eyebrow:    11,   // ALL-CAPS section labels, timestamps
      label:      12,   // button text, toggle labels
      body2:      13,   // secondary body, sidebar event titles
      body1:      15,   // primary prose (event summary)
      ui:         16,   // app-level UI headings
      number:     20,   // current year in sidebar
      display2:   28,   // timeline year counter, modal sub-heading
      display1:   34,   // EventModal h2 title
    },

    weight: {
      regular: 400,
      medium:  500,
      semibold: 600,
      bold:    700,
    },

    letterSpacing: {
      eyebrow: '0.5px',    // small ALL-CAPS labels
      ui:      '-0.3px',   // UI headings
      display: '-0.8px',   // large display text
      number:  '-0.5px',   // tabular year counter
    },

    lineHeight: {
      tight:  1.15,  // display headings
      normal: 1.4,
      prose:  1.7,   // body paragraphs
    },

    // Convenience: tabular numerals for counters
    numeric: 'tabular-nums',
  },

  // ─── Spacing ─────────────────────────────────────────────────────────────

  space: {
    1:  4,
    2:  6,
    3:  8,
    4:  10,
    5:  12,
    6:  14,
    7:  16,
    8:  18,
    9:  20,
    10: 24,
    11: 28,
    12: 36,
  },

  // ─── Border Radius ───────────────────────────────────────────────────────

  radius: {
    sm:   4,   // small inline buttons (toggle item)
    md:   6,   // medium buttons, logo badge
    tag:  10,  // tag chips / badges
    card: 12,  // modal card
    pill: 18,  // round play/pause button
    xl:   24,  // floating hint pill
  },

  // ─── Shadows ─────────────────────────────────────────────────────────────

  shadow: {
    subtle:   '0 1px 2px rgba(0,0,0,0.06)',                             // toggle active item
    card:     '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)', // artboard card
    panel:    '0 8px 32px rgba(0,0,0,0.12)',                            // tweaks panel, dropdowns
    float:    '0 4px 16px rgba(0,0,0,0.08)',                            // floating hints
    modal:    '0 24px 80px rgba(0,0,0,0.24)',                           // EventModal
    thumb:    '0 1px 4px rgba(0,0,0,0.20)',                             // range input thumb
    dragging: '0 12px 40px rgba(0,0,0,0.25), 0 0 0 2px #c96442',       // DC drag state
  },

  // ─── Motion ──────────────────────────────────────────────────────────────

  motion: {
    fast:   '0.12s',
    normal: '0.15s',
    slow:   '0.18s',
    ease:   'ease',
    spring: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
  },

  // ─── Z-Index ─────────────────────────────────────────────────────────────

  z: {
    timeline:   10,
    panel:      50,
    modal:      100,
    overlay:    100,
    focus:      200,
  },

  // ─── Breakpoints ─────────────────────────────────────────────────────────

  breakpoint: {
    compact: 768,   // below this: compact header padding
    sidebar: 1024,  // min width for sidebar layout variant
  },

};

// Convenience alias
window.T = T;
