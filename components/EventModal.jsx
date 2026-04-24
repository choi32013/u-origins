'use client';

import { useState } from 'react';

export default function EventModal({ event, data, onClose, onSelectEvent }) {
  const [reaction, setReaction] = useState(null);
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [issueSent, setIssueSent] = useState(false);

  if (!event) return null;

  const causes = event.causes.map(id => data.events.find(e => e.id === id)).filter(Boolean);
  const effects = event.effects.map(id => data.events.find(e => e.id === id)).filter(Boolean);
  const formatYear = (y) => y < 0 ? `BCE ${-y}` : `${y}`;
  const era = data.eras.find(e => event.year >= e.start && event.year < e.end);

  const submitIssue = () => {
    if (!issueText.trim()) return;
    console.log('[ADMIN ONLY]', { eventId: event.id, message: issueText });
    setIssueSent(true);
    setTimeout(() => { setIssueOpen(false); setIssueText(''); setIssueSent(false); }, 1500);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30, 25, 20, 0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          maxWidth: 820, width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.24)',
          display: 'grid', gridTemplateColumns: '1fr 320px',
        }}
      >
        {/* 본문 */}
        <div style={{ padding: '36px 36px 28px', borderRight: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a8578', fontWeight: 600 }}>
              {era ? era.label : ''} · {formatYear(event.year)}
            </span>
          </div>
          <h2 style={{ margin: '0 0 16px', fontSize: 34, fontWeight: 700, color: '#1a1815', letterSpacing: -0.8, lineHeight: 1.15 }}>
            {event.label}
          </h2>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {event.tags && event.tags.map(t => (
              <span key={t} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 10, background: '#f4f1e8', color: '#6b6a63', letterSpacing: 0.2 }}>
                {t}
              </span>
            ))}
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a352d', marginBottom: 28 }}>
            {event.summary}
          </p>

          {(causes.length > 0 || effects.length > 0) && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8a8578', fontWeight: 600, marginBottom: 14 }}>
                인과관계
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14, alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {causes.length === 0 && <div style={{ fontSize: 12, color: '#b8b2a0', fontStyle: 'italic', padding: '8px 0' }}>—</div>}
                  {causes.map(c => (
                    <button key={c.id} onClick={() => onSelectEvent(c)}
                      style={{ textAlign: 'left', border: '1px solid #e6e1d3', background: '#fafaf7', padding: '10px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#3a352d', fontFamily: 'inherit', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#c25b3f'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fafaf7'; e.currentTarget.style.borderColor = '#e6e1d3'; }}
                    >
                      <div style={{ fontSize: 10, color: '#8a8578', marginBottom: 2 }}>{formatYear(c.year)}</div>
                      <div style={{ fontWeight: 500 }}>{c.label}</div>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <svg width="44" height="10"><path d="M0 5 L40 5 M34 1 L40 5 L34 9" stroke="#c25b3f" strokeWidth="1.5" fill="none" /></svg>
                  <div style={{ fontSize: 11, color: '#c25b3f', fontWeight: 600, padding: '4px 10px', borderRadius: 4, background: '#fcf5f2', letterSpacing: 0.3, textAlign: 'center', width: 80 }}>
                    {event.label.length > 6 ? event.label.slice(0, 6) + '…' : event.label}
                  </div>
                  <svg width="44" height="10"><path d="M0 5 L40 5 M34 1 L40 5 L34 9" stroke="#c25b3f" strokeWidth="1.5" fill="none" /></svg>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {effects.length === 0 && <div style={{ fontSize: 12, color: '#b8b2a0', fontStyle: 'italic', padding: '8px 0' }}>—</div>}
                  {effects.map(c => (
                    <button key={c.id} onClick={() => onSelectEvent(c)}
                      style={{ textAlign: 'left', border: '1px solid #e6e1d3', background: '#fafaf7', padding: '10px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#3a352d', fontFamily: 'inherit', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#c25b3f'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fafaf7'; e.currentTarget.style.borderColor = '#e6e1d3'; }}
                    >
                      <div style={{ fontSize: 10, color: '#8a8578', marginBottom: 2 }}>{formatYear(c.year)}</div>
                      <div style={{ fontWeight: 500 }}>{c.label}</div>
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: '#8a8578', textAlign: 'center' }}>원인</div>
                <div />
                <div style={{ fontSize: 10, color: '#8a8578', textAlign: 'center' }}>결과</div>
              </div>
            </div>
          )}
        </div>

        {/* 사이드: 참여 + 액션 */}
        <div style={{ padding: '36px 28px', background: '#fafaf7', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <a
            href={event.sourceUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', background: '#2a251f', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: 0.2 }}
          >
            자세히 보기 →
          </a>

          <div>
            <div style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: '#8a8578', fontWeight: 600, marginBottom: 10 }}>
              이 서술이 도움이 되었나요?
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setReaction(reaction === 'like' ? null : 'like')}
                style={{ flex: 1, padding: '10px', borderRadius: 6, border: `1px solid ${reaction === 'like' ? '#2a251f' : '#d9d4c6'}`, background: reaction === 'like' ? '#2a251f' : '#fff', color: reaction === 'like' ? '#fff' : '#3a352d', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6 L3 12 L1 12 L1 6 Z M3 6 L5 1 Q6 0 7 1 L7 4 L12 4 Q13 4 13 5 L12 11 Q11.5 12 10.5 12 L3 12"/></svg>
                좋아요
              </button>
              <button onClick={() => setReaction(reaction === 'dislike' ? null : 'dislike')}
                style={{ flex: 1, padding: '10px', borderRadius: 6, border: `1px solid ${reaction === 'dislike' ? '#2a251f' : '#d9d4c6'}`, background: reaction === 'dislike' ? '#2a251f' : '#fff', color: reaction === 'dislike' ? '#fff' : '#3a352d', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: 'rotate(180deg)' }}><path d="M3 6 L3 12 L1 12 L1 6 Z M3 6 L5 1 Q6 0 7 1 L7 4 L12 4 Q13 4 13 5 L12 11 Q11.5 12 10.5 12 L3 12"/></svg>
                싫어요
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e6e1d3', paddingTop: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: '#8a8578', fontWeight: 600, marginBottom: 8 }}>
              역사는 하나의 시각이 아닙니다
            </div>
            <p style={{ fontSize: 12, color: '#6b6a63', lineHeight: 1.5, margin: '0 0 10px' }}>
              오류·편향·다른 시각이 있다면 알려주세요. 관리자에게만 전달됩니다.
            </p>
            {!issueOpen ? (
              <button onClick={() => setIssueOpen(true)}
                style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px dashed #b8b2a0', background: 'transparent', color: '#3a352d', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                이슈 제기
              </button>
            ) : issueSent ? (
              <div style={{ padding: '12px', background: '#e8f0e5', color: '#3a5a30', fontSize: 13, borderRadius: 6, textAlign: 'center' }}>
                ✓ 관리자에게 전달되었습니다
              </div>
            ) : (
              <div>
                <textarea
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="어떤 부분이 문제인가요?"
                  style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 6, border: '1px solid #d9d4c6', fontFamily: 'inherit', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button onClick={() => { setIssueOpen(false); setIssueText(''); }}
                    style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid #d9d4c6', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                    취소
                  </button>
                  <button onClick={submitIssue}
                    style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', background: '#c25b3f', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                    제출
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: 1 }} />
          <button onClick={onClose}
            style={{ padding: '8px', borderRadius: 6, border: 'none', background: 'transparent', color: '#8a8578', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
            닫기 (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
