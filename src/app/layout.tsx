import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solopreneur - AI Org World',
  description: 'Isometric 2.5D world where your AI team works for you',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
