import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const { width } = Dimensions.get('window');

const Cost = () => {
  const [costData, setCostData] = useState({
    fieldMaintenance: 0,
    harvesting: 0,
    landPreparations: 0,
  });
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCostData();
  }, [year]);
  
    const fetchCostData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categories = [
          { name: 'weeding', group: 'fieldMaintenance' },
          { name: 'pruning', group: 'fieldMaintenance' },
          { name: 'pestsAndDiseases', group: 'fieldMaintenance' },
          { name: 'harvesting', group: 'harvesting' },
          { name: 'soilPH', group: 'landPreparations' },
          { name: 'fertilizers', group: 'landPreparations' },
        ];
  
        let totalFieldMaintenance = 0;
        let totalHarvesting = 0;
        let totalLandPreparations = 0;
        const monthlyTotals = Array(12).fill(0);
  
        for (const category of categories) {
          console.log(`Fetching data for category: ${category.name}`);
          const q = query(collection(db, category.name));
          const querySnapshot = await getDocs(q);
          console.log(`Number of documents in ${category.name}: ${querySnapshot.size}`);
  
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const cost = parseFloat(data.costs) || 0;
            const date = data.date ? new Date(data.date) : data.timestamp.toDate();
            
            if (date.getFullYear() === year) {
              const month = date.getMonth();
              monthlyTotals[month] += cost;
  
              switch (category.group) {
                case 'fieldMaintenance':
                  totalFieldMaintenance += cost;
                  break;
                case 'harvesting':
                  totalHarvesting += cost;
                  break;
                case 'landPreparations':
                  totalLandPreparations += cost;
                  break;
              }
            }
          });
        }
  
        console.log('Total Field Maintenance:', totalFieldMaintenance);
        console.log('Total Harvesting:', totalHarvesting);
        console.log('Total Land Preparations:', totalLandPreparations);
        console.log('Monthly Totals:', monthlyTotals);
  
        setCostData({
          fieldMaintenance: totalFieldMaintenance,
          harvesting: totalHarvesting,
          landPreparations: totalLandPreparations,
        });
        setMonthlyData(monthlyTotals);
      } catch (err) {
        console.error('Error fetching cost data:', err);
        setError('Failed to fetch cost data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    const calculatePercentage = (value) => {
      const total = costData.fieldMaintenance + costData.harvesting + costData.landPreparations;
      return ((value / total) * 100).toFixed(1);
    };
  
    const pieChartData = [
      { 
        name: 'Field Maintenance', 
        value: costData.fieldMaintenance, 
        color: '#8884d8', 
        legendFontColor: '#7F7F7F', 
        legendFontSize: 12
      },
      { 
        name: 'Harvesting', 
        value: costData.harvesting, 
        color: '#82ca9d', 
        legendFontColor: '#7F7F7F', 
        legendFontSize: 12
      },
      { 
        name: 'Land Preparations', 
        value: costData.landPreparations, 
        color: '#ffc658', 
        legendFontColor: '#7F7F7F', 
        legendFontSize: 12
      },
    ];
  
    const barChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: monthlyData,
        },
      ],
    };
  
    const getYAxisLabel = (value) => {
      if (value >= 1000000) return '1M';
      if (value >= 100000) return '100k';
      if (value >= 50000) return '50k';
      if (value >= 10000) return '10k';
      if (value >= 1000) return '1k';
      return '0';
    };
  
    const chartConfig = {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2,
      decimalPlaces: 0,
      formatYLabel: (value) => getYAxisLabel(value),
    };
  
    // Calculate the maximum value for the y-axis
    const maxValue = Math.max(...monthlyData);
    const yAxisMaxValue = maxValue <= 1000 ? 1000 :
                          maxValue <= 10000 ? 10000 :
                          maxValue <= 50000 ? 50000 :
                          maxValue <= 100000 ? 100000 : 1000000;
  
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cost Overview for {year}</Text>
        <PieChart
          data={pieChartData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={true}
          center={[10, 10]}
          avoidFalseZero
          renderDefs={({ width, height }) => (
            <defs>
              <clipPath id="clip">
                <rect width={width} height={height} />
              </clipPath>
            </defs>
          )}
          extras={pieChartData.map((item, index) => {
            const percentage = calculatePercentage(item.value);
            const { x, y } = calculateTextPosition(index, pieChartData.length);
            return (
              <text
                key={`percentage-${index}`}
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="12"
              >
                {`${percentage}%`}
              </text>
            );
          })}
        />
        <BarChart
          style={styles.barChart}
          data={barChartData}
          width={width - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
          yAxisSuffix=""
          segments={6}
          yMax={yAxisMaxValue}
        />
      </View>
    );
  };
  
  const calculateTextPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 80; // Adjust this value to position the text closer to or further from the center
    const x = 110 + radius * Math.cos(angle); // 110 is half of the chart width (220)
    const y = 110 + radius * Math.sin(angle); // 110 is half of the chart height (220)
    return { x, y };
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      margin: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    barChart: {
      marginVertical: 8,
      borderRadius: 16,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
    },
  });
  
  export default Cost;