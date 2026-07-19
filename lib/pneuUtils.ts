export interface PneuBackend {
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
  dateAjout: string;
}

export interface PneuAffichage {
  id: number;
  nom: string;
  dimensions: string;
  prix: number;
  stock: number;
  saison: string;
  image: string;
}

const IMAGE_PLACEHOLDER = '/1.jpeg';

export function formaterPneu(pneu: PneuBackend): PneuAffichage {
  return {
    id: pneu.id,
    nom: `${pneu.marque} ${pneu.modele}`,
    dimensions: `${pneu.largeur}/${pneu.hauteur}R${pneu.diametre}`,
    prix: pneu.prix,
    stock: pneu.stock,
    saison: pneu.saison,
    image: IMAGE_PLACEHOLDER,
  };
}

export function libelleSaison(saison: string): string {
  switch (saison) {
    case 'ETE': return 'Été';
    case 'HIVER': return 'Hiver';
    case 'QUATRE_SAISONS': return '4 saisons';
    default: return saison;
  }
}