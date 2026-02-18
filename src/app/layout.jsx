import './globals.css';

export const metadata = {
  title: "Tweety's Interactive Adventure",
  description: 'An interactive story game with mini-games and surprises!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

