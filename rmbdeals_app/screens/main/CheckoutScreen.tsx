import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosToken from '../../hooks/useAxiosToken';
import { useAlert } from '../../context/AlertContext';
import { User } from '../../types';

export default function CheckoutScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState<boolean>(false);

  const { auth } = useAuth();
  const axiosToken = useAxiosToken();
  const { showAlert } = useAlert();

  // Billing Details State
  const [name, setName] = useState<string>(auth ? auth?.name : '');
  const [whatsappNumber, setWhatsappNumber] = useState<string>(auth ? auth?.phone : '');
  const [email, setEmail] = useState<string>(auth ? auth?.email : '');
  const [momoName, setMomoName] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');


  // Fetch Order Data
  const { data: fetchedOrder, isLoading: isLoadingOrder } = useQuery({
    queryKey: ['order', params.orderId],
    queryFn: async () => {
      if (!params.orderId) return null;
      console.log('[CHECKOUT] Fetching order details for ID:', params.orderId);
      // Ensure we hit the correct endpoint. If the user endpoint is notably 404, check logs.
      const response = await axiosToken.get(`/orders/${params.orderId}`);
      console.log('[CHECKOUT] Order details received:', response.data);
      return response.data;
    },
    enabled: !!params.orderId,
  });


  // Derived Order Data (prefer fetched data, fallback to params)
  const orderData = {
    orderId: fetchedOrder?.id || (params.orderId ? Number(params.orderId) : 0),
    productName: fetchedOrder?.currency ? `${fetchedOrder.currency} Transaction` : 'RMB Transaction',
    rate: fetchedOrder?.rate || (params.rate ? Number(params.rate) : 0.57),
    amountGHS: fetchedOrder?.amount ? Number(fetchedOrder.amount) : (params.amount ? Number(params.amount) : 0),
    rmbEquivalence: fetchedOrder?.rmbAmount
      ? Number(fetchedOrder.rmbAmount)
      : (params.amount ? Number(params.amount) * (params.rate ? Number(params.rate) : 0.57) : 0),
    accountType: fetchedOrder?.account || (params.accountType ?? 'Personal'),
  };

  // Refine rmbEquivalence if not present in fetched object
  if (fetchedOrder && !orderData.rmbEquivalence && orderData.amountGHS && orderData.rate) {
    orderData.rmbEquivalence = orderData.amountGHS * orderData.rate;
  }

  // Momo/Bank Payment Details
  const paymentDetails = {
    momoNumber: '+233 552-771-004',
    merchantId: '725120',
    merchantName: 'CLIXMA TRADING ENTERPRISE',
    bankName: 'GCB PLC',
    accountNumber: '1391180001895',
    accountName: 'CLIXMA TRADING',
  };

  const handlePlaceOrder = async () => {
    if (!name.trim()) {
      showAlert('Error', 'Please enter your name', { type: 'error' });
      return;
    }

    if (!whatsappNumber.trim()) {
      showAlert('Error', 'Please enter your WhatsApp number', { type: 'error' });
      return;
    }

    if (!email.trim()) {
      showAlert('Error', 'Please enter your email address', { type: 'error' });
      return;
    }

    if (!momoName.trim()) {
      showAlert('Error', 'Please enter your Momo account name', { type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        name,
        email,
        momoName,
        whatsapp: whatsappNumber,
        notes: orderNote,
      };

      console.log('[CHECKOUT] Sending checkout request for order:', orderData.orderId);
      console.log('[CHECKOUT] Payload:', payload);

      // Perform checkout
      const response = await axiosToken.post(`/orders/checkout/${orderData.orderId}`, payload);

      console.log('[CHECKOUT] Success:', response.data);

      await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for better UX
      showAlert('Success', response.data.message || 'Order placed successfully!', { type: 'success' });
      router.push('/(tabs)/dashboard');
    } catch (error: any) {
      console.error('[CHECKOUT] Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      showAlert('Error', errorMessage, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED: Always go back to Buy screen
  const handleCancel = () => {
    router.push('/(tabs)/buy');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.header}>
        <Pressable
          onPress={handleCancel}
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Order Summary Section */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.orderId}>Your Order ID: {orderData.orderId}</Text>

          <View style={styles.productSection}>
            <Text style={styles.productLabel}>PRODUCT</Text>
            <View style={styles.productRow}>
              <Text style={styles.productName}>
                Name: <Text style={styles.bold}>{orderData.productName}</Text>
              </Text>
              <Text style={styles.subtotal}>SUBTOTAL</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rate</Text>
              <Text style={styles.detailValue}>{orderData.rate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount in GHS</Text>
              <Text style={styles.detailValue}>GHS {orderData.amountGHS}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>RMB Equivalence</Text>
              <Text style={styles.detailValue}>¥ {orderData.rmbEquivalence.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Account Type: <Text style={styles.bold}>{orderData.accountType}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>GHS {orderData.amountGHS}</Text>
          </View>

          <View style={styles.totalDivider} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.bold]}>Total</Text>
            <Text style={[styles.totalValue, styles.bold]}>GHS {orderData.amountGHS}</Text>
          </View>
        </View>
      </View>

      {/* Billing Details Section */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Billing Details</Text>

          {/* <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <Text style={styles.warningText}>
              Please <Text style={styles.loginLink}>login</Text> if you already have an account.
              Otherwise, continue to fill the form.
            </Text>
          </View> */}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>WhatsApp Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your WhatsApp number"
              placeholderTextColor="#999"
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
            <Text style={styles.helperText}>
              This email will be used to create an account for you.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name on Momo Account</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Momo account name"
              placeholderTextColor="#999"
              value={momoName}
              onChangeText={setMomoName}
              editable={!loading}
            />
          </View>
        </View>
      </View>

      {/* Additional Notes Section */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Order Note (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter special notes for delivery"
              placeholderTextColor="#999"
              value={orderNote}
              onChangeText={setOrderNote}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
            <Text style={styles.helperText}>Special notes for delivery.</Text>
          </View>
        </View>
      </View>

      {/* Payment Details Section */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Momo/Bank Payment Details</Text>

          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <Text style={styles.warningText}>
              Make your payment directly into our momo or bank account. Please use your Order ID
              as the reference.
            </Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Momo Number</Text>
            <Text style={styles.paymentValue}>{paymentDetails.momoNumber}</Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>
              Merchant ID (If using MTN Momo Pay & Pay Bill)
            </Text>
            <Text style={styles.paymentValue}>{paymentDetails.merchantId}</Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Merchant Name</Text>
            <Text style={styles.paymentValue}>{paymentDetails.merchantName}</Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Bank Name</Text>
            <Text style={styles.paymentValue}>{paymentDetails.bankName}</Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Account Number</Text>
            <Text style={styles.paymentValue}>{paymentDetails.accountNumber}</Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Account Name</Text>
            <Text style={styles.paymentValue}>{paymentDetails.accountName}</Text>
          </View>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonSection}>
        <Pressable
          style={({ pressed }) => [
            styles.placeOrderButton,
            loading && styles.buttonDisabled,
            pressed && !loading && { opacity: 0.8 },
          ]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            loading && styles.buttonDisabled,
            pressed && !loading && { opacity: 0.6 },
          ]}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107',
  },
  productSection: {
    marginBottom: 16,
  },
  productLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    color: '#000000',
  },
  subtotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#000000',
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#000000',
  },
  totalValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  totalDivider: {
    height: 2,
    backgroundColor: '#FFC107',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF5E7',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#7F8C8D',
    marginLeft: 10,
    lineHeight: 18,
  },
  loginLink: {
    color: '#FFC107',
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
    color: '#000000',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  helperText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 6,
    lineHeight: 16,
  },
  helperTextGray: {
    fontSize: 12,
    color: '#BDC3C7',
    marginTop: 6,
  },
  paymentDetailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  paymentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  paymentValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  buttonSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  placeOrderButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  footerSpacing: {
    height: 30,
  },
});
