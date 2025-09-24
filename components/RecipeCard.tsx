import React, { useState } from 'react';
import { Recipe } from '../types';
import { CoracaoIcon, CompartilharIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorited, onToggleFavorite }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    const recipeText = `
Confere essa receita gaúcha tri-especial que a Dona Prenda me passou:

*${recipe.recipeName}*

*Ingredientes:*
${recipe.ingredients.map(i => `- ${i}`).join('\n')}

*Modo de Preparo:*
${recipe.preparation.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Enviado pelo App Dona Prenda!
    `.trim();

    navigator.clipboard.writeText(recipeText).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Falha ao copiar receita: ', err);
    });
  };


  return (
    <div className="mt-4 border-t-2 border-dashed border-[#D4A574] pt-4 text-[#2E4A3A]">
      {recipe.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden shadow-lg border-2 border-white">
          <img src={recipe.imageUrl} alt={`Foto de ${recipe.recipeName}`} className="w-full h-auto object-cover"/>
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-bold font-lora text-[#6D4C41] pr-4">{recipe.recipeName}</h3>
        <div className="flex items-center flex-shrink-0">
          <button onClick={handleShare} className="flex items-center gap-2 p-2 rounded-full hover:bg-[#D4A574]/30 transition-colors text-[#8A7968] text-sm" aria-label="Compartilhar receita">
            <CompartilharIcon className="w-6 h-6" />
            <span className="hidden sm:inline">{isCopied ? 'Copiado!' : 'Compartilhar'}</span>
          </button>
          <button onClick={onToggleFavorite} className="p-2 rounded-full hover:bg-[#D4A574]/30 transition-colors" aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
            <CoracaoIcon className={`w-6 h-6 ${isFavorited ? 'text-red-500 fill-current' : 'text-[#8A7968]'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <p><strong><span role="img" aria-label="clock">🕰️</span> Tempo de Preparo:</strong> {recipe.prepTime}</p>
        <p><strong><span role="img" aria-label="plate">🍽️</span> Rendimento:</strong> {recipe.servings}</p>
      </div>

      <h4 className="font-bold text-lg font-lora text-[#6D4C41] mb-2">Ingredientes</h4>
      <ul className="list-disc list-inside space-y-1 mb-4 pl-2">
        {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
      </ul>

      <h4 className="font-bold text-lg font-lora text-[#6D4C41] mb-2">Modo de Preparo</h4>
      <ol className="list-decimal list-inside space-y-2 mb-4 pl-2">
        {recipe.preparation.map((step, index) => <li key={index}>{step}</li>)}
      </ol>

      <div className="bg-[#D4A574]/20 p-3 rounded-lg border-l-4 border-[#D4A574]">
        <h4 className="font-bold font-lora text-[#6D4C41] mb-1">Curiosidade da Prenda</h4>
        <p className="text-sm italic">"{recipe.curiosity}"</p>
      </div>
    </div>
  );
};

export default RecipeCard;