import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMyCards } from '../api/client';
import { UserCard } from '../types';
import { useAuth } from '../context/AuthContext';

export default function WalletScreen({ navigation }: any) {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const [editingCard, setEditingCard] = useState<UserCard | null>(null);
  const [newNickname, setNewNickname] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchMyCards().then(setCards).finally(() => setLoading(false));
    }, [])
  );

  const handleLongPress = (card: UserCard) => {
    Alert.alert('Card Options', `${card.cardProduct.name}`, [
      {
        text: 'Edit Nickname',
        onPress: () => openEditModal(card),
      },
      {
        text: 'Delete Card',
        onPress: () => handleDeleteCard(card),
        style: 'destructive',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const openEditModal = (card: UserCard) => {
    setEditingCard(card);
    setNewNickname(card.nickname || '');
    setModalVisible(true);
  };

  const handleSaveNickname = async () => {
    if (!editingCard) return;

    try {
      const stored = await AsyncStorage.getItem('userCards');
      const allCards: UserCard[] = stored ? JSON.parse(stored) : [];
      const updated = allCards.map((c) =>
        c.id === editingCard.id ? { ...c, nickname: newNickname || undefined } : c
      );
      await AsyncStorage.setItem('userCards', JSON.stringify(updated));
      setCards(updated);
      setModalVisible(false);
      setEditingCard(null);
      setNewNickname('');
    } catch (e) {
      Alert.alert('Error', 'Failed to update nickname');
    }
  };

  const handleDeleteCard = (card: UserCard) => {
    Alert.alert('Delete Card', `Are you sure you want to remove ${card.cardProduct.name}?`, [
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem('userCards');
            const allCards: UserCard[] = stored ? JSON.parse(stored) : [];
            const filtered = allCards.filter((c) => c.id !== card.id);
            await AsyncStorage.setItem('userCards', JSON.stringify(filtered));
            setCards(filtered);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete card');
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wallet</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddCard')}>
        <Text style={styles.addButtonText}>+ Add Card</Text>
      </TouchableOpacity>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          let bgColor = '#0a5cbf';
          if (item.cardProduct.issuer === 'Amex') {
            bgColor = '#006c42';
          } else if (item.cardProduct.issuer === 'Citi') {
            bgColor = '#1a1f71';
          }

          return (
            <TouchableOpacity
              style={styles.cardContainer}
              onLongPress={() => handleLongPress(item)}
              delayLongPress={500}
            >
              <View style={[styles.card, { backgroundColor: bgColor }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIssuer}>{item.cardProduct.issuer}</Text>
                  <Text style={styles.cardNetwork}>{item.cardProduct.network}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{item.cardProduct.name}</Text>
                </View>

                <View style={styles.cardFooter}>
                  {item.nickname ? (
                    <Text style={styles.cardNickname}>"{item.nickname}"</Text>
                  ) : (
                    <Text style={styles.cardNicknameEmpty}>Long press to edit</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cards added yet.</Text>
            <Text style={styles.emptySubtext}>Tap "+ Add Card" to get started</Text>
          </View>
        }
        contentContainerStyle={cards.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
      />

      <View style={styles.logoutButton}>
        <Button title="Log Out" onPress={logout} color="#d32f2f" />
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Card Nickname</Text>
            <Text style={styles.modalSubtitle}>{editingCard?.cardProduct.name}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Travel card, Dining card..."
              value={newNickname}
              onChangeText={setNewNickname}
              autoFocus
            />

            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#666" />
              <Button title="Save" onPress={handleSaveNickname} color="#0a5cbf" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#1a1a1a' },
  addButton: {
    backgroundColor: '#0a5cbf',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cardContainer: { marginBottom: 16 },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cardIssuer: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  cardNetwork: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  cardBody: { marginBottom: 20 },
  cardName: { fontSize: 20, fontWeight: '600', color: '#fff' },
  cardFooter: {},
  cardNickname: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
  },
  cardNicknameEmpty: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#999', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#bbb' },
  logoutButton: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#ddd' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});