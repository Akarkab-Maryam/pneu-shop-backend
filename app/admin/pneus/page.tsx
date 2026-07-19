'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Pneu {
  id: number;
  marque: string;
  modele: string;
  largeur: number;
  hauteur: number;
  diametre: number;
  indiceCharge: string | null;
  saison: 'ETE' | 'HIVER' | 'QUATRE_SAISONS';
  prix: number;
  stock: number;
  description: string | null;
}

type PneuFormData = Omit<Pneu, 'id'>;

const formVide: PneuFormData = {
  marque: '',
  modele: '',
  largeur: 0,
  hauteur: 0,
  diametre: 0,
  indiceCharge: '',
  saison: 'ETE',
  prix: 0,
  stock: 0,
  description: '',
};

export default function PneusPage() {
  const [pneus, setPneus] = useState<Pneu[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [pneuEnCoursId, setPneuEnCoursId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PneuFormData>(formVide);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurForm, setErreurForm] = useState('');

  useEffect(() => {
    chargerPneus();
  }, []);

  const chargerPneus = async () => {
    setChargement(true);
    setErreur('');
    try {
      const response = await api.get('/api/pneus');
      setPneus(response.data);
    } catch (err) {
      setErreur("Impossible de charger les pneus.");
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const handleSupprimer = async (id: number) => {
    if (!confirm('Confirmer la suppression de ce pneu ?')) return;
    try {
      await api.delete(`/api/pneus/${id}`);
      setPneus(pneus.filter((p) => p.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
      console.error(err);
    }
  };

  const ouvrirAjout = () => {
    setModeEdition(false);
    setPneuEnCoursId(null);
    setFormData(formVide);
    setErreurForm('');
    setModalOuvert(true);
  };

  const ouvrirEdition = (pneu: Pneu) => {
    setModeEdition(true);
    setPneuEnCoursId(pneu.id);
    setFormData({
      marque: pneu.marque,
      modele: pneu.modele,
      largeur: pneu.largeur,
      hauteur: pneu.hauteur,
      diametre: pneu.diametre,
      indiceCharge: pneu.indiceCharge || '',
      saison: pneu.saison,
      prix: pneu.prix,
      stock: pneu.stock,
      description: pneu.description || '',
    });
    setErreurForm('');
    setModalOuvert(true);
  };

  const fermerModal = () => {
    setModalOuvert(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const champsNumeriques = ['largeur', 'hauteur', 'diametre', 'prix', 'stock'];
    setFormData((prev) => ({
      ...prev,
      [name]: champsNumeriques.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreurForm('');

    if (!formData.marque || !formData.modele || !formData.prix) {
      setErreurForm('Marque, modèle et prix sont obligatoires.');
      return;
    }

    setEnvoiEnCours(true);
    try {
      if (modeEdition && pneuEnCoursId) {
        const response = await api.put(`/api/pneus/${pneuEnCoursId}`, formData);
        setPneus(pneus.map((p) => (p.id === pneuEnCoursId ? response.data : p)));
      } else {
        const response = await api.post('/api/pneus', formData);
        setPneus([...pneus, response.data]);
      }
      setModalOuvert(false);
    } catch (err) {
      setErreurForm("Erreur lors de l'enregistrement. Vérifie les champs.");
      console.error(err);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  if (chargement) {
    return <p className="text-gray-500">Chargement des pneus...</p>;
  }

  if (erreur) {
    return <p className="text-red-600">{erreur}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des pneus</h1>
        <button
          onClick={ouvrirAjout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Ajouter un pneu
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Marque</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Modèle</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Dimensions</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Saison</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Prix</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Stock</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pneus.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  Aucun pneu enregistré.
                </td>
              </tr>
            ) : (
              pneus.map((pneu) => (
                <tr key={pneu.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{pneu.marque}</td>
                  <td className="px-6 py-4 text-gray-600">{pneu.modele}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {pneu.largeur}/{pneu.hauteur} R{pneu.diametre}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{pneu.saison}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{pneu.prix} DH</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pneu.stock > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {pneu.stock} en stock
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => ouvrirEdition(pneu)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleSupprimer(pneu.id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout / Modification */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {modeEdition ? 'Modifier le pneu' : 'Ajouter un pneu'}
            </h2>

            {erreurForm && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
                {erreurForm}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Marque *</label>
                  <input
                    type="text"
                    name="marque"
                    value={formData.marque}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Modèle *</label>
                  <input
                    type="text"
                    name="modele"
                    value={formData.modele}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Largeur</label>
                  <input
                    type="number"
                    name="largeur"
                    value={formData.largeur}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hauteur</label>
                  <input
                    type="number"
                    name="hauteur"
                    value={formData.hauteur}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Diamètre</label>
                  <input
                    type="number"
                    name="diametre"
                    value={formData.diametre}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Indice de charge</label>
                  <input
                    type="text"
                    name="indiceCharge"
                    value={formData.indiceCharge || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Saison</label>
                  <select
                    name="saison"
                    value={formData.saison}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  >
                    <option value="ETE">Été</option>
                    <option value="HIVER">Hiver</option>
                    <option value="QUATRE_SAISONS">4 saisons</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Prix (DH) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="prix"
                    value={formData.prix}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={fermerModal}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={envoiEnCours}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {envoiEnCours ? 'Enregistrement...' : modeEdition ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}