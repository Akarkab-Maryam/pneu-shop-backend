'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Commande {
  id: number;
  client: {
    nom: string;
    prenom: string;
    email: string;
  };
  dateCommande: string;
  statut: string;
  montantTotal: number;
  statutPaiement: string;
}

const STATUTS = ['EN_ATTENTE', 'CONFIRMEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];

export default function AdminCommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const chargerCommandes = async () => {
    try {
      const response = await api.get('/api/commandes');
      setCommandes(response.data);
    } catch (error) {
      setErreur('Erreur lors du chargement des commandes');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCommandes();
  }, []);

  const changerStatut = async (id: number, nouveauStatut: string) => {
    try {
      await api.put(`/api/commandes/${id}/statut?statut=${nouveauStatut}`);
      chargerCommandes();
    } catch (error) {
      alert('Erreur lors du changement de statut');
    }
  };
  
const telechargerHistorique = async () => {
    try {
      const response = await api.get('/api/commandes/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const lien = document.createElement('a');
      lien.href = url;
      lien.setAttribute('download', `historique_commandes_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Erreur lors du téléchargement de l'historique");
    }
  };



  const getBadgeColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMEE': return 'bg-blue-100 text-blue-800';
      case 'EXPEDIEE': return 'bg-purple-100 text-purple-800';
      case 'LIVREE': return 'bg-green-100 text-green-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (chargement) {
    return <div className="p-8 text-gray-500">Chargement des commandes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Commandes</h1>
        <button
          onClick={telechargerHistorique}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          📥 Télécharger l'historique
        </button>
      </div>

      {erreur && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
          {erreur}
        </div>
      )}

      {commandes.length === 0 ? (
        <p className="text-gray-500">Aucune commande pour le moment.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Montant</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paiement</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((commande) => (
                <tr key={commande.id} className="border-t">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">
                      {commande.client?.prenom} {commande.client?.nom}
                    </div>
                    <div className="text-sm text-gray-500">{commande.client?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(commande.dateCommande).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {commande.montantTotal} DH
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(commande.statutPaiement)}`}>
                      {commande.statutPaiement}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={commande.statut}
                      onChange={(e) => changerStatut(commande.id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium border-none ${getBadgeColor(commande.statut)}`}
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}