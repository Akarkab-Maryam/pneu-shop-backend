'use client';

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez le pneu <span className="text-red-500">qu'il vous faut</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Parmi des milliers de pneus dans notre catalogue
          </p>

          {/* Recherche par dimensions */}
          <div className="bg-white rounded-xl p-6 max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
            <select className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-red-500">
              <option value="">Largeur</option>
              <option value="155">155</option>
              <option value="165">165</option>
              <option value="175">175</option>
              <option value="185">185</option>
              <option value="195">195</option>
              <option value="205">205</option>
              <option value="215">215</option>
              <option value="225">225</option>
              <option value="235">235</option>
              <option value="245">245</option>
              <option value="255">255</option>
              <option value="265">265</option>
            </select>
            <select className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-red-500">
              <option value="">Hauteur</option>
              <option value="35">35</option>
              <option value="40">40</option>
              <option value="45">45</option>
              <option value="50">50</option>
              <option value="55">55</option>
              <option value="60">60</option>
              <option value="65">65</option>
              <option value="70">70</option>
            </select>
            <select className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-red-500">
              <option value="">Diamètre</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
            </select>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition">
              🔍 Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Nos Catégories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-600 text-white rounded-xl p-6 text-center cursor-pointer hover:bg-red-700 transition">
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="font-bold text-xl">Pneus Tourisme</h3>
            <p className="text-red-100 text-sm mt-1">Pour voitures particulières</p>
          </div>
          <div className="bg-gray-800 text-white rounded-xl p-6 text-center cursor-pointer hover:bg-gray-900 transition">
            <div className="text-4xl mb-3">🚙</div>
            <h3 className="font-bold text-xl">Pneus 4x4 / SUV</h3>
            <p className="text-gray-400 text-sm mt-1">Pour véhicules tout-terrain</p>
          </div>
          <div className="bg-gray-800 text-white rounded-xl p-6 text-center cursor-pointer hover:bg-gray-900 transition">
            <div className="text-4xl mb-3">🚛</div>
            <h3 className="font-bold text-xl">Pneus Camionnette</h3>
            <p className="text-gray-400 text-sm mt-1">Pour utilitaires et camionnettes</p>
          </div>
        </div>
      </section>

      {/* Produits phares */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            • PRODUITS PHARES •
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition group">
                {/* Image placeholder */}
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4 relative overflow-hidden">
                  <img
  src={`/${item}.jpeg`}
  alt={`Pneu ${item}`}
  className="w-full h-full object-contain p-4"
/>
                  {/* Bouton ajouter au panier */}
                  <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center py-2 font-bold opacity-0 group-hover:opacity-100 transition">
                    🛒 AJOUTER AU PANIER
                  </div>
                </div>
                {/* Infos produit */}
                <h3 className="font-bold text-gray-800 text-sm text-center">
                  PNEU CONTINENTAL CONTIPREMIUMCONTACT
                </h3>
                <p className="text-gray-500 text-xs text-center mt-1">205/55R16 91H</p>
                {/* Étoiles */}
                <div className="flex justify-center gap-1 mt-2">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-yellow-400">☆</span>
                  ))}
                  <span className="text-gray-400 text-xs ml-1">0 AVIS</span>
                </div>
                {/* Prix */}
                <p className="text-center font-bold text-gray-800 text-lg mt-2">
                  1 200,00 Dhs
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}