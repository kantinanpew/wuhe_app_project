import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase';

export default function App() {
  const [teaTypes, setTeaTypes] = useState([]);

  useEffect(() => {
    const fetchTeaTypes = async () => {
      const db = getFirestore(app);
      const teaCollection = collection(db, 'teaTypes');
      const teaSnapshot = await getDocs(teaCollection);
      const teaList = teaSnapshot.docs.map(doc => doc.data().name);
      setTeaTypes(teaList);
    };

    fetchTeaTypes();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Tea Farm App!</Text>
      <Text>Available tea types:</Text>
      {teaTypes.map((tea, index) => (
        <Text key={index}>{tea}</Text>
      ))}
    </View>
  );
}
