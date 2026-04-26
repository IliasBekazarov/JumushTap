import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, RefreshControl, Linking, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getJobs, toggleBookmark } from '../api';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../api';

const COLORS = {
  bg: '#0d1117', card: '#161b22', input: '#1c2230',
  border: '#30363d', purple: '#7c3aed', green: '#22c55e',
  blue: '#3b82f6', text: '#e6edf3', muted: '#8b949e',
};

function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? 'star' : 'star-outline'}
          size={12}
          color={i <= Math.round(rating) ? '#f59e0b' : COLORS.muted}
        />
      ))}
    </View>
  );
}

function JobCard({ job, onBookmark }) {
  const avatarUrl = job.user?.avatar ? `${BASE_URL}${job.user.avatar}` : null;

  const handleWhatsApp = () => {
    const num = job.whatsapp.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${num}`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${job.phone}`);
  };

  const handleShare = () => {
    Alert.alert('Бөлүшүү', `JumushTap: ${job.description}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.userName}>{job.user?.name}</Text>
          <Text style={styles.profileType}>
            {job.profile_type === 'employer' ? '🏢 Работодатель' : '🔍 Ищу работу'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onBookmark(job.id)}>
          <Ionicons
            name={job.is_bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={job.is_bookmarked ? COLORS.purple : COLORS.muted}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{job.description}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={13} color={COLORS.muted} />
        <Text style={styles.metaText}>{job.address}</Text>
        <Ionicons name="calendar-outline" size={13} color={COLORS.muted} style={{ marginLeft: 10 }} />
        <Text style={styles.metaText}>
          {job.expires_at || new Date(job.created_at).toLocaleDateString('ru-RU')}
        </Text>
      </View>

      <View style={styles.salaryBadge}>
        <Text style={styles.salaryText}>
          Зарплата:{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {job.is_negotiable
              ? 'Договорная'
              : `${job.salary_from || 0} - ${job.salary_to || 0} сом`}
          </Text>
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <View style={styles.ratingRow}>
            <Text style={styles.metaText}>Оценка: </Text>
            <StarRating rating={job.avg_rating} />
          </View>
          <Text style={[styles.metaText, { marginTop: 4 }]}>
            <Ionicons name="eye-outline" size={12} /> {job.views_count} просмотра
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.green }]} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.blue }]} onPress={handleCall}>
            <Ionicons name="call" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.purple }]} onPress={handleShare}>
            <Ionicons name="share-social" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchJobs = useCallback(async (q = '') => {
    try {
      const res = await getJobs(q ? { q } : {});
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    fetchJobs(text);
  };

  const handleBookmark = async (id) => {
    if (!user) { Alert.alert('', 'Алгач кириңиз'); return; }
    try {
      await toggleBookmark(id);
      setJobs((prev) =>
        prev.map((j) => j.id === id ? { ...j, is_bookmarked: !j.is_bookmarked } : j)
      );
    } catch (e) {}
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={COLORS.purple} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={COLORS.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск работы..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <JobCard job={item} onBookmark={handleBookmark} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchJobs(search); }}
            tintColor={COLORS.purple}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.metaText, { textAlign: 'center', marginTop: 40 }]}>
            Вакансия табылган жок
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.input, margin: 12, borderRadius: 12, paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: COLORS.text, paddingVertical: 12, marginLeft: 8, fontSize: 15 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.purple, justifyContent: 'center', alignItems: 'center',
  },
  userName: { color: COLORS.text, fontWeight: '700', fontSize: 15 },
  profileType: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  description: { color: COLORS.text, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { color: COLORS.muted, fontSize: 12, marginLeft: 3 },
  salaryBadge: {
    backgroundColor: COLORS.input, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 10,
  },
  salaryText: { color: COLORS.muted, fontSize: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
