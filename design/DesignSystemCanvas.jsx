// DesignSystemCanvas.jsx — U-Origins Design System v1 Showcase
// Renders inside DesignCanvas. Shows all tokens and component specs.

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Swatch({ color, name, hex }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div onClick={copy} title={`Click to copy ${hex}`} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 8,
        background: color,
        border: '1px solid rgba(0,0,0,0.08)',
        marginBottom: 6,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'transform 0.12s',
      }} />
      <div style={{ fontSize: 10, color: '#3a352d', fontWeight: 600, lineHeight: 1.3 }}>{name}</div>
      <div style={{ fontSize: 9, color: '#8a8578', fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>
        {copied ? '✓ copied' : hex}
      </div>
    </div>
  );
}

function TokenRow({ label, value, mono = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '5px 0', borderBottom: '1px solid #f0ede4' }}>
      <span style={{ fontSize: 12, color: '#6b6a63' }}>{label}</span>
      <span style={{ fontSize: 11, color: '#2a251f', fontFamily: mono ? 'monospace' : 'inherit', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
      color: '#8a8578', marginBottom: 12, paddingBottom: 6,
      borderBottom: '1.5px solid #eae5d8',
    }}>
      {children}
    </div>
  );
}

// ─── Artboard contents ───────────────────────────────────────────────────────

function ColorTokens() {
  const groups = [
    { label: 'Background', swatches: [
      { name: 'bgPage', hex: '#f0eee9' },
      { name: 'bgMain', hex: '#fdfcf8' },
      { name: 'bgSurface', hex: '#fafaf7' },
      { name: 'bgCard', hex: '#ffffff' },
      { name: 'tagBg', hex: '#f4f1e8' },
    ]},
    { label: 'Border', swatches: [
      { name: 'border', hex: '#eae5d8' },
      { name: 'borderFaint', hex: '#eeeeee' },
    ]},
    { label: 'Text', swatches: [
      { name: 'textPrimary', hex: '#1a1815' },
      { name: 'textSecondary', hex: '#2a251f' },
      { name: 'textBody', hex: '#3a352d' },
      { name: 'textMuted', hex: '#6b6a63' },
      { name: 'textSubtle', hex: '#8a8578' },
      { name: 'textDisabled', hex: '#b8b2a0' },
    ]},
    { label: 'Brand', swatches: [
      { name: 'brand', hex: '#c25b3f' },
      { name: 'brandDark', hex: '#8b3a24' },
    ]},
  ];
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 4, letterSpacing: -0.3 }}>Color Tokens</div>
      <div style={{ fontSize: 11, color: '#8a8578', marginBottom: 20 }}>Click any swatch to copy the hex value</div>
      {groups.map(g => (
        <div key={g.label} style={{ marginBottom: 24 }}>
          <SectionHeader>{g.label}</SectionHeader>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {g.swatches.map(s => <Swatch key={s.name} color={s.hex} name={s.name} hex={s.hex} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographyTokens() {
  const scale = [
    { name: 'display1', size: 34, weight: 700, spacing: '-0.8px', role: 'EventModal h2 title' },
    { name: 'display2', size: 28, weight: 600, spacing: '-0.5px', role: 'Year counter, sub-heading' },
    { name: 'number', size: 20, weight: 700, spacing: '-0.3px', role: 'Sidebar current year' },
    { name: 'ui', size: 16, weight: 700, spacing: '-0.3px', role: 'App heading' },
    { name: 'body1', size: 15, weight: 400, spacing: '0', role: 'Primary prose' },
    { name: 'body2', size: 13, weight: 500, spacing: '0', role: 'Sidebar event titles' },
    { name: 'label', size: 12, weight: 500, spacing: '0', role: 'Button / toggle text' },
    { name: 'eyebrow', size: 11, weight: 600, spacing: '0.5px', role: 'ALL-CAPS labels' },
    { name: 'caption', size: 10, weight: 400, spacing: '0.4px', role: 'Logo subtitle' },
  ];
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 4, letterSpacing: -0.3 }}>Typography Scale</div>
      <div style={{ fontSize: 11, color: '#8a8578', marginBottom: 4 }}>Pretendard / system-ui</div>
      <div style={{ fontSize: 9, color: '#b8b2a0', marginBottom: 20, fontFamily: 'monospace' }}>
        'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
      </div>
      {scale.map(s => (
        <div key={s.name} style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #f0ede4' }}>
          <div style={{
            fontSize: Math.min(s.size, 28), fontWeight: s.weight,
            letterSpacing: s.spacing, color: '#1a1815',
            lineHeight: 1.2, marginBottom: 4,
          }}>
            역사 아카이브
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 10, color: '#c25b3f', fontWeight: 600 }}>{s.name}</span>
            <span style={{ fontSize: 10, color: '#8a8578' }}>{s.size}px / w{s.weight}</span>
            <span style={{ fontSize: 10, color: '#b8b2a0' }}>{s.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacingTokens() {
  const scale = [1,2,3,4,5,6,7,8,9,10,11,12];
  const px =    [4,6,8,10,12,14,16,18,20,24,28,36];
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 4, letterSpacing: -0.3 }}>Spacing Scale</div>
      <div style={{ fontSize: 11, color: '#8a8578', marginBottom: 24 }}>T.space[n] · all values in px</div>
      {scale.map((n, i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{ width: 28, fontSize: 11, color: '#8a8578', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {n}
          </div>
          <div style={{
            height: 16, borderRadius: 3, background: '#c25b3f',
            width: px[i], flexShrink: 0, opacity: 0.75,
          }} />
          <div style={{ fontSize: 11, color: '#3a352d', fontVariantNumeric: 'tabular-nums' }}>{px[i]}px</div>
        </div>
      ))}

      <div style={{ marginTop: 28 }}>
        <SectionHeader>Border Radius</SectionHeader>
        {[
          { name: 'sm',   value: 4,  role: 'Toggle item' },
          { name: 'md',   value: 6,  role: 'Buttons, logo badge' },
          { name: 'tag',  value: 10, role: 'Tag chips' },
          { name: 'card', value: 12, role: 'Modal card' },
          { name: 'pill', value: 18, role: 'Round button' },
          { name: 'xl',   value: 24, role: 'Floating pill' },
        ].map(r => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 32, fontSize: 11, color: '#8a8578' }}>{r.name}</div>
            <div style={{
              width: 40, height: 24, background: '#f4f1e8',
              borderRadius: r.value, border: '1.5px solid #eae5d8',
            }} />
            <div style={{ fontSize: 11, color: '#3a352d' }}>{r.value}px</div>
            <div style={{ fontSize: 10, color: '#b8b2a0' }}>{r.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShadowTokens() {
  const shadows = [
    { name: 'subtle',   val: '0 1px 2px rgba(0,0,0,0.06)',                            role: 'Toggle active item' },
    { name: 'card',     val: '0 1px 3px rgba(0,0,0,0.08),\n0 4px 16px rgba(0,0,0,0.06)', role: 'Artboard card' },
    { name: 'panel',    val: '0 8px 32px rgba(0,0,0,0.12)',                           role: 'Tweaks panel' },
    { name: 'float',    val: '0 4px 16px rgba(0,0,0,0.08)',                           role: 'Floating hints' },
    { name: 'modal',    val: '0 24px 80px rgba(0,0,0,0.24)',                          role: 'EventModal' },
  ];
  return (
    <div style={{ padding: 24, background: '#f4f1e8', height: '100%', overflowY: 'auto', fontFamily: 'inherit' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 4, letterSpacing: -0.3 }}>Shadow Tokens</div>
      <div style={{ fontSize: 11, color: '#8a8578', marginBottom: 24 }}>T.shadow[name]</div>
      {shadows.map(s => (
        <div key={s.name} style={{ marginBottom: 20 }}>
          <div style={{
            background: '#fff', borderRadius: 8,
            boxShadow: s.val.replace('\n', ''),
            padding: '16px 20px', marginBottom: 8,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2a251f' }}>{s.name}</div>
            <div style={{ fontSize: 10, color: '#8a8578', marginTop: 2 }}>{s.role}</div>
          </div>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#6b6a63', paddingLeft: 4, lineHeight: 1.6 }}>
            {s.val}
          </div>
        </div>
      ))}
    </div>
  );
}

function MotionTokens() {
  const [running, setRunning] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const durations = [
    { name: 'fast',   val: '0.12s', role: 'Hover micro-interactions' },
    { name: 'normal', val: '0.15s', role: 'Button state, toggle' },
    { name: 'slow',   val: '0.18s', role: 'Artboard reorder settle' },
  ];
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 4, letterSpacing: -0.3 }}>Motion Tokens</div>
      <div style={{ fontSize: 11, color: '#8a8578', marginBottom: 24 }}>Hover rows to preview</div>

      <SectionHeader>Duration</SectionHeader>
      {durations.map(d => (
        <div key={d.name}
          onMouseEnter={() => setActive(d.name)}
          onMouseLeave={() => setActive(null)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, cursor: 'default' }}>
          <div style={{ width: 40, fontSize: 11, color: '#8a8578' }}>{d.name}</div>
          <div style={{
            width: active === d.name ? 80 : 20, height: 20,
            background: '#c25b3f', borderRadius: 10,
            transition: `width ${d.val} ease`,
          }} />
          <div style={{ fontSize: 11, color: '#3a352d', fontFamily: 'monospace' }}>{d.val}</div>
          <div style={{ fontSize: 10, color: '#b8b2a0' }}>{d.role}</div>
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <SectionHeader>Easing</SectionHeader>
        <TokenRow label="ease (default)" value="ease" mono />
        <TokenRow label="spring (reorder)" value="cubic-bezier(0.2, 0.7, 0.3, 1)" mono />
      </div>
    </div>
  );
}

// ─── Component spec artboards ─────────────────────────────────────────────────

function ButtonSpec() {
  const [playing, setPlaying] = React.useState(false);
  const T_color = { brand: '#c25b3f', text: '#2a251f', textMuted: '#b8b2a0', border: '#d9d4c6', bg: '#fff' };

  const btnBase = {
    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  };

  return (
    <div style={{ padding: 24, fontFamily: 'inherit', height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 20, letterSpacing: -0.3 }}>Button</div>

      <SectionHeader>Play / Pause (Round Icon)</SectionHeader>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => setPlaying(!playing)} style={{
          ...btnBase,
          width: 36, height: 36, borderRadius: 18,
          border: `1px solid ${T_color.border}`,
          background: playing ? T_color.text : T_color.bg,
          color: playing ? '#fff' : T_color.text,
        }}>
          {playing
            ? <svg width="10" height="12" viewBox="0 0 10 12"><rect x="0" y="0" width="3" height="12" fill="currentColor"/><rect x="7" y="0" width="3" height="12" fill="currentColor"/></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 1 L11 6 L2 11 Z" fill="currentColor"/></svg>
          }
        </button>
        <div style={{ fontSize: 11, color: '#8a8578' }}>36×36 · radius pill(18) · click to toggle</div>
      </div>
      <div style={{ fontSize: 10, color: '#6b6a63', background: '#f4f1e8', borderRadius: 6, padding: '8px 12px', marginBottom: 24, fontFamily: 'monospace', lineHeight: 1.7 }}>
        idle: bg #fff, border #d9d4c6, color #2a251f{'\n'}
        active: bg #2a251f, border #2a251f, color #fff
      </div>

      <SectionHeader>Toggle Group</SectionHeader>
      {(() => {
        const [active, setA] = React.useState(0);
        const items = ['한국사', '동아시아', '세계사'];
        return (
          <div>
            <div style={{ display: 'flex', gap: 4, background: '#f4f1e8', padding: 3, borderRadius: 6, marginBottom: 12, width: 'fit-content' }}>
              {items.map((label, i) => (
                <button key={label} onClick={() => setA(i)} style={{
                  ...btnBase,
                  padding: '5px 11px', borderRadius: 4,
                  background: i === active ? '#fff' : 'transparent',
                  color: i === active ? '#2a251f' : '#b8b2a0',
                  fontSize: 12, fontWeight: i === active ? 600 : 500,
                  boxShadow: i === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}>{label}</button>
              ))}
            </div>
            <div style={{ fontSize: 10, color: '#6b6a63', background: '#f4f1e8', borderRadius: 6, padding: '8px 12px', fontFamily: 'monospace', lineHeight: 1.7 }}>
              wrap: bg tagBg, p:3, radius:md{'\n'}
              active item: bg white, shadow subtle{'\n'}
              inactive: bg transparent, textDisabled
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function TagSpec() {
  const tags = ['정치', '전쟁', '문화', '외교', '경제'];
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 20, letterSpacing: -0.3 }}>Tag / Badge</div>

      <SectionHeader>Event Tag Chip</SectionHeader>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {tags.map(t => (
          <span key={t} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 10, background: '#f4f1e8', color: '#6b6a63', letterSpacing: 0.2 }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#6b6a63', background: '#f4f1e8', borderRadius: 6, padding: '8px 12px', marginBottom: 24, fontFamily: 'monospace', lineHeight: 1.7 }}>
        font-size: 11px · padding: 3 9 · radius: tag(10){'\n'}
        bg: tagBg (#f4f1e8) · color: textMuted (#6b6a63)
      </div>

      <SectionHeader>Era Eyebrow Label</SectionHeader>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#8a8578', fontWeight: 600 }}>
          삼국시대 · 668
        </div>
      </div>
      <div style={{ fontSize: 10, color: '#6b6a63', background: '#f4f1e8', borderRadius: 6, padding: '8px 12px', fontFamily: 'monospace', lineHeight: 1.7 }}>
        size: eyebrow(11) · weight: semibold{'\n'}
        tracking: 0.8px · transform: uppercase{'\n'}
        color: textSubtle (#8a8578)
      </div>
    </div>
  );
}

function ModalSpec() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 20, letterSpacing: -0.3 }}>EventModal</div>

      <SectionHeader>Structure</SectionHeader>
      <div style={{ fontSize: 11, color: '#3a352d', lineHeight: 1.8, marginBottom: 16 }}>
        <div>• Fixed overlay — <span style={{ fontFamily: 'monospace', color: '#c25b3f' }}>zIndex: modal(100)</span></div>
        <div>• Backdrop: <span style={{ fontFamily: 'monospace', color: '#c25b3f' }}>overlayModal + blur(6px)</span></div>
        <div>• Card: max-width 820, max-height 88vh</div>
        <div>• Layout: <span style={{ fontFamily: 'monospace', color: '#c25b3f' }}>grid 1fr 320px</span></div>
        <div>• Card radius: <span style={{ fontFamily: 'monospace', color: '#c25b3f' }}>12px</span></div>
        <div>• Shadow: <span style={{ fontFamily: 'monospace', color: '#c25b3f' }}>shadow.modal</span></div>
      </div>

      <SectionHeader>Mini Preview</SectionHeader>
      <button onClick={() => setOpen(true)} style={{
        padding: '8px 16px', borderRadius: 6, border: 'none',
        background: '#c25b3f', color: '#fff', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16,
      }}>
        Open Modal Preview
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(30,25,20,0.45)',
          backdropFilter: 'blur(6px)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 12, maxWidth: 600, width: '100%',
            maxHeight: '80vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.24)',
            padding: 36,
          }}>
            <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a8578', fontWeight: 600, marginBottom: 12 }}>
              고려시대 · 918
            </div>
            <h2 style={{ margin: '0 0 16px', fontSize: 28, fontWeight: 700, color: '#1a1815', letterSpacing: -0.8, lineHeight: 1.15 }}>
              고려 건국
            </h2>
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {['정치', '왕조'].map(t => (
                <span key={t} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 10, background: '#f4f1e8', color: '#6b6a63' }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a352d', margin: 0 }}>
              왕건이 후삼국을 통일하고 고려를 건국하였다. 불교를 국교로 삼고 호족 세력을 통합하여 안정적인 왕조를 수립하였다.
            </p>
            <button onClick={() => setOpen(false)} style={{
              marginTop: 24, padding: '8px 16px', borderRadius: 6, border: '1px solid #eae5d8',
              background: 'transparent', color: '#6b6a63', fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>닫기 (Esc)</button>
          </div>
        </div>
      )}

      <SectionHeader>Anatomy</SectionHeader>
      <div style={{ background: '#fafaf7', borderRadius: 8, padding: 16, border: '1px solid #eae5d8' }}>
        <div style={{ fontSize: 11, color: '#6b6a63', lineHeight: 2 }}>
          <div style={{ borderLeft: '3px solid #c25b3f', paddingLeft: 10, marginBottom: 4 }}>Backdrop (onClick → close)</div>
          <div style={{ borderLeft: '3px solid #8b3a24', paddingLeft: 10, marginBottom: 4 }}>Card (stopPropagation)</div>
          <div style={{ paddingLeft: 20, fontSize: 10 }}>├ Body col: eyebrow · h2 · tags · summary · causality</div>
          <div style={{ paddingLeft: 20, fontSize: 10 }}>└ Sidebar col 320px: reactions · related events</div>
        </div>
      </div>
    </div>
  );
}

function TimelineSpec() {
  const [year, setYear] = React.useState(668);
  const min = 57, max = 1910;
  const pct = (year - min) / (max - min);

  return (
    <div style={{ padding: 24, fontFamily: 'inherit', height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 20, letterSpacing: -0.3 }}>Timeline Scrubbar</div>

      <SectionHeader>Live Preview</SectionHeader>
      <div style={{ background: '#fafaf7', borderTop: '1px solid #eae5d8', borderRadius: 8, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18, border: '1px solid #d9d4c6',
            background: '#fff', color: '#2a251f', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 1 L11 6 L2 11 Z" fill="currentColor"/></svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#2a251f', letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>
            {year < 0 ? `BCE ${-year}` : year}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 13, color: '#6b6a63' }}>삼국~통일신라</div>
        </div>
        {/* Simplified scrub track */}
        <div style={{ position: 'relative', height: 28, cursor: 'pointer', borderRadius: 4, overflow: 'visible' }}
          onClick={e => {
            const r = e.currentTarget.getBoundingClientRect();
            setYear(Math.round(min + Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (max - min)));
          }}>
          <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 4, background: '#eae5d8', borderRadius: 2 }} />
          <div style={{ position: 'absolute', top: 4, left: `${pct * 100}%`, transform: 'translateX(-50%)' }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#c25b3f', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      </div>

      <SectionHeader>Spec</SectionHeader>
      <div style={{ fontSize: 10, color: '#6b6a63', lineHeight: 2 }}>
        <TokenRow label="container bg" value="bgSurface #fafaf7" />
        <TokenRow label="border-top" value="1px solid border" />
        <TokenRow label="track height" value="4px" />
        <TokenRow label="track bg" value="inputTrack #eae5d8" />
        <TokenRow label="thumb" value="16×16, brand #c25b3f" />
        <TokenRow label="thumb border" value="2px solid white" />
        <TokenRow label="thumb shadow" value="shadow.thumb" />
        <TokenRow label="year font-size" value="28px / w600" />
        <TokenRow label="year letter-spacing" value="-0.5px" />
      </div>
    </div>
  );
}

function HeaderSpec() {
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 20, letterSpacing: -0.3 }}>App Header</div>

      <SectionHeader>Live Preview</SectionHeader>
      <div style={{ background: '#fff', borderBottom: '1px solid #eae5d8', display: 'flex', alignItems: 'center', gap: 20, padding: '18px 28px', borderRadius: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #c25b3f, #8b3a24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>U</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, color: '#1a1815' }}>U-Origins</div>
            <div style={{ fontSize: 10, color: '#8a8578', letterSpacing: '0.4px' }}>한국사 · 열린 역사 아카이브</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, background: '#f4f1e8', padding: 3, borderRadius: 6 }}>
          {['영토', '종교', '수도'].map((l, i) => (
            <div key={l} style={{
              padding: '5px 11px', borderRadius: 4,
              background: i === 0 ? '#fff' : 'transparent',
              color: i === 0 ? '#2a251f' : '#b8b2a0',
              fontSize: 12, fontWeight: i === 0 ? 600 : 500,
              boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}>{l}</div>
          ))}
        </div>
      </div>

      <SectionHeader>Spec</SectionHeader>
      <TokenRow label="background" value="bgCard #fff" />
      <TokenRow label="border-bottom" value="1px solid border" />
      <TokenRow label="padding (default)" value="18px 28px" />
      <TokenRow label="padding (compact)" value="12px 20px" />
      <TokenRow label="logo badge size" value="28×28, radius md(6)" />
      <TokenRow label="logo badge bg" value="brandGradient" />
      <TokenRow label="wordmark size" value="16px / w700" />
      <TokenRow label="wordmark tracking" value="-0.3px" />
      <TokenRow label="subtitle size" value="10px / w400" />
      <TokenRow label="subtitle tracking" value="0.4px" />
    </div>
  );
}

function GlobeMapSpec() {
  return (
    <div style={{ padding: 24, fontFamily: 'inherit', height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1815', marginBottom: 20, letterSpacing: -0.3 }}>GlobeMap</div>

      <SectionHeader>Visual Layers</SectionHeader>
      {[
        { label: '영토 (Territory)', desc: 'Polygon fills keyed by era color. Active year ± buffer determines visibility.' },
        { label: '수도 (Capital)', desc: 'Dot pins. Radius proportional to era significance. White border 2px.' },
        { label: '종교 (Religion)', desc: 'Symbol overlay at site coords. Toggle-gated layer.' },
        { label: 'Event Pins', desc: 'Clickable markers. Brand #c25b3f fill. Triggers EventModal.' },
      ].map(l => (
        <div key={l.label} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f0ede4' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#2a251f', marginBottom: 4 }}>{l.label}</div>
          <div style={{ fontSize: 11, color: '#6b6a63', lineHeight: 1.6 }}>{l.desc}</div>
        </div>
      ))}

      <SectionHeader>Interaction</SectionHeader>
      <div style={{ fontSize: 11, color: '#3a352d', lineHeight: 1.9 }}>
        <div>• Drag → rotate globe (lng/lat state)</div>
        <div>• Pin click → setSelectedEvent(ev)</div>
        <div>• Year prop → filter active territories</div>
        <div>• Layers prop → toggle overlays</div>
      </div>

      <SectionHeader>Props</SectionHeader>
      <TokenRow label="year" value="number" />
      <TokenRow label="data" value="KoreaHistoryDataset" />
      <TokenRow label="rotation" value="{ lng, lat }" />
      <TokenRow label="onRotate" value="(rotation) => void" />
      <TokenRow label="onEventPin" value="(event) => void" />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function DesignSystemCanvas() {
  return (
    <DesignCanvas>
      <DCSection id="tokens" title="Design Tokens" subtitle="Primitive values — import from design/tokens.js">
        <DCArtboard id="colors" label="Colors" width={520} height={680}>
          <ColorTokens />
        </DCArtboard>
        <DCArtboard id="typography" label="Typography" width={400} height={680}>
          <TypographyTokens />
        </DCArtboard>
        <DCArtboard id="spacing" label="Spacing & Radius" width={340} height={680}>
          <SpacingTokens />
        </DCArtboard>
        <DCArtboard id="shadows" label="Shadows" width={340} height={680}>
          <ShadowTokens />
        </DCArtboard>
        <DCArtboard id="motion" label="Motion" width={340} height={400}>
          <MotionTokens />
        </DCArtboard>
      </DCSection>

      <DCSection id="components" title="Components" subtitle="Spec + live interactive previews">
        <DCArtboard id="header" label="App Header" width={420} height={460}>
          <HeaderSpec />
        </DCArtboard>
        <DCArtboard id="button" label="Button" width={380} height={520}>
          <ButtonSpec />
        </DCArtboard>
        <DCArtboard id="tag" label="Tag / Badge" width={340} height={420}>
          <TagSpec />
        </DCArtboard>
        <DCArtboard id="timeline" label="Timeline Scrubbar" width={400} height={480}>
          <TimelineSpec />
        </DCArtboard>
        <DCArtboard id="modal" label="EventModal" width={400} height={600}>
          <ModalSpec />
        </DCArtboard>
        <DCArtboard id="globe" label="GlobeMap" width={360} height={440}>
          <GlobeMapSpec />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

window.DesignSystemCanvas = DesignSystemCanvas;
