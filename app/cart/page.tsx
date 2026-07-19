'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantite, removeFromCart, subtotal } = useCart();

  const fraisLivraison = cart.length > 0 ? 30 : 0;
  const total = subtotal + fraisLivraison;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Mon Panier</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">Votre panier est vide 😕</p>
          <Link href="/products">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700">
              Voir nos pneus
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Liste des articles */}
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-600 font-medium">ARTICLE</th>
                  <th className="text-center py-3 text-gray-600 font-medium">PRIX</th>
                  <th className="text-center py-3 text-gray-600 font-medium">QTÉ</th>
                  <th className="text-center py-3 text-gray-600 font-medium">SOUS-TOTAL</th>
                  <th className="text-center py-3 text-gray-600 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    {/* Article */}
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.nom}
                          className="w-20 h-20 object-contain bg-gray-100 rounded-lg p-2"
                        />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{item.nom}</p>
                          <p className="text-gray-500 text-xs">{item.dimensions}</p>
                        </div>
                      </div>
                    </td>
                    {/* Prix */}
                    <td className="text-center font-medium text-gray-800">
                      {item.prix.toLocaleString('fr-FR')} Dhs
                    </td>
                    {/* Quantité */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantite(item.id, item.quantite - 1)}
                          className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantite}</span>
                        <button
                          onClick={() => updateQuantite(item.id, item.quantite + 1)}
                          className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    {/* Sous-total */}
                    <td className="text-center font-bold text-gray-800">
                      {(item.prix * item.quantite).toLocaleString('fr-FR')} Dhs
                    </td>
                    {/* Supprimer */}
                    <td className="text-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Retirer du panier"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Boutons bas */}
            <div className="flex gap-4 mt-6">
              <Link href="/products">
                <button className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50">
                  ← Continuer mes achats
                </button>
              </Link>
            </div>
          </div>

          {/* Résumé commande */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4">RÉSUMÉ</h2>

              <div className="flex justify-between text-gray-600 mb-2">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString('fr-FR')} Dhs</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4">
                <span>Livraison</span>
                <span>{fraisLivraison} Dhs</span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-800 text-lg">
                <span>Total</span>
                <span>{total.toLocaleString('fr-FR')} Dhs</span>
              </div>

              {/* Bouton payer */}
              <Link href="/checkout">
                <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition">
                  💳 PASSER LA COMMANDE
                </button>
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}