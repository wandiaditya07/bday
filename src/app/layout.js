import "./globals.css";

export const metadata = {
  title: "Untuk Kesayangan",
  description: "Selamat Ulang Tahun",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Playfair+Display:ital,wght@1,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
