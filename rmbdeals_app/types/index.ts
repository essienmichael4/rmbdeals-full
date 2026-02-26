// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Checkout: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Buy: undefined;
  Orders: undefined;
  Profile: undefined;
  ChangePassword: undefined;
};

// Auth context types
export interface AuthContextType {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
}

export interface AuthType {
  id: string;
  email: string;
  name: string;
  token?: string;
  [key: string]: any;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: 'Personal' | 'Business';
}

// Order types
export interface Order {
  id: string;
  date: string;
  amount: number;
  currency: 'GHS' | 'NGN' | 'CFC';
  rmbAmount: number;
  status: 'Processing' | 'Completed' | 'Pending' | 'Cancelled';
  recipient: string;
  createdAt: string;
}

// Transaction types
export interface Transaction {
  type: 'BUY' | 'SELL';
  accountType: 'Personal' | 'Business';
  currency: 'GHS' | 'NGN' | 'CFC';
  amount: number;
  rmbAmount: number;
  recipientName: string;
  qrImageUri?: string;
}

export type Currency = {
  rate: number,
  label: string,
  description: string,
  currency: string
}


