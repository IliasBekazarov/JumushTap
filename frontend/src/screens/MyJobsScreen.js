import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyJobs, deleteJob } from '../api';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  bg: '#0d1117', card: '#161b22', input: '#1c2230',
  border: '#30363d', purple: '#7c3aed', green: '#22c55e',
  red: '#ef4444', text: '#e6edf3', muted: '#8b949e',
};

export default function MyJobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await getMyJobs();
      setJobs(res.data);
    } catch (e) {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = (id) => {
    Alert.alert('Жок кылуу', 'Бул вакансияны жок кылгыңыз келеби?', [
      { text: 'Жок' },
      {
        text: 'Ооба',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteJob(id);
            setJobs((prev) => prev.filter((j) => j.id !== id));
          } catch (e) { Alert.alert('Ката'); }
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="lock-closed-outline" size={48} color={COLORS.muted} />
        <Text style={{ color: COLORS.muted, marginTop: 12 }}>Кириңиз</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={COLORS.purple} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJobs(); }} tintColor={COLORS.purple} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="briefcase-outline" size={52} color={COLORS.muted} />
            <Text style={{ color: COLORS.muted, marginTop: 12 }}>Вакансия жок</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={12} color={COLORS.muted} />
                  <Text style={styles.meta}>{item.address}</Text>
                </View>
                <Text style={styles.meta}>
                  {item.is_negotiable ? 'Договорная' : `${item.salary_from} - ${item.salary_to} сом`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color={COLORS.red} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.meta}>👁 {item.views_count} просмотров</Text>
              <Text style={styles.meta}>⭐ {item.avg_rating}/5</Text>
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
  cardTop: { flexDirection: 'row' },
  desc: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  meta: { color: COLORS.muted, fontSize: 12, marginLeft: 3 },
  deleteBtn: { padding: 4 },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
});
