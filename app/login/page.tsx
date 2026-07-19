'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

 const router = useRouter();
const [erreur, setErreur] = useState('');
const [chargement, setChargement] = useState(false);

const handleSubmit = async () => {
  setErreur('');
  setChargement(true);

  try {
    if (isLogin) {
      // Connexion
      const response = await api.post('/api/auth/login', {
        email,
        motDePasse: password,
      });

      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('nom', data.nom);
      localStorage.setItem('email', data.email);

      if (data.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } else {
      // Inscription (à connecter plus tard)
      console.log('Inscription à connecter');
    }

  } catch (error) {
    setErreur('Email ou mot de passe incorrect');
  } finally {
    setChargement(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-red-600 font-bold text-3xl">Pneu</span>
          <span className="text-gray-800 font-bold text-3xl">.Shop</span>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>
{erreur && (
  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center mb-4">
    {erreur}
  </div>
)}



        {/* Tabs Login / Inscription */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 font-medium transition ${
              isLogin ? 'bg-red-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 font-medium transition ${
              !isLogin ? 'bg-red-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <div className="flex flex-col gap-4">

          {/* Champs inscription uniquement */}
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Prénom"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nom"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Adresse email"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Mot de passe */}
          <input
            type="password"
            placeholder="Mot de passe"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Mot de passe oublié */}
          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-red-600 text-sm hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          )}

          {/* Bouton submit */}
       <button
  onClick={handleSubmit}
  disabled={chargement}
  className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition"
>
  {chargement ? 'Chargement...' : (isLogin ? '🔐 Se connecter' : '✅ Créer mon compte')}
</button>

        </div>

        {/* Lien admin */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <Link href="/admin" className="text-gray-500 text-sm hover:text-red-600">
            👤 Accès Administration
          </Link>
        </div>

      </div>
    </div>
  );
}