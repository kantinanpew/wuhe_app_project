import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';

const { width } = Dimensions.get('window');

interface CostData {
  landPreparation: number;
  nursery: number;
  plantation: number;
  harvesting: number;
  maintenance: number;
}

const collections = ['fertilizers', 'harvesting', 'nursery', 'pestsAndDiseases', 'plantation', 'pruning', 'soilPH', 'weeding'];

const CostOverview: React.FC = () => {
  const [costData, setCostData] = useState<CostData>({
    landPreparation: 0,
    nursery: 0,
    plantation: 0,
    harvesting: 0,
    maintenance: 0,
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    fetchCostData(selectedYear);
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      const yearsSet = new Set<number>();
      for (const collectionName of collections) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.date) {
            const year = new Date(data.date).getFullYear();
            yearsSet.add(year);
          }
        });
      }
      const years = Array.from(yearsSet).sort((a, b) => b - a);
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    } catch (error) {
      console.error('Error fetching available years:', error);
      Alert.alert('Error', 'Failed to fetch available years');
    }
  };

  const fetchCostData = async (year: number) => {
    setIsLoading(true);
    try {
      const yearData: CostData = {
        landPreparation: 0,
        nursery: 0,
        plantation: 0,
        harvesting: 0,
        maintenance: 0,
      };

      for (const collectionName of collections) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.date) {
            const docYear = new Date(data.date).getFullYear();
            if (docYear === year) {
              const cost = data.costs || 0;
              switch (collectionName) {
                case 'fertilizers':
                case 'soilPH':
                  yearData.landPreparation += cost;
                  break;
                case 'nursery':
                  yearData.nursery += cost;
                  break;
                case 'plantation':
                  yearData.plantation += cost;
                  break;
                case 'harvesting':
                  yearData.harvesting += cost;
                  break;
                case 'weeding':
                case 'pruning':
                case 'pestsAndDiseases':
                  yearData.maintenance += cost;
                  break;
              }
            }
          }
        });
      }

      setCostData(yearData);
    } catch (error) {
      console.error('Error fetching cost data:', error);
      Alert.alert('Error', 'Failed to fetch cost data');
    } finally {
      setIsLoading(false);
    }
  };

  const totalCost = Object.values(costData).reduce((sum, cost) => sum + cost, 0);

  const pieChartData = Object.entries(costData).map(([key, value]) => ({
    name: key,
    cost: value,
    color: getColorForCategory(key),
    legendFontColor: '#7F7F7F',
    legendFontSize: 10,
    percentage: ((value / totalCost) * 100).toFixed(1) + '%',
  }));

  const barChartData = {
    labels: Object.keys(costData).map(label => label.slice(0, 3)),
    datasets: [
      {
        data: Object.values(costData),
      },
    ],
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.yearSelectorContainer}>
        <Text style={styles.yearSelectorLabel}>Select Year:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedYear(value)}
          items={availableYears.map(year => ({ label: year.toString(), value: year }))}
          value={selectedYear}
          style={pickerSelectStyles}
        />
      </View>
      <Text style={styles.title}>Cost Overview for {selectedYear}</Text>
      <View style={styles.pieChartContainer}>
        <PieChart
          data={pieChartData}
          width={width * 0.6}
          height={160}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="cost"
          backgroundColor="transparent"
          center={[width * 0.15, 0]} // Adjust the center to prevent left cutoff
          paddingLeft="0"
          absolute
          hasLegend={false}
          avoidFalseZero
        />
        <View style={styles.legendContainer}>
          {pieChartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}: {item.percentage}</Text>
            </View>
          ))}
        </View>
      </View>
      <BarChart
        data={barChartData}
        width={width - 30}
        height={200}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForVerticalLabels: {
            fontSize: 10,
          },
        }}
        style={{
          marginVertical: 4,
          borderRadius: 16,
        }}
        fromZero={true}
        showValuesOnTopOfBars={true}
      />
      <Text style={styles.totalCost}>Total Cost = NT$ {totalCost.toFixed(2)}</Text>
      <View style={styles.separator} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  yearSelectorLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    paddingRight: 10, // Add right padding to prevent legend from touching the edge
  },
  legendContainer: {
    width: '40%', // Reduce width to bring legend closer to chart
    paddingLeft: 0, // Remove left padding
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  legendColor: {
    width: 8,
    height: 8,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    flex: 1,
  },
  totalCost: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    paddingLeft: 10,
    color: '#7cb342',
    alignSelf: 'flex-start',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 15,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: 150,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    width: 150,
  },
});

const getColorForCategory = (category: string): string => {
  switch (category) {
    case 'landPreparation':
      return '#FF6384';
    case 'nursery':
      return '#36A2EB';
    case 'plantation':
      return '#FFCE56';
    case 'harvesting':
      return '#4BC0C0';
    case 'maintenance':
      return '#9966FF';
    default:
      return '#C9CBCF';
  }
};

export default CostOverview;