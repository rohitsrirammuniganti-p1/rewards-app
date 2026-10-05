import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_CATALOG, MOCK_MY_CARDS, CARD_REWARDS } from './mockData';
import { RecommendationResult, UserCard, CardProduct } from '../types';

export const USE_MOCK = true; // Set to true to use mock recommendations
export const USE_CLAUDE = false; // Set to true to use Claude API

const BASE_URL = 'http://localhost:8080/api'; // For future backend
const CLAUDE_API_KEY = 'sk-ant-YOUR_API_KEY_HERE'; // TODO: Add your Anthropic API key

export const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function fetchMyCards(): Promise<UserCard[]> {
  if (USE_MOCK) {
    try {
      const stored = await AsyncStorage.getItem('userCards');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load cards from storage:', e);
    }
    return Promise.resolve(MOCK_MY_CARDS);
  }
  const res = await apiClient.get('/users/me/cards');
  return res.data;
}

export async function addCardToWallet(cardProduct: CardProduct, nickname?: string): Promise<UserCard> {
  const userCard: UserCard = {
    id: Math.random().toString(36).substr(2, 9),
    cardProduct,
    nickname,
  };

  if (USE_MOCK) {
    try {
      const stored = await AsyncStorage.getItem('userCards');
      const cards: UserCard[] = stored ? JSON.parse(stored) : MOCK_MY_CARDS;
      const updated = [...cards, userCard];
      await AsyncStorage.setItem('userCards', JSON.stringify(updated));
      return userCard;
    } catch (e) {
      throw e;
    }
  }

  const res = await apiClient.post('/users/me/cards', { cardProduct, nickname });
  return res.data;
}

export async function getRecommendation(merchantName: string): Promise<RecommendationResult> {
  // Get user's cards
  const userCards = await fetchMyCards();

  if (USE_CLAUDE) {
    return getRecommendationFromClaude(userCards, merchantName);
  }

  if (USE_MOCK) {
    return mockRecommendation(userCards, merchantName);
  }

  const res = await apiClient.post('/recommend', { merchantName });
  return res.data;
}

async function getRecommendationFromClaude(
  userCards: UserCard[],
  merchantName: string
): Promise<RecommendationResult> {
  try {
    const prompt = buildRecommendationPrompt(userCards, merchantName);

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    const content = response.data.content[0].text;
    
    // Parse Claude's response
    try {
      const result = JSON.parse(content);
      return {
        cardId: result.cardId,
        cardName: result.cardName,
        category: result.category,
        multiplier: result.multiplier,
        reason: result.reason,
      };
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content);
      // Fallback to mock if parsing fails
      return mockRecommendation(userCards, merchantName);
    }
  } catch (error) {
    console.error('Claude API error:', error);
    // Fallback to mock
    return mockRecommendation(userCards, merchantName);
  }
}

function buildRecommendationPrompt(userCards: UserCard[], merchantName: string): string {
  const cardsList = userCards
    .map((uc) => {
      const rewards = CARD_REWARDS[uc.cardProduct.id as keyof typeof CARD_REWARDS];
      return `- ${uc.cardProduct.issuer} ${uc.cardProduct.name}${uc.nickname ? ` (${uc.nickname})` : ''}
  Rewards: ${Object.entries(rewards.categories)
    .map(([cat, info]) => `${cat}: ${info.description}`)
    .join(', ')}`;
    })
    .join('\n');

  return `You are a credit card rewards advisor. A user is about to make a purchase and wants to know which card to use for maximum rewards.

User's Cards:
${cardsList}

Merchant: ${merchantName}

Please recommend the single best card to use. Respond ONLY with valid JSON in this exact format:
{
  "cardId": "1",
  "cardName": "Chase Sapphire Reserve",
  "category": "Travel",
  "multiplier": 3,
  "reason": "Chase Sapphire Reserve offers 3x points on travel, which is the highest reward for this merchant."
}

Think step by step:
1. What category is this merchant? (Travel, Dining, Groceries, Gas, or General)
2. Which card offers the highest reward multiplier for that category?
3. Return only the card details in the JSON format above.`;
}

function mockRecommendation(userCards: UserCard[], merchantName: string): RecommendationResult {
  const lower = merchantName.toLowerCase();

  let category = 'General';
  if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('starbucks') || lower.includes('dining')) {
    category = 'Dining';
  } else if (lower.includes('whole foods') || lower.includes('grocery') || lower.includes('safeway') || lower.includes('kroger')) {
    category = 'Groceries';
  } else if (lower.includes('shell') || lower.includes('chevron') || lower.includes('gas') || lower.includes('exxon')) {
    category = 'Gas';
  } else if (
    lower.includes('delta') ||
    lower.includes('united') ||
    lower.includes('hilton') ||
    lower.includes('hotel') ||
    lower.includes('airline') ||
    lower.includes('travel')
  ) {
    category = 'Travel';
  }

  // Score each card
  let bestCard = userCards[0];
  let bestMultiplier = 0;

  for (const userCard of userCards) {
    const rewards = CARD_REWARDS[userCard.cardProduct.id as keyof typeof CARD_REWARDS];
    const multiplier = rewards.categories[category as keyof typeof rewards.categories]?.multiplier || 0;
    if (multiplier > bestMultiplier) {
      bestMultiplier = multiplier;
      bestCard = userCard;
    }
  }

  const rewards = CARD_REWARDS[bestCard.cardProduct.id as keyof typeof CARD_REWARDS];
  const categoryRewards = rewards.categories[category as keyof typeof rewards.categories];

  return {
    cardId: bestCard.cardProduct.id,
    cardName: bestCard.cardProduct.name,
    category,
    multiplier: categoryRewards?.multiplier || 1,
    reason: `${bestCard.cardProduct.name} offers the best rewards for ${category.toLowerCase()} purchases at ${merchantName}.`,
  };
}

export async function login(email: string, password: string): Promise<string> {
  if (USE_MOCK) {
    await AsyncStorage.setItem('authToken', 'mock-token');
    return 'mock-token';
  }
  const res = await apiClient.post('/auth/login', { email, password });
  await AsyncStorage.setItem('authToken', res.data.token);
  return res.data.token;
}