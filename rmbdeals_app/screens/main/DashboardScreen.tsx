import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Currency, MainTabParamList, Order } from '../../types';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosToken from '../../hooks/useAxiosToken';
import GradientBackground from '../../components/GradientBackground';
import SkeletonLoader from '../../components/SkeletonLoader';
import HistoryChart from '../../components/HistoryChart';
import { getErrorMessage, isRetryableError } from '../../hooks/useRetry';

const { width } = Dimensions.get('window');

type DashboardScreenProps = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;



interface Stats {
  totalOrders: number;
  successfulOrders: number;
  heldOrders: number;
  cancelledOrders: number;
  projectedExpense: string;
  heldExpense: string;
  successfulExpense: string;
  totalExpense?: string;
}

interface StatCard {
  id: number;
  title: string;
  value: string;
  subtitle: string;
  subvalue: string;
  icon: any;
  iconSet: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps): React.ReactElement {
  const router = useRouter();
  const axios_instance_token = useAxiosToken();
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [selectedYear, setSelectedYear] = useState('2025');

  const monthMap: { [key: string]: string } = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
    'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
  };

  const from = `${selectedYear}-${monthMap[selectedMonth]}-01`;
  const to = `${selectedYear}-${monthMap[selectedMonth]}-31`; // Simplified end date

  const currency = useQuery<Currency>({
    queryKey: ["currency"],
    queryFn: async () => await axios_instance_token.get('/currencies/user').then(res => res.data),
    retry: (failureCount, error: any) => isRetryableError(error) && failureCount < 2,
    retryDelay: (attemptIndex) => Math.pow(2, attemptIndex) * 1000,
  });

  const stats = useQuery<Stats>({
    queryKey: ["summary", from, to],
    queryFn: async () => await axios_instance_token.get(`/stats?from=${from}&to=${to}`).then(res => res.data),
    retry: (failureCount, error: any) => isRetryableError(error) && failureCount < 2,
    retryDelay: (attemptIndex) => Math.pow(2, attemptIndex) * 1000,
  });

  const timeframe = 'monthly';
  const period = { month: monthMap[selectedMonth], year: selectedYear };

  // Build chart data from recent orders filtered by selected month/year
  const buildChartData = (ordersData: Order[] | undefined) => {
    if (!ordersData || ordersData.length === 0) return [];

    // Filter orders by selected month and year
    const filteredOrders = ordersData.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === parseInt(period.month) - 1 &&
        orderDate.getFullYear() === parseInt(period.year);
    });

    if (filteredOrders.length === 0) return [];

    // Group by day and sum amounts
    const dailyData: { [key: number]: number } = {};
    filteredOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const day = orderDate.getDate();
      const amount = parseFloat(order.amount?.toString() || '0');
      dailyData[day] = (dailyData[day] || 0) + amount;
    });

    // Convert to chart format
    return Object.entries(dailyData)
      .map(([day, value]) => ({
        day: parseInt(day),
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => a.day - b.day);
  };

  const orders = useQuery<Order[]>({
    queryKey: ["summary", "orders", "recent"],
    queryFn: async () => {
      try {

        const response = await axios_instance_token.get('/stats/recent-orders');

        return response.data;
      } catch (error) {

        throw error;
      }
    }
  });

  const chartData = buildChartData(orders.data);

  const statCards: StatCard[] = [
    {
      id: 1,
      title: 'Total Expense',
      value: `₵${(stats.data?.projectedExpense || '0.00')}`,
      subtitle: 'Current Rate',
      subvalue: `¥1 = ₵${currency.data?.rate || '0.00'}`,
      icon: 'attach-money',
      iconSet: MaterialIcons,
    },
    {
      id: 2,
      title: 'Total Orders',
      value: (stats.data?.totalOrders || 0).toString(),
      subtitle: 'Projected Expense',
      subvalue: `₵${stats.data?.projectedExpense || '0.00'}`,
      icon: 'package',
      iconSet: Feather,
    },
    {
      id: 3,
      title: 'Successful Orders',
      value: (stats.data?.successfulOrders || 0).toString(),
      subtitle: 'Successful Expense',
      subvalue: `₵${stats.data?.successfulExpense || '0.00'}`,
      icon: 'checkmark-circle-outline',
      iconSet: Ionicons,
    },
    {
      id: 4,
      title: 'Held Orders',
      value: (stats.data?.heldOrders || 0).toString(),
      subtitle: 'Held Expense',
      subvalue: `₵${stats.data?.heldExpense || '0.00'}`,
      icon: 'pause-circle-outline',
      iconSet: Ionicons,
    },
  ];

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);



  const currentYear = new Date().getFullYear();
  const years = [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredOrders = orders.data || [];

  const onSelectYear = (year: string) => {

    setSelectedYear(year);
    setShowYearPicker(false);
  };

  const onSelectMonth = (month: string) => {

    setSelectedMonth(month);
    setShowMonthPicker(false);
  };

  const getStatusStyle = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || 'PENDING';
    switch (normalizedStatus) {
      case 'COMPLETED':
        return { backgroundColor: '#10b981', color: '#fff' };
      case 'PENDING':
        return { backgroundColor: '#f59e0b', color: '#fff' };
      case 'PROCESSING':
        return { backgroundColor: '#3b82f6', color: '#fff' };
      case 'CANCELLED':
        return { backgroundColor: '#ef4444', color: '#fff' };
      case 'HELD':
        return { backgroundColor: '#6366f1', color: '#fff' };
      default:
        return { backgroundColor: '#9ca3af', color: '#fff' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Image
              source={require('../../assets/rmblogo.jpeg')}
              style={{ width: 24, height: 24, borderRadius: 12 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logo}>RMB Deals</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.buyButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push('/(tabs)/buy')}
        >
          <Text style={styles.buyButtonText}>Buy</Text>
        </Pressable>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {(stats.isLoading || currency.isLoading) ? (
          <View style={styles.loadingContainer}>
            <SkeletonLoader width={(width - 44) / 2} height={160} borderRadius={12} count={4} gap={12} />
          </View>
        ) : (stats.error || currency.error) ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#dc3545" />
            <Text style={styles.errorText}>Failed to load stats</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => {
                stats.refetch?.();
                currency.refetch?.();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {statCards.map((card) => (
              <View
                key={card.id}
                style={[
                  styles.statCard,
                  card.id === 1 && styles.statCardPrimary,
                ]}
              >
                <View style={styles.statHeader}>
                  <card.iconSet
                    name={card.icon}
                    size={20}
                    color={card.id === 1 ? '#FFC107' : '#6B7280'}
                  />
                  <Text
                    style={
                      card.id === 1 ? styles.statTitlePrimary : styles.statTitle
                    }
                  >
                    {card.title}
                  </Text>
                </View>
                <Text
                  style={card.id === 1 ? styles.statValuePrimary : styles.statValue}
                >
                  {card.value}
                </Text>
                <View style={styles.statFooter}>
                  <Text
                    style={
                      card.id === 1 ? styles.statSubtitlePrimary : styles.statSubtitle
                    }
                  >
                    {card.subtitle}
                  </Text>
                  <Text
                    style={
                      card.id === 1 ? styles.statSubvaluePrimary : styles.statSubvalue
                    }
                  >
                    {card.subvalue}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>

      {/* History Section */}
      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>History</Text>
          <View style={styles.filterControls}>
            {/* Year Dropdown */}
            <Pressable
              style={({ pressed }) => [
                styles.dropdownButton,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => {
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
            >
              <Text style={styles.dropdownText}>{selectedYear}</Text>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </Pressable>

            {/* Month Dropdown */}
            <Pressable
              style={({ pressed }) => [
                styles.dropdownButton,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
            >
              <Text style={styles.dropdownText}>{selectedMonth}</Text>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </Pressable>
          </View>
        </View>

        {/* Year Picker */}
        {showYearPicker && (
          <View style={styles.pickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pickerScroll}>
              {years.map((year) => (
                <Pressable
                  key={year}
                  style={[styles.pickerItem, selectedYear === year && styles.pickerItemActive]}
                  onPress={() => onSelectYear(year)}
                >
                  <Text style={[styles.pickerText, selectedYear === year && styles.pickerTextActive]}>{year}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Month Picker */}
        {showMonthPicker && (
          <View style={styles.pickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pickerScroll}>
              {months.map((month) => (
                <Pressable
                  key={month}
                  style={[styles.pickerItem, selectedMonth === month && styles.pickerItemActive]}
                  onPress={() => onSelectMonth(month)}
                >
                  <Text style={[styles.pickerText, selectedMonth === month && styles.pickerTextActive]}>{month}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty State */}
        {orders.isLoading ? (
          <View style={styles.loadingChartContainer}>
            <SkeletonLoader width="100%" height={200} borderRadius={12} count={1} />
          </View>
        ) : orders.error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle" size={48} color="#dc3545" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Failed to load chart</Text>
            <Text style={styles.emptySubtitle}>{getErrorMessage(orders.error)}</Text>
            <Pressable
              onPress={() => orders.refetch()}
              style={({ pressed }) => [
                styles.emptyLink,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.emptyLink}>Retry</Text>
            </Pressable>
          </View>
        ) : chartData && chartData.length > 0 ? (
          <HistoryChart
            data={chartData}
            height={200}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={48} color="#CCCCCC" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No orders found for the selected month</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/buy')}
              style={({ pressed }) => [
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.emptyLink}>Try making a new order</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Recent Orders */}
      <View style={styles.ordersSection}>
        <View style={styles.orderHeader}>
          <Text style={styles.ordersTitle}>Recent orders</Text>
          <Pressable
            style={({ pressed }) => [
              styles.seeAllButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        {/* Orders Table with Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          scrollEventThrottle={16}
          style={styles.tableScrollContainer}
        >
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colOrderId]}>Order ID</Text>
              <Text style={[styles.tableHeaderText, styles.colDate]}>Date</Text>
              <Text style={[styles.tableHeaderText, styles.colProduct]}>Product</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
              <Text style={[styles.tableHeaderText, styles.colRecipient]}>Recipient</Text>
              <Text style={[styles.tableHeaderText, styles.colAccount]}>Account</Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>Status</Text>
            </View>

            {/* Table Rows */}
            {filteredOrders.map((order) => (
              <View key={order.id} style={styles.tableRow}>
                <Text style={[styles.tableCellText, styles.colOrderId]}>{String(order.id || '').substring(0, 8)}</Text>
                <Text style={[styles.tableCellText, styles.colDate]}>
                  {order.date ? order.date : new Date((order as any).createdAt || (order as any).created_at || Date.now()).toLocaleDateString()}
                </Text>
                <Text style={[styles.tableCellText, styles.colProduct]}>{order.currency || 'RMB'}</Text>
                <Text style={[styles.tableCellText, styles.colPrice]}>
                  {(order.amount || 0).toFixed(2)}
                </Text>
                <Text style={[styles.tableCellText, styles.colRecipient]}>
                  {(order as any).recipientName || order.recipient || 'Unknown'}
                </Text>
                <Text style={[styles.tableCellText, styles.colAccount]}>{(order as any).account || (order as any).accountType || 'Personal'}</Text>
                <View style={[styles.colStatus]}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusStyle(order.status).backgroundColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusStyle(order.status).color },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footerSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContentContainer: {
    paddingTop: 30,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },

  buyButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buyButtonText: {
    color: '#FFC107',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statCardPrimary: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statTitlePrimary: {
    fontSize: 12,
    color: '#FFC107',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  statValuePrimary: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 8,
  },
  statFooter: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  statSubtitlePrimary: {
    fontSize: 10,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  statSubvalue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  statSubvaluePrimary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFC107',
  },
  loadingContainer: {
    width: '100%',
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingChartContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  errorContainer: {
    width: '100%',
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 12,
  },
  historySection: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  historyHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  emptyTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyLink: {
    fontSize: 13,
    color: '#FFC107',
    fontWeight: '600',
  },
  ordersSection: {
    margin: 16,
    marginTop: 0,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  seeAllButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  tableScrollContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
    minWidth: width - 32,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCellText: {
    fontSize: 13,
    color: '#374151',
  },
  colOrderId: {
    width: 70,
  },
  colDate: {
    width: 80,
  },
  colProduct: {
    width: 60,
  },
  colPrice: {
    width: 60,
  },
  colRecipient: {
    width: 100,
  },
  colAccount: {
    width: 70,
  },
  colStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    gap: 4,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  paginationButtonTextDisabled: {
    color: '#CCCCCC',
  },
  paginationInfo: {
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  paginationBold: {
    fontWeight: '700',
    color: '#000000',
  },
  paginationMeta: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  footerSpacing: {
    height: 40,
  },
  filterButtonActiveState: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F9FAFB',
  },
  pickerScroll: {
    padding: 12,
    gap: 8,
  },
  pickerItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pickerItemActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  pickerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  pickerTextActive: {
    color: '#FFC107',
  },
  filterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
    alignItems: 'center',
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  segmentTextActive: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '600',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
});
