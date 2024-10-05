import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CostOverview from '../components/CostOverview';
import HarvestingLineGraph from '../components/HarvestingLineGraph';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const DashboardScreen: React.FC = () => {
  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        <CostOverview />
        <HarvestingLineGraph />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

export default DashboardScreen;