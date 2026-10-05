export interface CardProduct {
  id: string;
  issuer: string;
  name: string;
  network: string;
}

export interface UserCard {
  id: string;
  cardProduct: CardProduct;
  nickname?: string;
}

export interface RecommendationResult {
  cardId: string;
  cardName: string;
  category: string;
  multiplier: number;
  reason: string;
}