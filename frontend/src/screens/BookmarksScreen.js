import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyBookmarks, toggleBookmark } from '../api';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  bg: '#0d1117', card: '#161b22', input: '#1c2230',
  border: '#30363d', purple: '#7c3aed', green: '#22c55e',
  blue: '#3b82f6', text: '#e6edf3', muted: '#8b949e',
};

export default function BookmarksScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const res = await getMyBookmarks();
      setJobs(res.data);
    } catch (e) {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, []);

  const handleRemove = async (id) => {
    await toggleBookmark(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="bookmark-outline" size={48} color={COLORS.muted} />
        <Text style={{ color: COLORS.muted, marginTop: 12 }}>Кириңиз</Text>
      </View>
    );
  }

  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator color={COLORS.purple} size="large" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} tintColor={COLORS.purple} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="bookmark-outline" size={52} color={COLORS.muted} />
            <Text style={{ color: COLORS.muted, marginTop: 12 }}>Сакталган жок</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.user?.name}</Text>
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.meta}>
                  📍 {item.address}
                </Text>
                <Text style={styles.salary}>
                  {item.is_negotiable ? 'Договорная' : `${item.salary_from} - ${item.salary_to} сом`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Ionicons name="bookmark" size={22} color={COLORS.purple} />
              </TouchableOpacity>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: COLORS.green }]}
                onPress={() => Linking.openURL(`whatsapp://send?phone=${item.whatsapp.replace(/\D/g, '')}`)}
              >
                <Ionicons name="logo-whatsapp" size={16} color="#fff" />
                <Text style={styles.btnText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: COLORS.blue }]}
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
              >
                <Ionicons name="call" size={16} color="#fff" />
                <Text style={styles.btnText}>Чалуу</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  row: { flexDirection: 'row', marginBottom: 10 },
  name: { color: COLORS.text, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  desc: { color: COLORS.text, fontSize: 13, marginBottom: 4 },
  meta: { color: COLORS.muted, fontSize: 12, marginBottom: 2 },
  salary: { color: COLORS.green, fontSize: 12, fontWeight: '600', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 13 },
});
