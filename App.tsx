
import React, { useState, useEffect, useCallback } from 'react';
import { Message, Recipe, ActiveTab, Difficulty } from './types';
import type { Chat } from '@google/genai';
import { sendMessageToChat, createChatSession } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import Favorites from './components/Favorites';
import History from './components/History';
import Sidebar from './components/Sidebar';
import { ChimarraoIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Chat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<Message[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Fácil');
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const initChat = useCallback(() => {
    setChatSession(createChatSession());
  }, []);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('gaucho_favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      const storedHistory = localStorage.getItem('gaucho_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
    
    initChat();

    setMessages([
        {
            id: Date.now(),
            sender: 'bot',
            text: 'Bah, tchê! Sou a Dona Prenda, tua parceira na cozinha gaúcha. Me diz ou me mostra os ingredientes que tu tens aí, que eu te ajudo a preparar um prato tri especial!',
        }
    ]);
  }, [initChat]);

  useEffect(() => {
    localStorage.setItem('gaucho_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gaucho_history', JSON.stringify(history));
  }, [history]);

  const handleSendMessage = useCallback(async (inputText: string, imageBase64?: string) => {
    if (!chatSession) return;

    let userMessageText = inputText;
    let effectiveInputText = inputText;

    // Se nenhum ingrediente for fornecido, cria uma mensagem sintética para a UI
    // e envia uma instrução clara para o backend.
    if (!inputText.trim() && !imageBase64) {
      userMessageText = `Me sugira uma receita ${difficulty}, por favor!`;
      effectiveInputText = ''; // Enviar string vazia para o geminiService
    }

    const userMessage: Message = { id: Date.now(), text: userMessageText, sender: 'user', image: imageBase64 };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);
    setError(null);

    try {
      const recipe = await sendMessageToChat(chatSession, effectiveInputText, difficulty, imageBase64);
      let botMessage: Message;

      if (recipe.recipeName === "Não encontrei uma receita") {
        botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: recipe.curiosity, // A mensagem amigável está na curiosidade
        };
      } else {
        botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Barbaridade! Olhando o que tu tens aí, tu podes fazer um(a) ${recipe.recipeName} de lamber os beiços!`,
          recipe: recipe,
        };
      }
      
      const finalMessages = [...currentMessages, botMessage];
      setMessages(finalMessages);
      setHistory(prev => [...prev, finalMessages]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bah, guri(a)! Deu um problema aqui nas minhas coisas. Tenta de novo em um instante, por favor.';
      setMessages(prev => [...prev, { id: Date.now() + 1, text: errorMessage, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, difficulty, chatSession]);

  const handleToggleFavorite = useCallback((recipe: Recipe) => {
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.recipeName === recipe.recipeName);
      if (isFavorited) {
        return prev.filter(fav => fav.recipeName !== recipe.recipeName);
      } else {
        return [...prev, recipe];
      }
    });
  }, []);
  
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('gaucho_history');
  }, []);

  const handleNewChat = useCallback(() => {
    initChat();
    setMessages([
        {
            id: Date.now(),
            sender: 'bot',
            text: 'Bah, tchê! Sou a Dona Prenda, tua parceira na cozinha gaúcha. Me diz ou me mostra os ingredientes que tu tens aí, que eu te ajudo a preparar um prato tri especial!',
        }
    ]);
    setActiveTab(ActiveTab.Chat);
  }, [initChat]);

  const renderContent = () => {
    switch (activeTab) {
      case ActiveTab.Chat:
        return (
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={handleSendMessage}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            difficulty={difficulty}
            onSetDifficulty={setDifficulty}
          />
        );
      case ActiveTab.Favorites:
        return <Favorites favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case ActiveTab.History:
        return <History history={history} onClearHistory={handleClearHistory} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#6D4C41] bg-cover bg-center text-[#2E4A3A]" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')"}}>
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewChat={handleNewChat}
      />
      <main className="flex-1 flex flex-col bg-[#F5F1EB] overflow-hidden shadow-2xl pb-16 md:pb-0">
         {/* Mobile Header */}
         <div className="md:hidden flex items-center p-3 sm:p-4 bg-[#F5F1EB] border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <ChimarraoIcon className="w-8 h-8 text-[#6D4C41] mr-3"/>
            <h1 className="text-xl font-bold text-[#6D4C41] font-lora">Dona Prenda</h1>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
