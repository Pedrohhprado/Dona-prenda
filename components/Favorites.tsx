
import React from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface FavoritesProps {
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, onToggleFavorite }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold font-lora text-[#6D4C41] mb-6 pb-2 border-b-2 border-[#D4A574]">Receitas Favoritas</h2>
      {favorites.length > 0 ? (
        <div className="space-y-6">
          {favorites.map((recipe, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-[#D4A574]/50">
                <RecipeCard 
                    recipe={recipe} 
                    isFavorited={true}
                    onToggleFavorite={() => onToggleFavorite(recipe)}
                />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4">
          <p className="text-[#8A7968] text-lg">Tu ainda não salvaste nenhuma receita, vivente!</p>
          <p className="text-[#8A7968]">Quando gostares de uma sugestão, clica no coração para guardar ela aqui.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
