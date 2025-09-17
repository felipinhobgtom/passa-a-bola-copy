// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext"; // 1. Importe o Provider

export const metadata = {
  title: "Passa a Bola",
  description: "Plataforma para o futebol feminino",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 2. Envolva tudo com o AuthProvider */}
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}