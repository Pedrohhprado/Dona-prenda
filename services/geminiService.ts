
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Recipe, Difficulty } from '../types.ts';
import { SYSTEM_PROMPT } from '../constants.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING, description: 'O nome da receita.' },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: 'A lista completa de ingredientes.'
    },
    preparation: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: 'O modo de preparo passo a passo.'
    },
    prepTime: { type: Type.STRING, description: 'O tempo de preparo.' },
    servings: { type: Type.STRING, description: 'O rendimento da receita.' },
    curiosity: { type: Type.STRING, description: 'Uma curiosidade cultural sobre o prato.' },
  },
  required: ['recipeName', 'ingredients', 'preparation', 'prepTime', 'servings', 'curiosity']
};


export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
      temperature: 0.7,
    },
  });
};

export const generateRecipeImage = async (recipeName: string): Promise<string | undefined> => {
    try {
        const prompt = `Uma foto profissional de um prato de ${recipeName} gaúcho, bem apetitoso e bem apresentado em uma mesa rústica de madeira, estilo CTG.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
    } catch (error) {
        console.error("Error generating recipe image:", error);
        return undefined;
    }
    return undefined;
};


export const sendMessageToChat = async (chat: Chat, ingredientsText: string, difficulty: Difficulty, imageBase64?: string): Promise<Recipe> => {
  try {
    const textPrompt = `Ingredientes: ${ingredientsText || 'nenhum texto fornecido'}. Dificuldade desejada: ${difficulty}.`;
    const textPart = { text: textPrompt };

    const parts: any[] = [textPart];

    if (imageBase64) {
      const mimeType = imageBase64.substring(5, imageBase64.indexOf(';'));
      const data = imageBase64.split(',')[1];
      const imagePart = {
        inlineData: {
          mimeType,
          data,
        },
      };
      parts.unshift(imagePart); // Image comes first
    }

    const response = await chat.sendMessage({ message: parts });

    const jsonText = response.text.trim();
    let recipeData: Recipe = JSON.parse(jsonText);
    
    if (recipeData.recipeName === "Não encontrei uma receita") {
        return recipeData;
    }

    const imageUrl = await generateRecipeImage(recipeData.recipeName);
    if (imageUrl) {
        recipeData.imageUrl = imageUrl;
    }

    return recipeData;
  } catch (error) {
    console.error("Error fetching recipe from Gemini API:", error);
    throw new Error('Bah, guri(a)! Deu um problema aqui nas minhas coisas e não consegui pensar numa receita. Tenta de novo em um instante, por favor.');
  }
};