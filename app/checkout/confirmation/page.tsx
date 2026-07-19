'use client';

import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="bg-white rounded-2xl shadow-lg p-10">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Commande confirmée !
        </h1>
        <p className="text-gray-600 mb-8">
          Merci pour votre commande. Nous avons bien reçu votre paiement et
          votre commande est en cours de traitement. Vous recevrez une
          confirmation par email prochainement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition">
              Retour à l'accueil
            </button>
          </Link>
          <Link href="/products">
            <button className="border border-red-600 text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition">
              Continuer mes achats
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}