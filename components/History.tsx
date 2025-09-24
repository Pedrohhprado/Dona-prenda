
import React from 'react';
import { Message } from '../types.ts';
import { TrashIcon } from './Icons.tsx';

interface HistoryProps {
  history: Message[][];
  onClearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onClearHistory }) => {
  
  const handleClear = () => {
    if (window.confirm('Tu tens certeza que quer apagar todo o histórico de conversas, tchê? Essa ação não pode ser desfeita.')) {
      onClearHistory();
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-[#D4A574]">
        <h2 className="text-2xl md:text-3xl font-bold font-lora text-[#6D4C41]">Histórico de Conversas</h2>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-sm text-[#8A7968] hover:text-red-600 transition-colors py-1 px-2 sm:px-3 rounded-md border border-transparent hover:border-red-300 hover:bg-red-50"
            aria-label="Limpar histórico"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Limpar Histórico</span>
          </button>
        )}
      </div>
      
      {history.length > 0 ? (
        <div className="space-y-6">
          {history.slice().reverse().map((conversation, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-[#D4A574]/50">
              <h3 className="text-sm font-bold text-[#8A7968] mb-2 border-b border-dashed pb-2">
                Conversa de {new Date(conversation[0].id).toLocaleString('pt-BR')}
              </h3>
              <div className="space-y-2">
                {conversation.map(msg => {
                    const recipeName = msg.recipe ? `: ${msg.recipe.recipeName}` : '';
                    const userContentDescription = msg.image ? ' (com imagem)' : '';
                    return (
                        <div key={msg.id} className={`text-sm ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`px-3 py-1 rounded-full ${msg.sender === 'user' ? 'bg-[#D4A574]/50 text-black' : 'bg-[#6D4C41]/10 text-[#2E4A3A]'}`}>
                                <strong>{msg.sender === 'user' ? `Tu${userContentDescription}` : 'Dona Prenda'}{recipeName}:</strong> {msg.text}
                            </span>
                        </div>
                    );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4">
          <p className="text-[#8A7968] text-lg">Nenhuma conversa por aqui ainda, tchê.</p>
          <p className="text-[#8A7968]">Vai lá no chat e pede uma receita pra Dona Prenda!</p>
        </div>
      )}
    </div>
  );
};

export default History;