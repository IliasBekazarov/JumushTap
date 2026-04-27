import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { updateProfile, BASE_URL } from '../api';

const COLORS = {
  bg: '#0d1117', card: '#161b22', input: '#1c2230',
  border: '#30363d', purple: '#7c3aed', green: '#22c55e',
  red: '#ef4444', text: '#e6edf3', muted: '#8b949e',
};

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) {
      const formData = new FormData();
      formData.append('avatar', {
        uri: result.assets[0].uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });
      try {
        await updateProfile(formData);
        await refreshUser();
      } catch (e) {
        Alert.alert('Ката', 'Сүрөт жүктөлгөн жок');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      await refreshUser();
      Alert.alert('Сакталды ✓');
    } catch (e) {
      Alert.alert('Ката');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="person-outline" size={48} color={COLORS.muted} />
        <Text style={{ color: COLORS.muted, marginTop: 12 }}>Кириңиз</Text>
      </View>
    );
  }

  const avatarUrl = user.avatar ? `${BASE_URL}${user.avatar}` : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Мой профиль</Text>

      <View style={styles.card}>
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
          )}
          <Text style={styles.avatarHint}>Нажмите для изменения фото</Text>
        </TouchableOpacity>

        {/* Fields */}
        <Text style={styles.label}>Имя</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Атыңыз"
          placeholderTextColor={COLORS.muted}
        />

        <Text style={styles.label}>Номер телефона</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user.jobs_count || 0}</Text>
            <Text style={styles.statLabel}>Мои вакансии</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user.bookmarks_count || 0}</Text>
            <Text style={styles.statLabel}>Избранные</Text>
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Сохранить</Text>}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert('Чыгуу', 'Чыгышыңызды ырастайсызбы?', [
            { text: 'Жок' },
            { text: 'Ооба', onPress: logout },
          ])}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.red} />
          <Text style={styles.logoutText}>Выход</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 8 },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.purple, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  avatarHint: { color: COLORS.muted, fontSize: 12 },
  label: { color: COLORS.muted, fontSize: 13, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: COLORS.input, borderRadius: 10,
    padding: 14, color: COLORS.text, fontSize: 15, marginBottom: 12,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  stat: { alignItems: 'center' },
  statNum: { color: COLORS.purple, fontSize: 22, fontWeight: '700' },
  statLabel: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  saveBtn: {
    backgroundColor: COLORS.purple, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', marginBottom: 12,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderWidth: 1, borderColor: COLORS.red,
    borderRadius: 10, paddingVertical: 14,
  },
  logoutText: { color: COLORS.red, fontWeight: '600', fontSize: 15 },
});