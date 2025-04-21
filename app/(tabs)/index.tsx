import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { healthDataMap } from '../data/health-data';

const Index = () => {
  const router = useRouter();

  const healthList = Object.entries(healthDataMap).map(([id, item]) => ({
    id,
    name: item.title,
    value: item.value,
  }));

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemValue}>{item.value}</Text>
      </View>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/tags/${item.id}`)}
      >
        <Text style={styles.detailsText}>More Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={healthList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemValue: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  detailsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailsText: {
    color: '#fff',
    fontSize: 14,
  },
});
