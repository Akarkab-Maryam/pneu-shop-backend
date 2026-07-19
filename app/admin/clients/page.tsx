'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  role: 'ADMIN' | 'CLIENT';
  actif: boolean;
  adresse: string | null;
  ville: string | null;
  codePostal: string | null;
  pays: string;
  dateCreation: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Utilisateur[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [recherche, setRecherche] = useState('');
  const [idEnCours, setIdEnCours] = useState<number | null>(null);

  useEffect(() => {
    chargerClients();
  }, []);

  const chargerClients = async () => {
    setChargement(true);
    setErreur('');
    try {
      const response = await api.get('/api/utilisateurs');
      // On ne garde que les utilisateurs avec le rôle CLIENT
      const clientsUniquement = response.data.filter(
        (u: Utilisateur) => u.role === 'CLIENT'
      );
      setClients(clientsUniquement);
    } catch (err) {
      setErreur('Impossible de charger les clients.');
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const toggleBloquer = async (id: number) => {
    setIdEnCours(id);
    try {
      const response = await api.put(`/api/utilisateurs/${id}/bloquer`);
      setClients(clients.map((c) => (c.id === id ? response.data : c)));
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut.');
      console.error(err);
    } finally {
      setIdEnCours(null);
    }
  };

  const clientsFiltres = clients.filter((c) => {
    const texte = `${c.nom} ${c.prenom} ${c.email}`.toLowerCase();
    return texte.includes(recherche.toLowerCase());
  });

  if (chargement) {
    return <p className="text-gray-500">Chargement des clients...</p>;
  }

  if (erreur) {
    return <p className="text-red-600">{erreur}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des clients</h1>
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nom</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Téléphone</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Ville</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Statut</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientsFiltres.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Aucun client trouvé.
                </td>
              </tr>
            ) : (
              clientsFiltres.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {client.prenom} {client.nom}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-gray-600">{client.telephone || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{client.ville || '—'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.actif
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {client.actif ? 'Actif' : 'Bloqué'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleBloquer(client.id)}
                      disabled={idEnCours === client.id}
                      className={`text-sm font-medium hover:underline disabled:opacity-50 ${
                        client.actif ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {idEnCours === client.id
                        ? '...'
                        : client.actif
                        ? 'Bloquer'
                        : 'Débloquer'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}