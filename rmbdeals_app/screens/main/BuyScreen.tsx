import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosToken from '../../hooks/useAxiosToken';
import { useAlert } from '../../context/AlertContext';
import { Currency } from '@/types';
import { axios_instance } from '@/_API/axios';

type CurrencyType = 'GHS' | 'NGN' | 'CFC';
type AccountType = 'personal' | 'supplier';
type OrderType = 'BUY' | 'SELL';

export default function BuyScreen(): React.ReactElement {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosToken = useAxiosToken();
  const { auth } = useAuth();
  const { showAlert } = useAlert();
  const [orderType, setOrderType] = useState<OrderType>('BUY');
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [currency, setCurrency] = useState<CurrencyType>('GHS');
  const [amount, setAmount] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);




  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission required', 'Please allow access to your photo library', { type: 'warning' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setQrImage(result.assets[0].uri);
    }
  };

  const currencies = useQuery<Currency[]>({
    queryKey: ["currency", "rate"],
    queryFn: async () => await axios_instance.get(`/currencies`).then(res => {
      return res.data
    })
  })

  const currentRate = currencies.data?.find((r) => r.currency === "GHS")?.rate || 0;
  const rmbEquivalence = amount ? parseFloat(amount) * currentRate : 0;

  const handleContinue = async () => {
    const numericAmount = parseFloat(amount);

    if (!amount || isNaN(numericAmount) || numericAmount < 400) {
      showAlert('Error', 'Minimum transaction amount is GH¢ 400.00', { type: 'error' });
      return;
    }

    if (!recipientName.trim()) {
      showAlert('Error', 'Please enter recipient name', { type: 'error' });
      return;
    }

    if (!qrImage) {
      showAlert('Error', 'Please upload Alipay/WeChat QR code', { type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Append QR Code image
      const filename = qrImage.split('/').pop() || 'qrcode.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // On Native, we append the file object directly
      // @ts-ignore - React Native expects this format for FormData
      formData.append('qrcode', {
        uri: qrImage,
        name: filename,
        type,
      });


      formData.append('account', accountType);
      formData.append('amount', String(numericAmount));
      formData.append('currency', currency);
      formData.append('recipient', recipientName);


      // Use fetch instead of axios for reliable file upload
      const token = auth?.backendTokens?.accessToken;
      const baseUrl = 'https://api.rmbdeals.com/api/v1'; // Hardcoded fallback or use logic to get from axios instance

      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let fetch generate the Content-Type with boundary automatically
          'Accept': 'application/json',
        },
        body: formData,
      });


      const responseText = await response.text();


      if (!response.ok) {
        let errorMessage = 'Failed to place order';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Response was not JSON
        }
        throw new Error(errorMessage);
      }

      const responseData = JSON.parse(responseText);
      console.log('[BUY] Order created:', responseData);
      const orderId = responseData.id;

      // Invalidate queries to refresh Dashboard and Orders list
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      showAlert('Success', responseData.message || 'Order created successfully!', { type: 'success' });

      // 👉 Save values BEFORE resetting state
      const checkoutParams = {
        orderId,
        orderType,
        accountType,
        currency,
        amount: numericAmount,
        recipientName,
        from: '/(tabs)/buy',
      };

      // Reset form
      setAmount('');
      setRecipientName('');
      setQrImage(null);

      // 👉 Navigate to checkout with full data
      router.push({
        pathname: `/(tabs)/checkout/${orderId}`,
        params: checkoutParams,
      });

    } catch (error: any) {
      console.error('[BUY] Order placement error:', error);
      const errorMessage = error.message || 'Failed to place order. Please try again.';
      showAlert('Error', errorMessage, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const getCurrencySymbol = (curr: CurrencyType): string => {
    switch (curr) {
      case 'GHS':
        return '¢';
      case 'NGN':
        return '₦';
      case 'CFC':
        return 'CFC';
      default:
        return curr;
    }
  };




  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Place Order</Text>
        <Text style={styles.sectionDesc}>Fill in the details for your order</Text>

        <View style={styles.orderDetailsCard}>
          <Text style={styles.cardTitle}>Order Details</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.buttonGroup}>
              {(['BUY', 'SELL'] as OrderType[]).map((type) => (
                <Pressable
                  key={type}
                  style={({ pressed }) => [
                    styles.typeButton,
                    orderType === type && styles.typeButtonActive,
                    pressed && !loading && { opacity: 0.6 },
                  ]}
                  onPress={() => setOrderType(type)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      orderType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Current Rate</Text>
            <View style={styles.rateDisplay}>
              <Text style={styles.rateText}>¥{currentRate}</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>RMB Equivalence</Text>
            <View style={styles.rateDisplay}>
              <Text style={styles.rateText}>¥{rmbEquivalence.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.buttonGroup}>
              {(['personal', 'supplier'] as AccountType[]).map((type) => (
                <Pressable
                  key={type}
                  style={({ pressed }) => [
                    styles.typeButton,
                    accountType === type && styles.typeButtonActive,
                    pressed && !loading && { opacity: 0.6 },
                  ]}
                  onPress={() => setAccountType(type)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      accountType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Transaction Currency</Text>
            <View style={styles.buttonGroup}>
              {(['GHS', 'NGN', 'CFC'] as CurrencyType[]).map((curr) => (
                <Pressable
                  key={curr}
                  style={({ pressed }) => [
                    styles.typeButton,
                    currency === curr && styles.typeButtonActive,
                    pressed && !loading && { opacity: 0.6 },
                  ]}
                  onPress={() => setCurrency(curr)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      currency === curr && styles.typeButtonTextActive,
                    ]}
                  >
                    {curr}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Transacted Amount</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>
                {getCurrencySymbol(currency)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#666"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>
            <Text style={styles.minAmount}>
              Minimum amount for transactions is {getCurrencySymbol(currency)} 400.00
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipient Details</Text>
        <Text style={styles.sectionDesc}>
          Fill with recipient Alipay or WeChat details and QR
        </Text>

        <View style={styles.orderDetailsCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Recipient Name</Text>
            <Text style={styles.helper}>Name on passport used for Alipay registration</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter recipient name"
              placeholderTextColor="#666"
              value={recipientName}
              onChangeText={setRecipientName}
              editable={!loading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Alipay/WeChat QR Code</Text>
            <Pressable
              style={({ pressed }) => [
                styles.uploadArea,
                pressed && !loading && { opacity: 0.6 },
              ]}
              onPress={pickImage}
              disabled={loading}
            >
              {qrImage ? (
                <>
                  <Image source={{ uri: qrImage }} style={styles.qrPreview} />
                  <Text style={styles.uploadText}>Tap to change QR code</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="camera-outline"
                    size={32}
                    color="#000000"
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={styles.uploadText}>
                    Drag and drop or click to upload an image
                  </Text>
                </>
              )}
            </Pressable>
            <Text style={styles.uploadHelper}>
              Max file size: 2.86 MB | Allowed: jpeg, png, jpg
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            loading && styles.continueButtonDisabled,
            pressed && !loading && { opacity: 0.8 },
          ]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue to Checkout</Text>
          )}
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
  },
  orderDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
  helper: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  typeButtonText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  rateDisplay: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  rateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#000000',
    fontSize: 16,
  },
  minAmount: {
    fontSize: 12,
    color: '#666666',
    marginTop: 6,
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
  uploadArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFC107',
  },
  qrPreview: {
    width: 120,
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
  uploadHelper: {
    fontSize: 11,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFC107',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSpacing: {
    height: 30,
  },
});
