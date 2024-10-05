import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const Weeding = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();
  const [method, setMethod] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [costs, setCosts] = useState('');
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();

  const weedingImages = [
    require('../assets/images/weeding.jpg'),
    require('../assets/images/tea_weeding_by_hand_tools.jpg'),
  ];

  const methods = [
    { label: 'Manual', value: 'Manual' },
    { label: 'Machine', value: 'Machine' },
    { label: 'Herbicides', value: 'Herbicides' },
    { label: 'Integrated', value: 'Integrated' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!method || !date || !costs) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (userRole !== 'admin') {
      Alert.alert(
        'Insufficient Privileges',
        'Sorry, you do not have sufficient privileges. Please contact charfarmmanager@gmail.com for assistance.'
      );
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'weeding'), {
        fieldId,
        method,
        date: date.toISOString(),
        costs: parseFloat(costs),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Weeding data saved successfully');
      setMethod('');
      setDate(new Date());
      setCosts('');
    } catch (error) {
      console.error('Error saving weeding data:', error);
      Alert.alert('Error', 'Failed to save weeding data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Field {fieldId} Weeding</Text>
        </View>
        <View style={styles.sliderContainer}>
          <HeroSlider images={weedingImages} />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Method:</Text>
          <RNPickerSelect
            onValueChange={(value) => setMethod(value)}
            items={methods}
            style={pickerSelectStyles}
            value={method}
            placeholder={{ label: 'Select Method', value: null }}
          />
          
          <Text style={styles.label}>Date:</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          
          <Text style={styles.label}>Total Costs ($):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter total costs"
            placeholderTextColor="#999"
            value={costs}
            onChangeText={setCosts}
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={saveData} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sliderContainer: {
    width: '100%',
    height: 200,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#7cb342',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 15,
  },
});

export default Weeding;