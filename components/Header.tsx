'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Barre supérieure */}
      <div className="bg-red-600 text-white text-sm py-1 text-center">
        Vos pneumatiques en un seul clic ! 🚗
      </div>

      {/* Header principal */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-red-600 font-bold text-2xl">Pneu</span>
          <span className="text-gray-800 font-bold text-2xl">.Shop</span>
        </Link>

        {/* Menu navigation desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-red-600 font-medium">
            Accueil
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-red-600 font-medium">
            Nos Pneus
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-red-600 font-medium">
            Mon Compte
          </Link>
        </nav>

        {/* Icônes droite */}
        <div className="flex items-center gap-4">
          {/* Favoris */}
          <Link href="/favorites" className="text-gray-600 hover:text-red-600">
            <FaHeart size={20} />
          </Link>

          {/* Panier */}
          <Link href="/cart" className="relative text-gray-600 hover:text-red-600">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Compte */}
          <Link href="/login" className="text-gray-600 hover:text-red-600">
            <FaUser size={20} />
          </Link>

          {/* Menu burger mobile */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          <Link href="/" className="text-gray-700 hover:text-red-600 font-medium">
            Accueil
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-red-600 font-medium">
            Nos Pneus
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-red-600 font-medium">
            Mon Compte
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-red-600 font-medium">
            Panier
          </Link>
        </div>
      )}
    </header>
  );
}