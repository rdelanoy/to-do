import type { Metadata } from 'next';
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'To-Do App',
  description: 'Simple to-do list with Redux Toolkit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
