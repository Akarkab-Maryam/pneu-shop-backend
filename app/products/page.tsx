'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import { PneuBackend, PneuAffichage, formaterPneu, libelleSaison } from '@/lib/pneuUtils';

export default function ProductsPage() {
  const [pneus, setPneus] = useState<PneuAffichage[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [saison, setSaison] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [idAjoute, setIdAjoute] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const chargerPneus = async () => {
      try {
        const response = await api.get<PneuBackend[]>('/api/pneus');
        setPneus(response.data.map(formaterPneu));
      } catch (error) {
        setErreur('Impossible de charger les pneus. Réessayez plus tard.');
      } finally {
        setChargement(false);
      }
    };
    chargerPneus();
  }, []);

  const produitsFiltres = pneus.filter((p) => {
    const matchSaison = saison === 'tous' || p.saison === saison;
    const matchRecherche = p.nom.toLowerCase().includes(recherche.toLowerCase());
    return matchSaison && matchRecherche;
  });

  const handleAjouterPanier = (pneu: PneuAffichage) => {
    if (pneu.stock <= 0) return;

    addToCart({
      id: pneu.id,
      nom: pneu.nom,
      dimensions: pneu.dimensions,
      prix: pneu.prix,
      image: pneu.image,
    });
    setIdAjoute(pneu.id);
    setTimeout(() => setIdAjoute(null), 1500);
  };

  if (chargement) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-gray-500">
        Chargement des pneus...
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-red-600">
        {erreur}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        • NOS PNEUS •
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Rechercher un pneu..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <div className="flex gap-2">
          {['tous', 'ETE', 'HIVER', 'QUATRE_SAISONS'].map((s) => (
            <button
              key={s}
              onClick={() => setSaison(s)}
              className={`px-4 py-3 rounded-lg font-medium transition ${
                saison === s
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s === 'tous' ? 'Tous' : libelleSaison(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {produitsFiltres.map((pneu) => (
          <div key={pneu.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition group">
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4 relative overflow-hidden">
              <img
                src={pneu.image}
                alt={pneu.nom}
                className="w-full h-full object-contain p-4"
              />
              <button
                onClick={() => handleAjouterPanier(pneu)}
                disabled={pneu.stock <= 0}
                className={`absolute bottom-0 left-0 right-0 text-white text-center py-2 font-bold text-sm transition cursor-pointer ${
                  pneu.stock <= 0
                    ? 'bg-gray-400 opacity-100 cursor-not-allowed'
                    : idAjoute === pneu.id
                    ? 'bg-green-600 opacity-100'
                    : 'bg-red-600 opacity-0 group-hover:opacity-100'
                }`}
              >
                {pneu.stock <= 0
                  ? 'RUPTURE DE STOCK'
                  : idAjoute === pneu.id
                  ? '✓ AJOUTÉ AU PANIER'
                  : '🛒 AJOUTER AU PANIER'}
              </button>
            </div>

            <h3 className="font-bold text-gray-800 text-sm text-center">
              {pneu.nom}
            </h3>
            <p className="text-gray-500 text-xs text-center mt-1">
              {pneu.dimensions}
            </p>
            <p className="text-center text-xs text-gray-400 mt-1">
              {libelleSaison(pneu.saison)}
            </p>

            <p className="text-center font-bold text-gray-800 text-lg mt-2">
              {pneu.prix.toLocaleString('fr-FR')} Dhs
            </p>

            <Link href={`/products/${pneu.id}`}>
              <button className="w-full mt-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-2 rounded-lg text-sm font-medium transition">
                Voir le détail
              </button>
            </Link>
          </div>
        ))}
      </div>

      {produitsFiltres.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Aucun pneu trouvé 😕</p>
        </div>
      )}
    </div>
  );
}