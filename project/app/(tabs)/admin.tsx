import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  approved: boolean;
}

export default function AdminScreen() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'user' as 'admin' | 'user',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchUsers();
    }
  }, [userData]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersList);
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcılar yüklenemedi.');
    }
  };

  const approveUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved: true,
      });
      fetchUsers();
      Alert.alert('Başarılı', 'Kullanıcı onaylandı.');
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı onaylanamadı.');
    }
  };

  const deleteUser = async (userId: string) => {
    Alert.alert(
      'Kullanıcı Sil',
      'Bu kullanıcıyı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId));
              fetchUsers();
              Alert.alert('Başarılı', 'Kullanıcı silindi.');
            } catch (error) {
              Alert.alert('Hata', 'Kullanıcı silinemedi.');
            }
          },
        },
      ]
    );
  };

  const addUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.displayName) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        approved: true,
        createdAt: new Date(),
      });

      setNewUser({ email: '', password: '', displayName: '', role: 'user' });
      setShowAddUser(false);
      fetchUsers();
      Alert.alert('Başarılı', 'Kullanıcı eklendi.');
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  if (userData?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.noAccess}>Bu sayfaya erişim yetkiniz yok.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Yönetim Paneli</Text>
      
      <CustomButton
        title={showAddUser ? 'İptal' : 'Yeni Kullanıcı Ekle'}
        onPress={() => setShowAddUser(!showAddUser)}
        variant={showAddUser ? 'secondary' : 'primary'}
        style={styles.addButton}
      />

      {showAddUser && (
        <View style={styles.addUserForm}>
          <CustomTextInput
            label="E-posta"
            value={newUser.email}
            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            placeholder="kullanici@example.com"
            keyboardType="email-address"
          />
          
          <CustomTextInput
            label="Şifre"
            value={newUser.password}
            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
            placeholder="Güvenli şifre"
            secureTextEntry
          />
          
          <CustomTextInput
            label="Ad Soyad"
            value={newUser.displayName}
            onChangeText={(text) => setNewUser({ ...newUser, displayName: text })}
            placeholder="Kullanıcı adı"
          />
          
          <CustomButton
            title="Kullanıcı Ekle"
            onPress={addUser}
            disabled={loading}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Kullanıcılar</Text>
      
      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userRole}>
              {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
            </Text>
            <Text style={[styles.userStatus, user.approved ? styles.approved : styles.pending]}>
              {user.approved ? 'Onaylandı' : 'Onay Bekliyor'}
            </Text>
          </View>
          
          <View style={styles.userActions}>
            {!user.approved && (
              <CustomButton
                title="Onayla"
                onPress={() => approveUser(user.id)}
                variant="primary"
                style={styles.actionButton}
              />
            )}
            
            <CustomButton
              title="Sil"
              onPress={() => deleteUser(user.id)}
              variant="danger"
              style={styles.actionButton}
            />
          </View>
        </View>
      ))}
    </ScrollView>
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
  addButton: {
    marginBottom: 20,
  },
  addUserForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginVertical: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  userStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  approved: {
    color: '#059669',
  },
  pending: {
    color: '#D97706',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  noAccess: {
    textAlign: 'center',
    fontSize: 18,
    color: '#64748B',
    marginTop: 100,
  },
});