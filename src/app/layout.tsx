import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: '인생 갤러리 (Life Gallery)',
  description: '시니어를 위한 AI 기반 사진치유 및 발표 지원 앱',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
