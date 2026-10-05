import { CardProduct, UserCard, RecommendationResult } from '../types';

export const MOCK_CATALOG: CardProduct[] = [
  { id: '1', issuer: 'Chase', name: 'Sapphire Reserve', network: 'Visa' },
  { id: '2', issuer: 'Amex', name: 'Gold Card', network: 'Amex' },
  { id: '3', issuer: 'Citi', name: 'Double Cash', network: 'Mastercard' },
];

export const MOCK_MY_CARDS: UserCard[] = [
  { id: 'uc1', cardProduct: MOCK_CATALOG[0], nickname: 'Travel card' },
  { id: 'uc2', cardProduct: MOCK_CATALOG[1], nickname: 'Dining card' },
];

export const CARD_REWARDS = {
  '1': {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    annualFee: 550,
    categories: {
      Travel: { multiplier: 3, description: '3x on travel' },
      Dining: { multiplier: 1, description: '1x on dining' },
      Groceries: { multiplier: 1, description: '1x on groceries' },
      Gas: { multiplier: 1, description: '1x on gas' },
      General: { multiplier: 1, description: '1x on other purchases' },
    },
  },
  '2': {
    name: 'Amex Gold Card',
    issuer: 'Amex',
    annualFee: 250,
    categories: {
      Travel: { multiplier: 1, description: '1x on travel' },
      Dining: { multiplier: 4, description: '4x on dining & restaurants' },
      Groceries: { multiplier: 4, description: '4x on groceries (up to $25k/year)' },
      Gas: { multiplier: 1, description: '1x on gas' },
      General: { multiplier: 1, description: '1x on other purchases' },
    },
  },
  '3': {
    name: 'Citi Double Cash',
    issuer: 'Citi',
    annualFee: 0,
    categories: {
      Travel: { multiplier: 2, description: '2% cashback on travel' },
      Dining: { multiplier: 2, description: '2% cashback on dining' },
      Groceries: { multiplier: 2, description: '2% cashback on groceries' },
      Gas: { multiplier: 2, description: '2% cashback on gas' },
      General: { multiplier: 2, description: '2% cashback on everything' },
    },
  },
};

export function mockRecommend(merchant: string): RecommendationResult {
  const lower = merchant.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('starbucks')) {
    return { cardId: '2', cardName: 'Amex Gold Card', category: 'Dining', multiplier: 4, reason: '4x points on dining' };
  }
  return { cardId: '3', cardName: 'Citi Double Cash', category: 'Other', multiplier: 2, reason: '2% flat cashback on everything else' };
}