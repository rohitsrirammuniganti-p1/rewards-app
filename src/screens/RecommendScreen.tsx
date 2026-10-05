import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getRecommendation } from '../api/client';
import { RecommendationResult, UserCard } from '../types';
import { fetchMyCards } from '../api/client';

export default function RecommendScreen() {
  const [merchant, setMerchant] = useState('');
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [userCards, setUserCards] = useState<UserCard[]>([]);

  const handleCheck = async () => {
    if (!merchant.trim()) {
      Alert.alert('Enter a merchant', 'Please type where you\'re shopping');
      return;
    }

    setLoading(true);
    try {
      const cards = await fetchMyCards();
      setUserCards(cards);
      const recommendation = await getRecommendation(merchant);
      setResult(recommendation);
    } catch (e) {
      Alert.alert('Error', 'Failed to get recommendation. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMerchant('');
    setResult(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Where are you shopping?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Starbucks, Whole Foods, Delta Airlines..."
          placeholderTextColor="#999"
          value={merchant}
          onChangeText={setMerchant}
          editable={!loading}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: merchant.trim() && !loading ? '#0a5cbf' : '#ccc' }]}
            onPress={handleCheck}
            disabled={loading || !merchant.trim()}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Checking...' : 'Find Best Card'}
            </Text>
          </TouchableOpacity>
          {result && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a5cbf" />
          <Text style={styles.loadingText}>Finding your best card...</Text>
        </View>
      )}

      {/* Result Section */}
      {result && !loading && (
        <View style={styles.resultSection}>
          {/* Best Card */}
          <View style={styles.bestCardContainer}>
            <Text style={styles.bestCardLabel}>BEST CARD FOR YOU</Text>

            <View style={[styles.resultCard, { backgroundColor: getCardColor(result.cardId) }]}>
              <Text style={styles.resultCardName}>{result.cardName}</Text>
              <View style={styles.rewardRow}>
                <Text style={styles.rewardLabel}>Earn:</Text>
                <Text style={styles.rewardMultiplier}>
                  {result.multiplier}x {result.category}
                </Text>
              </View>
            </View>

            <View style={styles.reasonBox}>
              <Text style={styles.reasonLabel}>Why this card?</Text>
              <Text style={styles.reasonText}>{result.reason}</Text>
            </View>
          </View>

          {/* Category Breakdown */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Category: {result.category}</Text>
            <Text style={styles.categoryDesc}>
              {getCategoryDescription(result.category)}
            </Text>
          </View>

          {/* Other Cards Info */}
          {userCards.length > 1 && (
            <View style={styles.otherCardsSection}>
              <Text style={styles.otherCardsTitle}>Other Cards in Your Wallet</Text>
              {userCards
                .filter((uc) => uc.cardProduct.id !== result.cardId)
                .map((card) => (
                  <View key={card.id} style={styles.otherCardRow}>
                    <Text style={styles.otherCardName}>
                      {card.cardProduct.issuer} {card.cardProduct.name}
                    </Text>
                    <Text style={styles.otherCardReward}>
                      Less optimal for this purchase
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
            <Text style={styles.tipText}>
              • Save this card for {result.category.toLowerCase()} purchases
            </Text>
            <Text style={styles.tipText}>
              • Look for rotating categories quarterly
            </Text>
            <Text style={styles.tipText}>
              • Check annual caps and category limits
            </Text>
          </View>
        </View>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>Ready to maximize rewards?</Text>
          <Text style={styles.emptySubtext}>
            Enter a merchant name to find your best card
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function getCardColor(cardId: string): string {
  if (cardId === '1') return '#0a5cbf'; // Chase Blue
  if (cardId === '2') return '#006c42'; // Amex Green
  return '#1a1f71'; // Citi Navy
}

function getCategoryDescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    Travel: 'Airlines, hotels, car rentals, and travel agencies',
    Dining: 'Restaurants, cafes, and food delivery services',
    Groceries: 'Supermarkets and grocery stores',
    Gas: 'Gas stations and fuel purchases',
    General: 'All other purchases',
  };
  return descriptions[category] || descriptions.General;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  inputSection: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: '#1a1a1a' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  buttonRow: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  clearButton: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  clearButtonText: { color: '#666', fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  resultSection: { padding: 20, paddingBottom: 40 },
  bestCardContainer: { marginBottom: 24 },
  bestCardLabel: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 1, marginBottom: 8 },
  resultCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultCardName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rewardLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  rewardMultiplier: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  reasonBox: { backgroundColor: '#f0f7ff', padding: 14, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#0a5cbf' },
  reasonLabel: { fontSize: 12, fontWeight: '700', color: '#0a5cbf', marginBottom: 4 },
  reasonText: { fontSize: 14, color: '#333', lineHeight: 20 },
  categorySection: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  categoryTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  categoryDesc: { fontSize: 13, color: '#666', lineHeight: 18 },
  otherCardsSection: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  otherCardsTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  otherCardRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  otherCardName: { fontSize: 14, fontWeight: '500', color: '#333' },
  otherCardReward: { fontSize: 12, color: '#999', marginTop: 2 },
  tipsSection: { backgroundColor: '#fffbea', padding: 16, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#ffa500' },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  tipText: { fontSize: 12, color: '#555', lineHeight: 16, marginBottom: 6 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center' },
});