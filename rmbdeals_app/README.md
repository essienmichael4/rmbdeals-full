# RMB Deals Mobile App - TypeScript Edition

A React Native Expo mobile application for the RMB Deals currency exchange platform, built with **TypeScript**.

## 🚀 Features

- ✅ **Full TypeScript Support** - Strong type safety across all components
- ✅ **Authentication** - Login and Register screens
- ✅ **Home Dashboard** - Exchange rates, features, and transaction journey
- ✅ **Order Management** - Place, view, and manage orders
- ✅ **User Profile** - Edit profile, account settings, and contact info
- ✅ **Image Upload** - QR code upload for transactions
- ✅ **Dark Theme** - Modern dark UI matching RMB Deals branding

## 📁 Project Structure

```
RmbDealsApp/
├── App.tsx                          # Main app component with auth context
├── tsconfig.json                    # TypeScript configuration
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── types/
│   └── index.ts                     # TypeScript type definitions
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx          # Login screen
│   │   └── RegisterScreen.tsx       # Registration screen
│   └── main/
│       ├── HomeScreen.tsx           # Home/Dashboard screen
│       ├── BuyScreen.tsx            # Order placement screen
│       ├── OrdersScreen.tsx         # Orders management screen
│       └── ProfileScreen.tsx        # User profile screen
```

## 📦 Installation

1. Navigate to the project directory:
```bash
cd RmbDealsApp
```

2. Install dependencies:
```bash
npm install
```

> **Note:** The first installation may take a few minutes as it downloads all dependencies for React Native and Expo.

## 🏃 Running the App

### Start the dev server:
```bash
npm start
```

### Run on Android:
```bash
npm run android
```

### Run on iOS:
```bash
npm run ios
```

### Run on Web:
```bash
npm run web
```

## 🔧 Type Checking

To check TypeScript types without building:
```bash
npm run type-check
```

## 📝 Type Definitions

All type definitions are centralized in `types/index.ts` and include:

- **Navigation Types** - `RootStackParamList`, `AuthStackParamList`, `MainTabParamList`
- **User Types** - `User` interface
- **Order Types** - `Order` interface
- **Transaction Types** - `Transaction` interface
- **Auth Context** - `AuthContextType` interface

## 🎨 Styling

- Dark theme with primary color `#0f3460`
- Secondary color `#16213e`
- Background color `#1a1a2e`
- All styles use React Native's `StyleSheet.create()` for optimization

## 🔐 Authentication

- Context API for state management
- AsyncStorage for persisting user tokens
- Automatic redirect based on authentication state

## 📱 Responsive Design

- Optimized for mobile screens
- Touch-friendly buttons and inputs
- Adaptive layouts for different screen sizes
- KeyboardAvoidingView for better input handling

## 🚀 Next Steps

1. Connect API endpoints:
   - Update `TODO: API call` placeholders in screens with actual API calls
   - Configure baseURL in axios or fetch interceptors

2. Environment variables:
   - Create `.env` file with API configuration
   - Use dotenv or expo-constants for managing secrets

3. Testing:
   - Add Jest tests for components
   - Add E2E tests with Detox

4. Build for production:
   - Configure Android build: `eas build --platform android`
   - Configure iOS build: `eas build --platform ios`

## 📚 Documentation

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation Docs](https://reactnavigation.org)
- [TypeScript Docs](https://www.typescriptlang.org)

## 📄 License

Proprietary - RMB Deals Group
