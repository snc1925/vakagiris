import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: formData.displayName,
        email: formData.email,
        role: 'user',
        approved: false,
        createdAt: new Date(),
      });

      Alert.alert(
        'Kayıt Başarılı',
        'Hesabınız oluşturuldu. Yönetici onayını bekleyin.',
        [
          {
            text: 'Tamam',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Hata', 'Kayıt yapılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VAKA GİRİŞİ</Text>
      <Text style={styles.subtitle}>Kayıt Ol</Text>
      
      <View style={styles.form}>
        <CustomTextInput
          label="Ad Soyad"
          value={formData.displayName}
          onChangeText={(text) => setFormData({ ...formData, displayName: text })}
          placeholder="Adınızı ve soyadınızı girin"
        />
        
        <CustomTextInput
          label="E-posta"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="ornek@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <CustomTextInput
          label="Şifre"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="Güvenli şifre oluşturun"
          secureTextEntry
        />
        
        <CustomTextInput
          label="Şifre Tekrar"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          placeholder="Şifrenizi tekrar girin"
          secureTextEntry
        />
        
        <CustomButton
          title="Kayıt Ol"
          onPress={handleRegister}
          disabled={loading}
        />
        
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Zaten hesabınız var mı? </Text>
          <Link href="/(auth)/login" style={styles.link}>
            Giriş Yap
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#2563EB',
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#64748B',
    fontSize: 16,
  },
  link: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});