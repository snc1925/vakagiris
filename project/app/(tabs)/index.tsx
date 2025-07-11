import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleSheetsService } from '../../services/googleSheets';

export default function HomeScreen() {
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    institution: '',
    doctor: '',
    patientName: '',
    status: 'Private' as 'Private' | 'Billed',
    deviceNumber: '',
    technician: userData?.displayName || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.institution || !formData.doctor || !formData.patientName) {
      Alert.alert('Hata', 'Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const success = await GoogleSheetsService.submitEntry(formData);
      if (success) {
        Alert.alert('Başarılı', 'Veri başarıyla kaydedildi.');
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          institution: '',
          doctor: '',
          patientName: '',
          status: 'Private',
          deviceNumber: '',
          technician: userData?.displayName || '',
          notes: '',
        });
      } else {
        Alert.alert('Hata', 'Veri kaydedilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!userData?.approved) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>VAKA GİRİŞİNE HOŞGELDİNİZ</Text>
        <View style={styles.approvalMessage}>
          <Text style={styles.approvalText}>
            Hesabınız henüz onaylanmamış. Lütfen yönetici onayını bekleyin.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>VAKA GİRİŞİNE HOŞGELDİNİZ</Text>
      <Text style={styles.welcome}>Hoş geldiniz, {userData?.displayName}</Text>
      
      <View style={styles.form}>
        <CustomTextInput
          label="Tarih"
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
          placeholder="YYYY-MM-DD"
        />
        
        <CustomTextInput
          label="Kurum"
          value={formData.institution}
          onChangeText={(text) => setFormData({ ...formData, institution: text })}
          placeholder="Kurum adını girin"
        />
        
        <CustomTextInput
          label="Doktor"
          value={formData.doctor}
          onChangeText={(text) => setFormData({ ...formData, doctor: text })}
          placeholder="Doktor adını girin"
        />
        
        <CustomTextInput
          label="Hasta Adı"
          value={formData.patientName}
          onChangeText={(text) => setFormData({ ...formData, patientName: text })}
          placeholder="Hasta adını girin"
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Durum</Text>
          <View style={[styles.picker, formData.status === 'Billed' && styles.billedPicker]}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <Picker.Item label="Özel" value="Private" />
              <Picker.Item label="Faturalı" value="Billed" />
            </Picker>
          </View>
        </View>
        
        <CustomTextInput
          label="Cihaz Numarası"
          value={formData.deviceNumber}
          onChangeText={(text) => setFormData({ ...formData, deviceNumber: text })}
          placeholder="Cihaz numarasını girin"
        />
        
        <CustomTextInput
          label="Teknisyen"
          value={formData.technician}
          onChangeText={(text) => setFormData({ ...formData, technician: text })}
          placeholder="Teknisyen adı"
        />
        
        <CustomTextInput
          label="Notlar"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          placeholder="Ek notlar..."
          multiline
          numberOfLines={3}
        />
        
        <CustomButton
          title="Kaydet"
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
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
    marginBottom: 8,
    marginTop: 40,
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    color: '#2563EB',
    marginBottom: 24,
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
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  billedPicker: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  approvalMessage: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  approvalText: {
    textAlign: 'center',
    color: '#92400E',
    fontSize: 16,
  },
});