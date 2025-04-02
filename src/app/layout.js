import { Inter } from 'next/font/google';  // Make sure it's being imported like this
import './globals.css';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin'],
  weight: '400',  // You can adjust weight as needed
});

export const metadata = {
  title: 'Sveto',
  description: 'Spiritual guide',
  icons: {
    icon: "/images/favicon.ico", // Favicon path (supports .png too)
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}