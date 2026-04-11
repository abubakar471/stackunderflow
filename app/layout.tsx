import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';
import ThemeProvider from '@/context/Theme';
import Navbar from '@/components/navigation/navbar';

const inter = localFont({
  src: '../public/fonts/Inter.ttf',
  variable: '--font-inter',
  weight: '100 200 300 400 500 600 700 800 900',
  display: 'swap',
});

const spaceGrotesk = localFont({
  src: '../public/fonts/SpaceGroteskVF.ttf',
  variable: '--font-space-grotesk',
  weight: '100 200 300 400 500 600 700 800 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StackUnderflow',
  description:
    "A community for developers to engage and share their QnA. For anyone who wants to get a feel a family like environment and It's free to use",
  icons: {
    icon: '/images/site-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
