export interface Recipe {
  recipeName: string;
  ingredients: string[];
  preparation: string[];
  prepTime: string;
  servings: string;
  curiosity: string;
  imageUrl?: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  recipe?: Recipe;
  image?: string;
}

export enum ActiveTab {
  Chat = 'chat',
  Favorites = 'favorites',
  History = 'history',
}

export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';