'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    vatNumber: '',
  });

  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const fraisLivraison = 30;
  const total = subtotal + fraisLivraison;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayer = async () => {
    setErreur('');
    setChargement(true);

    try {
      const adresseComplete = `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}, ${formData.city} ${formData.postalCode}`;

      const lignes = cart.map((item) => ({
        pneuId: item.id,
        quantite: item.quantite,
      }));

      await api.post('/api/commandes', {
        adresseLivraison: adresseComplete,
        lignes: lignes,
      });

      clearCart();
      router.push('/checkout/confirmation');

    } catch (error: any) {
      const message = error.response?.data || 'Erreur lors de la création de la commande';
      setErreur(message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <span className={`font-medium ${step >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
            Livraison
          </span>
        </div>
        <div className={`flex-1 h-1 max-w-20 rounded ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className={`font-medium ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
            Vérification & Paiement
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulaire */}
        <div className="flex-1">
          {/* Étape 1 — Livraison */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Adresse de livraison
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Société</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Adresse *</label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 mb-2"
                  />
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Ville *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Code postal</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Numéro de TVA</label>
                  <input
                    type="text"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition mt-4"
                >
                  Continuer → Vérification & Paiement
                </button>
              </div>
            </div>
          )}

          {/* Étape 2 — Vérification & Paiement */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Vérification & Paiement
              </h2>

              {erreur && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                  {erreur}
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">Adresse de livraison</h3>
                  <button
                    onClick={() => setStep(1)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Modifier
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-gray-600 text-sm">{formData.address1}</p>
                <p className="text-gray-600 text-sm">{formData.city} {formData.postalCode}</p>
                <p className="text-gray-600 text-sm">{formData.phone}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">💳 Informations de paiement</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Numéro de carte *
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Date d'expiration *
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        CVV *
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayer}
                disabled={chargement}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-xl transition disabled:bg-gray-400"
              >
                {chargement ? 'Traitement en cours...' : `🔒 PAYER MAINTENANT — ${total.toLocaleString('fr-FR')} Dhs`}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">
                🔒 Paiement sécurisé (simulation)
              </p>
            </div>
          )}
        </div>

        {/* Résumé commande */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-4">RÉSUMÉ</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <img src={item.image} alt={item.nom} className="w-16 h-16 object-contain bg-gray-100 rounded-lg p-1" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.nom}</p>
                  <p className="text-xs text-gray-500">{item.dimensions} × {item.quantite}</p>
                  <p className="text-sm font-bold text-gray-800">
                    {(item.prix * item.quantite).toLocaleString('fr-FR')} Dhs
                  </p>
                </div>
              </div>
            ))}

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
          </div>
        </div>
      </div>
    </div>
  );
}