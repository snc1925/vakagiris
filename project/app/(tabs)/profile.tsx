import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import CustomButton from '../../components/CustomButton';

export default function ProfileScreen() {
  const { userData, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Ad Soyad:</Text>
          <Text style={styles.value}>{userData?.displayName}</Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.label}>E-posta:</Text>
          <Text style={styles.value}>{userData?.email}</Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>
            {userData?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
          </Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Durum:</Text>
          <Text style={[styles.value, userData?.approved ? styles.approved : styles.pending]}>
            {userData?.approved ? 'Onaylandı' : 'Onay Bekliyor'}
          </Text>
        </View>
      </View>
      
      <CustomButton
        title="Çıkış Yap"
        onPress={handleSignOut}
        variant="danger"
        style={styles.signOutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 24,
    marginTop: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  value: {
    fontSize: 16,
    color: '#64748B',
  },
  approved: {
    color: '#059669',
    fontWeight: '600',
  },
  pending: {
    color: '#D97706',
    fontWeight: '600',
  },
  signOutButton: {
    marginTop: 20,
  },
});