import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Cost from '../components/Cost';
import HarvestingLineGraph from '../components/HarvestingLineGraph';

const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <ScrollView>
        <Cost />
        {/* Add other dashboard components here */}
        <HarvestingLineGraph />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 20, // Add some padding to the top
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10, // Reduce the vertical margin
  },
});

export default DashboardScreen;