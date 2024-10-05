import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface HarvestData {
  costs: number;
  date: string;
  fieldId: number;
  method: string;
  timestamp: any;
  weight: number;
}

const colors = [
  'rgba(134, 65, 244, 1)',
  'rgba(244, 65, 134, 1)',
  'rgba(65, 134, 244, 1)',
  'rgba(244, 134, 65, 1)',
  'rgba(65, 244, 134, 1)',
];

const HarvestLineGraph: React.FC = () => {
  const [data, setData] = useState<HarvestData[]>([]);
  const [graphData, setGraphData] = useState<any>({});
  const [fields, setFields] = useState<number[]>([]);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; visible: boolean; value: number }>({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'harvesting'));
      const querySnapshot = await getDocs(q);
      const docs: HarvestData[] = querySnapshot.docs.map(doc => doc.data() as HarvestData);

      setData(docs);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Organize data by fieldId for multiple line graphs
      const fields = Array.from(new Set(data.map(item => item.fieldId)));
      setFields(fields);
      const lines: any = fields.map(fieldId => {
        const fieldData = data.filter(item => item.fieldId === fieldId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return {
          fieldId,
          dates: fieldData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short' })),
          weights: fieldData.map(item => item.weight),
        };
      });

      const allDates = Array.from(new Set(lines.flatMap(line => line.dates))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      setGraphData({
        labels: allDates,
        datasets: lines.map((line: any, index: number) => ({
          data: allDates.map(date => {
            const idx = line.dates.indexOf(date);
            return idx !== -1 ? line.weights[idx] : 0;
          }),
          strokeWidth: 2, // line thickness
          color: (opacity = 1) => colors[index % colors.length], // Predefined color for each line
        })),
      });
    }
  }, [data]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Harvesting Data Line Graph</Text>
        {graphData.datasets && (
          <>
            <LineChart
              data={graphData}
              width={Dimensions.get('window').width - 40}
              height={250}
              yAxisSuffix="kg"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#f7f7f7',
                backgroundGradientTo: '#f7f7f7',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              decorator={() => {
                return tooltipPos.visible ? (
                  <View>
                    <Text
                      style={{
                        position: 'absolute',
                        left: tooltipPos.x - 40,
                        top: tooltipPos.y - 30,
                        backgroundColor: 'white',
                        padding: 5,
                        borderRadius: 5,
                        borderColor: 'grey',
                        borderWidth: 1,
                      }}
                    >
                      {tooltipPos.value} kg
                    </Text>
                  </View>
                ) : null;
              }}
              onDataPointClick={(data) => {
                const isSamePoint = (tooltipPos.x === data.x && tooltipPos.y === data.y);

                isSamePoint
                  ? setTooltipPos((previousState) => ({
                      ...previousState,
                      value: data.value,
                      visible: !previousState.visible,
                    }))
                  : setTooltipPos({
                      x: data.x,
                      y: data.y,
                      value: data.value,
                      visible: true,
                    });
              }}
            />
            <View style={styles.legendContainer}>
              {graphData.datasets.map((dataset: any, index: number) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors[index % colors.length] }]} />
                  <Text style={styles.legendText}>Field {fields[index]}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

export default HarvestLineGraph;