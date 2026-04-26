import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createJob } from '../api';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  bg: '#0d1117', card: '#161b22', input: '#1c2230',
  border: '#30363d', purple: '#7c3aed', green: '#22c55e',
  text: '#e6edf3', muted: '#8b949e',
};

export default function PostJobScreen({ navigation }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    description: '',
    whatsapp: '+996',
    phone: '+996',
    address: '',
    is_negotiable: false,
    salary_from: '5000',
    salary_to: '15000',
    profile_type: 'employer',
  });
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('', 'Алгач кириңиз'); return;
    }
    if (!form.description.trim()) {
      Alert.alert('Ката', 'Жумуш сүрөттөмөсүн киргизиңиз'); return;
    }
    if (!form.address.trim()) {
      Alert.alert('Ката', 'Даректи киргизиңиз'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        salary_from: form.is_negotiable ? null : parseInt(form.salary_from) || 0,
        salary_to: form.is_negotiable ? null : parseInt(form.salary_to) || 0,
      };
      await createJob(payload);
      Alert.alert('Ийгилик!', 'Вакансия жарыяланды', [
        { text: 'OK', onPress: () => navigation.navigate('Search') },
      ]);
      setForm({
        description: '', whatsapp: '+996', phone: '+996',
        address: '', is_negotiable: false, salary_from: '5000',
        salary_to: '15000', profile_type: 'employer',
      });
    } catch (e) {
      Alert.alert('Ката', 'Кайра аракет кылыңыз');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      <View style={styles.group}>
        <Text style={styles.label}>Описание работы</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Что нужно сделать?"
          placeholderTextColor={COLORS.muted}
          multiline
          value={form.description}
          onChangeText={(v) => update('description', v)}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>WhatsApp</Text>
        <TextInput
          style={styles.input}
          placeholder="+996"
          placeholderTextColor={COLORS.muted}
          keyboardType="phone-pad"
          value={form.whatsapp}
          onChangeText={(v) => update('whatsapp', v)}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={styles.input}
          placeholder="+996"
          placeholderTextColor={COLORS.muted}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => update('phone', v)}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Адрес работы</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите адрес"
          placeholderTextColor={COLORS.muted}
          value={form.address}
          onChangeText={(v) => update('address', v)}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Зарплата</Text>
        <View style={styles.checkRow}>
          <TouchableOpacity
            style={[styles.checkbox, form.is_negotiable && styles.checkboxActive]}
            onPress={() => update('is_negotiable', !form.is_negotiable)}
          >
            {form.is_negotiable && <Ionicons name="checkmark" size={14} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.checkLabel}>Договорная</Text>
        </View>

        {!form.is_negotiable && (
          <>
            <Text style={[styles.label, { marginTop: 10 }]}>Цена от</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.salary_from}
              onChangeText={(v) => update('salary_from', v)}
            />
            <Text style={[styles.label, { marginTop: 10 }]}>Цена до</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.salary_to}
              onChangeText={(v) => update('salary_to', v)}
            />
          </>
        )}
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Тип профиля</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, form.profile_type === 'employer' && styles.typeBtnActive]}
            onPress={() => update('profile_type', 'employer')}
          >
            <View style={[styles.radio, form.profile_type === 'employer' && styles.radioActive]} />
            <Text style={styles.typeText}>🏢 Работодатель</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, form.profile_type === 'seeker' && styles.typeBtnActive]}
            onPress={() => update('profile_type', 'seeker')}
          >
            <View style={[styles.radio, form.profile_type === 'seeker' && styles.radioActive]} />
            <Text style={styles.typeText}>🔍 Ищу работу</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Разместить вакансию</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  group: { marginBottom: 16 },
  label: { color: COLORS.muted, fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.input, borderRadius: 10,
    padding: 14, color: COLORS.text, fontSize: 15,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1,
    borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  checkboxActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  checkLabel: { color: COLORS.text, marginLeft: 10, fontSize: 15 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.input, borderRadius: 10,
    padding: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  typeBtnActive: { borderColor: COLORS.purple },
  radio: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2, borderColor: COLORS.muted, marginRight: 8,
  },
  radioActive: { borderColor: COLORS.purple, backgroundColor: COLORS.purple },
  typeText: { color: COLORS.text, fontSize: 13 },
  btn: {
    backgroundColor: COLORS.purple, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
