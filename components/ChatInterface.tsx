
import React, { useState, useRef, useEffect } from 'react';
import { Message, Recipe, Difficulty } from '../types';
import RecipeCard from './RecipeCard';
import { EnviarIcon, CameraIcon, XIcon, SugerirIcon } from './Icons';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (text: string, imageBase64?: string) => void;
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  difficulty: Difficulty;
  onSetDifficulty: (difficulty: Difficulty) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  favorites,
  onToggleFavorite,
  difficulty,
  onSetDifficulty
}) => {
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState<{b64: string, name: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const difficulties: Difficulty[] = ['Fácil', 'Médio', 'Difícil'];
  const difficultyLabels: Record<Difficulty, string> = {
    'Fácil': 'Novo(a) na lida',
    'Médio': 'Já me ajeito',
    'Difícil': 'Mestre-cuca',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() && !image) return;
    onSendMessage(inputText, image?.b64);
    setInputText('');
    setImage(null);
  };

  const handleSuggest = () => {
    onSendMessage('', undefined);
    setInputText('');
    setImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ b64: reader.result as string, name: file.name });
      };
      reader.readAsDataURL(file);
    }
     // Reset file input value to allow selecting the same file again
    if(event.target) {
      event.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="w-10 h-10 rounded-full bg-[#6D4C41] flex items-center justify-center text-white font-bold text-xl font-lora flex-shrink-0">
                P
              </div>
            )}
            <div className={`max-w-md lg:max-w-2xl rounded-2xl p-3 sm:p-4 shadow-md ${msg.sender === 'user' ? 'bg-[#D4A574] text-black rounded-br-none' : 'bg-white text-[#6D4C41] rounded-bl-none'}`}>
              {msg.image && (
                <img src={msg.image} alt="Ingredientes do usuário" className="rounded-lg mb-2 max-w-xs max-h-48 object-cover shadow-sm"/>
              )}
              {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
              {msg.recipe && (
                <RecipeCard 
                  recipe={msg.recipe} 
                  isFavorited={favorites.some(fav => fav.recipeName === msg.recipe?.recipeName)}
                  onToggleFavorite={() => onToggleFavorite(msg.recipe!)}
                />
              )}
            </div>
             {msg.sender === 'user' && (
              <div className="w-10 h-10 rounded-full bg-[#C7522A] flex items-center justify-center text-white font-bold text-xl font-lora flex-shrink-0">
                Tu
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-10 h-10 rounded-full bg-[#6D4C41] flex items-center justify-center text-white font-bold text-xl font-lora flex-shrink-0">P</div>
            <div className="max-w-sm rounded-2xl p-4 bg-white text-[#6D4C41] rounded-bl-none shadow-md">
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="italic">Dona Prenda está pensando...</span>
                <div className="w-2 h-2 bg-[#8A7968] rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#8A7968] rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#8A7968] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 md:p-4 bg-transparent">
        <div className="max-w-4xl mx-auto">
          {image && (
            <div className="mb-3 p-2 bg-white/80 rounded-lg flex items-center justify-between shadow-inner max-w-xs sm:max-w-md mx-auto">
              <img src={image.b64} alt="Preview" className="w-10 h-10 object-cover rounded-md mr-2"/>
              <span className="text-sm text-gray-700 truncate flex-1">{image.name}</span>
              <button onClick={() => setImage(null)} className="p-1 rounded-full hover:bg-gray-200">
                <XIcon className="w-4 h-4 text-gray-600"/>
              </button>
            </div>
          )}

          <div className="mb-4 text-center">
            <span className="text-sm font-semibold text-[#6D4C41] mr-3 hidden sm:inline-block">Qual a tua experiência na cozinha?</span>
            <div className="inline-flex flex-wrap justify-center gap-2" role="group">
              {difficulties.map(d => (
                  <button
                  key={d}
                  type="button"
                  onClick={() => onSetDifficulty(d)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border transition-colors duration-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4A574] ${
                      difficulty === d
                      ? 'bg-[#6D4C41] text-white border-[#6D4C41]'
                      : 'bg-white text-[#6D4C41] border-gray-300 hover:bg-gray-50'
                  }`}
                  >
                  {difficultyLabels[d]}
                  </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-lg border border-gray-200/80">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="text-[#8A7968] hover:text-[#6D4C41] p-3 rounded-full transition-colors"
              aria-label="Anexar imagem"
            >
              <CameraIcon className="w-5 h-5"/>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite os ingredientes..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-2 text-[#6D4C41] placeholder-[#8A7968]"
            />
             <button
                onClick={handleSuggest}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-[#6D4C41] bg-transparent border border-transparent rounded-full px-2 sm:px-4 py-2 hover:bg-[#D4A574]/20 transition-colors duration-200 disabled:opacity-50"
                aria-label="Sugerir receita"
            >
                <SugerirIcon className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold text-sm">Sugerir</span>
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !image)}
              className="bg-[#C7522A] text-white rounded-full p-3 hover:bg-[#a14121] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Enviar mensagem"
            >
              <EnviarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
