import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, Order } from '../../types';
import SkeletonLoader from '../../components/SkeletonLoader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosToken from 'hooks/useAxiosToken';
import { useAlert } from '../../context/AlertContext';


type OrdersScreenProps = BottomTabScreenProps<MainTabParamList, 'Orders'>;

export default function OrdersScreen({ }: OrdersScreenProps): React.ReactElement {
  const axios_instance_token = useAxiosToken();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: orders = [], isLoading, isRefetching, refetch } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => await axios_instance_token.get("/orders").then(res => res.data)
  });

  const deleteMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await axios_instance_token.delete(`/orders/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showAlert('Success', 'Order deleted successfully', { type: 'success' });
    },
    onError: () => {
      showAlert('Error', 'Failed to delete order', { type: 'error' });
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleLoadMore = () => {
    // Implement real pagination here if supported by API
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <SkeletonLoader width="100%" height={80} borderRadius={8} count={2} gap={12} />
      </View>
    );
  };

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'Completed':
        return '#10b981';
      case 'Processing':
        return '#3b82f6';
      case 'Pending':
        return '#f59e0b';
      case 'Cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    showAlert(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      {
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        buttonText: 'Delete',
        primaryButtonColor: '#ef4444',
        onPress: () => {
          deleteMutation.mutate(orderId);
        },
      }
    );
  };

  const handeViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Recipient:</Text>
          <Text style={styles.detailValue}>{item.recipient}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>
            {item.currency === 'GHS' ? '¢' : item.currency === 'NGN' ? '₦' : 'CFC'} {item.amount}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>RMB:</Text>
          <Text style={styles.detailValue}>¥{item.rmbAmount}</Text>
        </View>
      </View>

      <View style={styles.orderActions}>
        <Pressable
          style={({ pressed }) => [
            styles.viewButton,
            pressed && { opacity: 0.6 },
          ]}
          onPress={() => handeViewOrder(item)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </Pressable>
        {item.status === 'Pending' && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => handleDeleteOrder(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  const emptyView = () => (
    <View style={styles.emptyContainer}>
      <Feather name="package" size={48} color="#000000" style={{ marginBottom: 16 }} />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyText}>Start by placing your first order to convert currency</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>Manage your RMB transactions</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={[styles.listContent, { paddingTop: 30 }]}
        ListEmptyComponent={emptyView}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>

            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Order ID</Text>
                  <Text style={styles.modalValue}>{selectedOrder.id}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Date</Text>
                  <Text style={styles.modalValue}>{selectedOrder.date}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                    <Text style={styles.statusText}>{selectedOrder.status}</Text>
                  </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Recipient</Text>
                  <Text style={styles.modalValue}>{selectedOrder.recipient}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Amount Paid</Text>
                  <Text style={styles.modalValue}>
                    {selectedOrder.currency === 'GHS' ? '¢' : selectedOrder.currency === 'NGN' ? '₦' : 'CFC'} {selectedOrder.amount}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>RMB Received</Text>
                  <Text style={styles.modalValue}>¥{selectedOrder.rmbAmount}</Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  headerTitle: {
    paddingTop: 30,
    paddingBottom: 3,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderDate: {
    fontSize: 12,
    color: '#666666',
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666666',
  },
  modalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#FFC107',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
