import './globals.css';

export const metadata = {
  title: 'U-Origins — 열린 역사 아카이브',
  description: '지구본 지도 × 시간 스크럽바 × 사건 인과관계. 확장 가능한 플랫폼 구조.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
