import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

interface ChartData {
  day: number;
  value: number;
}

interface HistoryChartProps {
  data: ChartData[];
  maxValue?: number;
  height?: number;
}

const { width } = Dimensions.get('window');

export default function HistoryChart({
  data,
  maxValue,
  height = 200,
}: HistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  // Calculate max value for scaling
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  const chartPadding = 40;
  const chartWidth = width - 50;
  const barWidth = chartWidth / data.length;

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartContainer}
      >
        <View style={[styles.chart, { height, width: Math.max(chartWidth, width - 50) }]}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>1</Text>
            <Text style={styles.yAxisLabel}>0.75</Text>
            <Text style={styles.yAxisLabel}>0.5</Text>
            <Text style={styles.yAxisLabel}>0.25</Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>

          {/* Grid and bars */}
          <View style={styles.chartContent}>
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map((index) => (
              <View
                key={`grid-${index}`}
                style={[
                  styles.gridLine,
                  {
                    top: (index * height) / 5 + 10,
                  },
                ]}
              />
            ))}

            {/* Bars */}
            <View style={styles.barsContainer}>
              {data.map((item, index) => {
                const barHeight = (item.value / max) * (height - 60);
                return (
                  <View
                    key={`bar-${index}`}
                    style={[
                      styles.barWrapper,
                      { width: barWidth },
                    ]}
                  >
                    {/* Bar */}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(barHeight, 2),
                          backgroundColor: getBarColor(index, data.length),
                        },
                      ]}
                    />
                    {/* Day label */}
                    <Text style={styles.dayLabel}>{String(item.day).padStart(2, '0')}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Helper function to get gradient color for bars
function getBarColor(index: number, total: number): string {
  const hue = (index / total) * 180; // Range from 0 to 180 for gradient
  
  // Create a gradient from light blue to dark teal
  if (hue < 60) {
    return '#6DB3F2'; // Light blue
  } else if (hue < 120) {
    return '#4A90E2'; // Medium blue
  } else {
    return '#1A7BA1'; // Dark teal
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  chartContainer: {
    flexGrow: 1,
  },
  chart: {
    flexDirection: 'row',
    position: 'relative',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  chartContent: {
    flex: 1,
    position: 'relative',
    paddingTop: 10,
    paddingBottom: 30,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    top: 10,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
  noDataText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
});
