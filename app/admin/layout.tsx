'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [autorise, setAutorise] = useState(false);
  const [verification, setVerification] = useState(true);
  const [nomUtilisateur, setNomUtilisateur] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const nom = localStorage.getItem('nom');

    if (!token || role !== 'ADMIN') {
      router.push('/login');
      return;
    }

    setNomUtilisateur(nom || 'Admin');
    setAutorise(true);
    setVerification(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    localStorage.removeItem('email');
    router.push('/login');
  };

  // Tant qu'on vérifie le rôle, on affiche un écran de chargement
  if (verification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Vérification en cours...</p>
      </div>
    );
  }

  if (!autorise) {
    return null; // La redirection vers /login est déjà en cours
  }

  const liens = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/pneus', label: 'Pneus', icon: '🛞' },
    { href: '/admin/commandes', label: 'Commandes', icon: '📦' },
    { href: '/admin/clients', label: 'Clients', icon: '👥' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <span className="text-red-600 font-bold text-2xl">Pneu</span>
          <span className="text-gray-800 font-bold text-2xl">.Shop</span>
          <p className="text-xs text-gray-400 mt-1">Espace Administration</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {liens.map((lien) => {
            const actif = pathname === lien.href;
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  actif
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{lien.icon}</span>
                {lien.label}
              </Link>
            );
          })}
        </nav>

        {/* Bas de sidebar : utilisateur + déconnexion */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">
            Connecté : <span className="font-medium text-gray-800">{nomUtilisateur}</span>
          </p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}