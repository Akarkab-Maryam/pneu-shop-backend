import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      
      {/* Section principale */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + description */}
        <div>
          <div className="flex items-center gap-1 mb-3">
            <span className="text-red-500 font-bold text-2xl">Pneu</span>
            <span className="text-white font-bold text-2xl">.Shop</span>
          </div>
          <p className="text-gray-400 text-sm">
            Vos pneumatiques en un seul clic. Qualité, rapidité et livraison partout au Maroc.
          </p>
          {/* Réseaux sociaux */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-blue-500">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500">
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Navigation</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-red-500 text-sm">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-400 hover:text-red-500 text-sm">
                Nos Pneus
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-gray-400 hover:text-red-500 text-sm">
                Mon Panier
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-gray-400 hover:text-red-500 text-sm">
                Mon Compte
              </Link>
            </li>
          </ul>
        </div>

        {/* Catégories */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Catégories</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/products?category=tourisme" className="text-gray-400 hover:text-red-500 text-sm">
                Pneus Tourisme
              </Link>
            </li>
            <li>
              <Link href="/products?category=4x4" className="text-gray-400 hover:text-red-500 text-sm">
                Pneus 4x4 / SUV
              </Link>
            </li>
            <li>
              <Link href="/products?category=camionnette" className="text-gray-400 hover:text-red-500 text-sm">
                Pneus Camionnette
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2 text-gray-400 text-sm">
              <FaPhone className="text-red-500" />
              <span>+212 6XX XXX XXX</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400 text-sm">
              <FaEnvelope className="text-red-500" />
              <span>contact@pneu-shop.ma</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400 text-sm">
              <FaMapMarkerAlt className="text-red-500" />
              <span>Casablanca, Maroc</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Barre du bas */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-sm">
        © 2026 Pneu.Shop — Tous droits réservés
      </div>

    </footer>
  );
}