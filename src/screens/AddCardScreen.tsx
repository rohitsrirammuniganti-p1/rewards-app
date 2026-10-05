import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { MOCK_CATALOG } from '../api/mockData';
import { addCardToWallet } from '../api/client';
import { CardProduct } from '../types';

export default function AddCardScreen({ navigation }: any) {
  const [selectedCard, setSelectedCard] = useState<CardProduct | null>(null);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!selectedCard) {
      Alert.alert('Select a card', 'Please pick a card to add');
      return;
    }

    setLoading(true);
    try {
      await addCardToWallet(selectedCard, nickname || undefined);
      Alert.alert('Success', `${selectedCard.name} added to your wallet!`);
      setSelectedCard(null);
      setNickname('');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to add card. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Cards</Text>
      
      <FlatList
        data={MOCK_CATALOG}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.cardOption,
              selectedCard?.id === item.id && styles.cardOptionSelected,
            ]}
            onPress={() => setSelectedCard(item)}
          >
            <Text style={styles.cardName}>{item.issuer} {item.name}</Text>
            <Text style={styles.network}>{item.network}</Text>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />

      {selectedCard && (
        <View style={styles.nicknameSection}>
          <Text style={styles.label}>Card Nickname (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Travel card, Dining card..."
            value={nickname}
            onChangeText={setNickname}
          />
        </View>
      )}

      <View style={styles.bottomButton}>
        <Button 
          title={loading ? "Adding..." : "Add Card"}
          onPress={handleAdd}
          disabled={!selectedCard || loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  cardOption: { 
    padding: 16, 
    borderWidth: 2, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  cardOptionSelected: { 
    borderColor: '#0a5cbf', 
    backgroundColor: '#f0f7ff' 
  },
  cardName: { fontSize: 16, fontWeight: '600' },
  network: { fontSize: 12, color: '#666', marginTop: 4 },
  nicknameSection: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12,
    fontSize: 14,
  },
  bottomButton: { marginTop: 20 },
});