# Design Document: Payback SPA Frontend

## Overview

The Payback SPA Frontend is a modern React-based single-page application that provides a fintech dashboard for browsing merchants, activating cashback offers, and tracking wallet earnings. Built with Vite, React, Tailwind CSS, and Axios, the application connects to an existing backend API to deliver a responsive, performant user experience optimized for the Indian market.

### Key Design Goals

1. **Performance**: Fast initial load and smooth interactions using Vite's optimized build system
2. **Responsiveness**: Mobile-first design that scales elegantly from smartphones to desktop displays
3. **User Trust**: Professional fintech aesthetic with clear visual hierarchy and consistent branding
4. **Simplicity**: Straightforward component architecture with minimal state management complexity
5. **Reliability**: Robust error handling and loading states for all asynchronous operations

### Technology Choices

- **Vite + React**: Modern build tooling with fast HMR and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework enabling rapid UI development with consistent design tokens
- **Axios**: Promise-based HTTP client with interceptor support for centralized API configuration
- **Lucide React**: Lightweight, tree-shakeable icon library with consistent design language

## Architecture

### High-Level Architecture

The application follows a traditional client-server architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ Components  │  │    Hooks     │  │   Services  │  │  │
│  │  │  - Header   │  │ - useEffect  │  │  - API      │  │  │
│  │  │  - Wallet   │  │ - useState   │  │    Client   │  │  │
│  │  │  - Merchant │  │              │  │             │  │  │
│  │  │  - Txn List │  │              │  │             │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │ (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (localhost:8080)                    │
│                    /api/v1/*                                 │
│  - GET  /merchants                                           │
│  - GET  /wallet/:id                                          │
│  - POST /merchants/:id/click                                 │
└─────────────────────────────────────────────────────────────┘
```

### Application Structure

```
payback-spa/
├── src/
│   ├── App.jsx                 # Root component with data fetching
│   ├── main.jsx                # Application entry point
│   ├── index.css               # Global styles + Tailwind imports
│   ├── components/
│   │   ├── Header.jsx          # Global navigation header
│   │   ├── WalletDashboard.jsx # Hero section with wallet stats
│   │   ├── MerchantGrid.jsx    # Responsive merchant card grid
│   │   ├── MerchantCard.jsx    # Individual merchant card
│   │   └── TransactionList.jsx # Transaction history table
│   └── services/
│       └── api.js              # Configured Axios instance
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies and scripts
```

### State Management Strategy

The application uses **local component state** with React hooks rather than a global state management library. This decision is based on:

1. **Simplicity**: The application has minimal shared state (wallet data, merchant list)
2. **Data Flow**: Data flows unidirectionally from App.jsx to child components via props
3. **Server as Source of Truth**: All critical data lives on the backend; frontend state is ephemeral
4. **Performance**: No unnecessary re-renders from global state updates

State is managed at the highest necessary level:
- **App.jsx**: Holds wallet data and merchant list (fetched on mount)
- **MerchantCard.jsx**: Holds loading state for individual click tracking
- **Header.jsx**: Stateless presentation component

### Data Flow Pattern

```
1. User opens application
   ↓
2. App.jsx mounts → useEffect triggers
   ↓
3. Promise.all([fetchWallet(), fetchMerchants()])
   ↓
4. setState with fetched data
   ↓
5. Props flow down to child components
   ↓
6. User clicks "Activate Cashback"
   ↓
7. MerchantCard calls trackClick(merchantId)
   ↓
8. API request → Backend updates click_count
   ↓
9. Open merchant URL in new tab
   ↓
10. Optionally refresh merchant data
```

## Components and Interfaces

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── SearchBar
│   └── WalletGlance
├── WalletDashboard
│   ├── StatCard (Total Earned)
│   ├── StatCard (Pending)
│   ├── StatCard (Available)
│   └── WithdrawButton
├── MerchantGrid
│   └── MerchantCard[] (mapped from merchants array)
│       ├── MerchantLogo
│       ├── CashbackBadge
│       └── ActivateButton
└── TransactionList
    └── TransactionRow[] (mapped from transactions array)
        ├── MerchantName
        ├── Date
        ├── Amount
        └── StatusBadge
```

### Component Specifications

#### App.jsx

**Purpose**: Root component responsible for data fetching and orchestration

**State**:
```javascript
{
  wallet: { totalEarned, pending, available } | null,
  merchants: Array<Merchant> | [],
  transactions: Array<Transaction> | [],
  loading: boolean,
  error: string | null
}
```

**Props**: None (root component)

**Key Methods**:
- `fetchData()`: Fetches wallet and merchant data on mount using Promise.all
- `handleMerchantClick(merchantId)`: Tracks click and opens merchant URL

**Lifecycle**:
- `useEffect(() => { fetchData() }, [])`: Fetch data on mount

---

#### Header.jsx

**Purpose**: Global navigation bar with logo, search, and wallet glance

**Props**:
```javascript
{
  availableBalance: number  // From wallet.available
}
```

**Styling**:
- Fixed/sticky positioning at top
- Indigo-600 background with white text
- Flexbox layout: logo (left), search (center), wallet+profile (right)

**Responsive Behavior**:
- Mobile: Hide search bar, show only logo and wallet icon
- Tablet+: Show full layout

---

#### WalletDashboard.jsx

**Purpose**: Hero section displaying wallet statistics

**Props**:
```javascript
{
  wallet: {
    totalEarned: number,
    pending: number,
    available: number
  } | null,
  loading: boolean
}
```

**Layout**:
- Three-column grid on desktop (1 column on mobile)
- Each stat card shows label + large bold number
- Color coding: Emerald (earned), Amber (pending), default (available)

**Loading State**: Skeleton loaders for each stat card

---

#### MerchantGrid.jsx

**Purpose**: Responsive grid container for merchant cards

**Props**:
```javascript
{
  merchants: Array<{
    id: number,
    name: string,
    logoUrl: string,
    cashbackPercentage: number,
    manualTrackingUrl: string,
    clickCount: number
  }>,
  loading: boolean,
  onMerchantClick: (merchantId: number) => void
}
```

**Layout**:
- CSS Grid with responsive columns
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Gap: 1.5rem (24px)

**Loading State**: 6-9 skeleton card loaders

---

#### MerchantCard.jsx

**Purpose**: Individual merchant card with activation button

**Props**:
```javascript
{
  merchant: {
    id: number,
    name: string,
    logoUrl: string,
    cashbackPercentage: number,
    manualTrackingUrl: string,
    clickCount: number
  },
  onActivate: (merchantId: number) => void
}
```

**State**:
```javascript
{
  isActivating: boolean  // Loading state during click tracking
}
```

**Interaction Flow**:
1. User clicks "Activate Cashback" button
2. Set `isActivating = true`
3. Call `onActivate(merchant.id)`
4. On success: Open `manualTrackingUrl` in new tab
5. Set `isActivating = false`
6. On error: Show error toast, set `isActivating = false`

**Styling**:
- White card with subtle shadow
- Centered logo (max height: 80px)
- Cashback badge: Indigo background, white text
- Button: Full width, Indigo-600, disabled state during activation

---

#### TransactionList.jsx

**Purpose**: Display transaction history in table/list format

**Props**:
```javascript
{
  transactions: Array<{
    id: number,
    merchantName: string,
    date: string,
    orderAmount: number,
    cashbackAmount: number,
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED'
  }>
}
```

**Layout**:
- Desktop: Table with columns (Merchant, Date, Order Amount, Cashback, Status)
- Mobile: Stacked card layout

**Status Badge Colors**:
- PENDING: Amber-500 background
- CONFIRMED: Emerald-500 background
- REJECTED: Red-500 background

---

### API Service Interface

#### api.js

**Purpose**: Centralized Axios configuration and API methods

**Configuration**:
```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Exported Methods**:

```javascript
// Fetch wallet data for a user
export const getWallet = async (userId) => {
  const response = await apiClient.get(`/wallet/${userId}`);
  return response.data;
};

// Fetch all merchants
export const getMerchants = async () => {
  const response = await apiClient.get('/merchants');
  return response.data;
};

// Track merchant click
export const trackMerchantClick = async (merchantId) => {
  const response = await apiClient.post(`/merchants/${merchantId}/click`);
  return response.data;
};
```

**Error Handling**:
- Axios interceptors catch network errors
- Errors propagate to calling components
- Components display user-friendly error messages

## Data Models

### Frontend Data Structures

#### Wallet

```javascript
{
  totalEarned: number,      // Total cashback earned (all time)
  pending: number,          // Cashback pending confirmation
  available: number         // Cashback available for withdrawal
}
```

**Source**: GET `/wallet/:id`

**Usage**: Displayed in WalletDashboard and Header (available balance only)

---

#### Merchant

```javascript
{
  id: number,                    // Unique merchant identifier
  name: string,                  // Merchant display name
  logoUrl: string,               // URL to merchant logo image
  cashbackPercentage: number,    // Cashback rate (e.g., 10 for 10%)
  manualTrackingUrl: string,     // Affiliate tracking URL
  clickCount: number             // Number of times clicked (for sorting)
}
```

**Source**: GET `/merchants`

**Usage**: Displayed in MerchantGrid as MerchantCard components

**Sorting**: Merchants sorted by `clickCount` DESC (most popular first)

---

#### Transaction

```javascript
{
  id: number,                    // Unique transaction identifier
  merchantName: string,          // Name of merchant
  date: string,                  // ISO 8601 date string
  orderAmount: number,           // Total order value
  cashbackAmount: number,        // Cashback earned
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED'
}
```

**Source**: GET `/transactions/:userId` (future endpoint)

**Usage**: Displayed in TransactionList

**Status Meanings**:
- **PENDING**: Tracked by affiliate network, awaiting merchant confirmation
- **CONFIRMED**: Merchant confirmed, cashback added to available balance
- **REJECTED**: Order cancelled/returned, cashback revoked

---

### Data Transformation

The frontend receives data from the backend API and may need to transform it for display:

**Currency Formatting**:
```javascript
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};
```

**Date Formatting**:
```javascript
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
```

**Percentage Display**:
```javascript
const formatCashback = (percentage) => {
  return `${percentage}% Cashback`;
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following patterns of redundancy:

1. **Error Handling Consolidation**: Requirements 5.4, 7.4, 8.4, 11.2, and 11.3 all specify error notifications for different failure scenarios. These can be consolidated into a single comprehensive error handling property.

2. **Loading State Consolidation**: Requirements 5.2, 7.2, and 11.1 all specify loading indicators during async operations. These can be consolidated into a single loading state property.

3. **Data Display Consolidation**: Requirements 5.3 and 7.3 both specify that fetched data should be displayed. These are covered by more specific properties about rendering individual items.

4. **Status Badge Color Consolidation**: Requirements 9.4, 9.5, and 9.6 specify colors for different transaction statuses. These can be consolidated into a single property about status-to-color mapping.

The following properties represent the unique, non-redundant testable behaviors of the system:

### Property 1: API Error Propagation

*For any* API request that results in an error response from the backend, the error should propagate to the calling component without being silently swallowed.

**Validates: Requirements 2.4**

---

### Property 2: Loading State Visibility

*For any* asynchronous data fetch operation (wallet, merchants, click tracking), the UI should display a loading indicator while the operation is in progress.

**Validates: Requirements 5.2, 7.2, 11.1, 11.4**

---

### Property 3: Error Notification Display

*For any* failed API request (network error, timeout, server error), the application should display a user-visible error notification with appropriate error details.

**Validates: Requirements 5.4, 7.4, 8.4, 11.2, 11.3**

---

### Property 4: Wallet Data Rendering

*For any* valid wallet data object received from the API, the WalletDashboard should display all three values (totalEarned, pending, available) in the UI.

**Validates: Requirements 5.3**

---

### Property 5: Merchant Card Completeness

*For any* merchant object in the merchants array, the rendered MerchantCard should contain the merchant logo, cashback percentage badge, and activation button.

**Validates: Requirements 6.4**

---

### Property 6: Merchant Data Rendering

*For any* valid merchants array received from the API, the MerchantGrid should render a MerchantCard for each merchant in the array.

**Validates: Requirements 7.3**

---

### Property 7: Click Tracking API Call

*For any* merchant card, when the "Activate Cashback" button is clicked, a POST request should be sent to `/api/v1/merchants/{id}/click` with the correct merchant ID.

**Validates: Requirements 8.1**

---

### Property 8: Tracking URL Navigation

*For any* merchant with a manualTrackingUrl, when click tracking succeeds, the application should open that URL in a new browser tab.

**Validates: Requirements 8.2**

---

### Property 9: Post-Click State Update

*For any* successful click tracking operation, the application should either update the local merchant data or refresh the merchant list from the backend.

**Validates: Requirements 8.3**

---

### Property 10: Click Debouncing

*For any* merchant card, if a click tracking request is already in progress, subsequent clicks on the same merchant's activation button should be prevented until the first request completes.

**Validates: Requirements 8.5**

---

### Property 11: Transaction Field Display

*For any* transaction object in the transactions array, the rendered transaction row should display the merchant name, date, order amount, and cashback amount.

**Validates: Requirements 9.2**

---

### Property 12: Transaction Status Color Mapping

*For any* transaction with a status field, the status badge should display the correct color: PENDING → Amber-500, CONFIRMED → Emerald-500, REJECTED → error color (red).

**Validates: Requirements 9.4, 9.5, 9.6**

---

### Property 13: Currency Formatting Consistency

*For any* numeric currency value displayed in the UI (wallet amounts, transaction amounts), the value should be formatted with bold, large typography.

**Validates: Requirements 12.2**

---

### Property 14: Retry Mechanism Availability

*For any* failed operation, the application should provide a mechanism (button, link, or automatic retry) for the user to retry the operation.

**Validates: Requirements 11.5**

---

## Error Handling

### Error Categories

The application handles three primary categories of errors:

1. **Network Errors**: Connection failures, DNS resolution failures, CORS issues
2. **HTTP Errors**: 4xx client errors, 5xx server errors
3. **Timeout Errors**: Requests exceeding the configured timeout (10 seconds)

### Error Handling Strategy

#### API Layer (api.js)

The API service uses Axios interceptors to catch and standardize errors:

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error structure
    const standardError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(standardError);
  }
);
```

**Error Propagation**: All errors are propagated to calling components via rejected promises. The API layer does not suppress or silently handle errors.

#### Component Layer

Components use try-catch blocks to handle errors from API calls:

```javascript
try {
  const data = await getWallet(userId);
  setWallet(data);
} catch (error) {
  setError(error.message);
  showErrorToast(error.message);
}
```

**User Feedback**: All errors result in user-visible feedback via:
- Toast notifications (temporary, non-blocking)
- Error messages in the UI (persistent until resolved)
- Retry buttons for recoverable errors

#### Specific Error Scenarios

**Wallet Fetch Failure**:
- Display error toast: "Failed to load wallet data"
- Show retry button in WalletDashboard
- Maintain previous wallet data if available

**Merchant Fetch Failure**:
- Display error toast: "Failed to load merchants"
- Show retry button in MerchantGrid
- Display empty state with retry option

**Click Tracking Failure**:
- Display error toast: "Failed to activate cashback"
- Reset button state (remove loading indicator)
- Do not open merchant URL
- Allow user to retry immediately

**Network Timeout**:
- Display error toast: "Request timed out. Please check your connection."
- Provide retry button
- Log timeout for debugging

### Error Recovery

**Automatic Retry**: Not implemented in MVP (to avoid overwhelming the backend)

**Manual Retry**: All failed operations provide a retry button or mechanism:
- Wallet: "Retry" button in error state
- Merchants: "Retry" button in error state
- Click tracking: User can click "Activate Cashback" again

**Graceful Degradation**:
- If wallet fails to load, show "—" or "N/A" in wallet glance
- If merchants fail to load, show empty state with explanation
- Application remains functional even if some data fails to load

### Error Logging

**Console Logging**: All errors are logged to the browser console for debugging:
```javascript
console.error('Wallet fetch failed:', error);
```

**Future Enhancement**: Integration with error tracking service (e.g., Sentry) for production monitoring.

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests and property-based tests to ensure comprehensive coverage of both specific scenarios and general correctness properties.

### Testing Tools

**Unit Testing**:
- **Vitest**: Fast, Vite-native test runner with Jest-compatible API
- **React Testing Library**: Component testing focused on user behavior
- **MSW (Mock Service Worker)**: API mocking for integration tests

**Property-Based Testing**:
- **fast-check**: JavaScript property-based testing library
- **Configuration**: Minimum 100 iterations per property test
- **Tagging**: Each test references its design document property

### Unit Testing Approach

Unit tests focus on specific examples, edge cases, and integration points:

#### Component Tests

**Header.jsx**:
- Renders logo with "Payback" text
- Displays wallet balance when provided
- Handles missing wallet data gracefully
- Renders profile icon

**WalletDashboard.jsx**:
- Displays all three wallet stats when data is provided
- Shows loading skeletons when loading=true
- Formats currency correctly (INR format)
- Displays error state with retry button

**MerchantCard.jsx**:
- Renders merchant logo, name, and cashback badge
- Disables button during activation (isActivating=true)
- Calls onActivate with correct merchant ID
- Handles missing logo URL gracefully

**TransactionList.jsx**:
- Renders transaction rows for each transaction
- Displays correct status badge colors
- Formats dates in Indian locale
- Handles empty transaction list

#### API Service Tests

**api.js**:
- Configures correct baseURL
- Includes proper headers
- Propagates errors without modification
- Handles timeout scenarios

#### Integration Tests

**App.jsx**:
- Fetches wallet and merchants on mount
- Displays loading states during fetch
- Handles fetch errors with error notifications
- Passes correct props to child components
- Tracks merchant clicks and opens URLs

### Property-Based Testing Approach

Property tests verify universal properties across randomized inputs:

#### Property Test Configuration

```javascript
import fc from 'fast-check';

// Example property test structure
describe('Property Tests', () => {
  it('Property 1: API Error Propagation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 400, max: 599 }), // Random HTTP error code
        fc.string(), // Random error message
        async (statusCode, errorMessage) => {
          // Test that errors propagate correctly
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations
    );
  });
});
```

#### Property Test Suite

**Property 1: API Error Propagation**
- **Feature**: payback-spa-frontend, Property 1: API Error Propagation
- **Generator**: Random HTTP error codes (400-599), random error messages
- **Assertion**: Error reaches calling component unchanged

**Property 2: Loading State Visibility**
- **Feature**: payback-spa-frontend, Property 2: Loading State Visibility
- **Generator**: Random async operation types (wallet, merchants, click)
- **Assertion**: Loading indicator visible during operation

**Property 3: Error Notification Display**
- **Feature**: payback-spa-frontend, Property 3: Error Notification Display
- **Generator**: Random error types (network, timeout, server)
- **Assertion**: Error notification appears with error details

**Property 4: Wallet Data Rendering**
- **Feature**: payback-spa-frontend, Property 4: Wallet Data Rendering
- **Generator**: Random wallet objects with valid number values
- **Assertion**: All three values (totalEarned, pending, available) appear in DOM

**Property 5: Merchant Card Completeness**
- **Feature**: payback-spa-frontend, Property 5: Merchant Card Completeness
- **Generator**: Random merchant objects with all required fields
- **Assertion**: Card contains logo, badge, and button

**Property 6: Merchant Data Rendering**
- **Feature**: payback-spa-frontend, Property 6: Merchant Data Rendering
- **Generator**: Random arrays of merchant objects (0-50 merchants)
- **Assertion**: Number of rendered cards equals array length

**Property 7: Click Tracking API Call**
- **Feature**: payback-spa-frontend, Property 7: Click Tracking API Call
- **Generator**: Random merchant IDs (1-10000)
- **Assertion**: POST request sent to correct endpoint with correct ID

**Property 8: Tracking URL Navigation**
- **Feature**: payback-spa-frontend, Property 8: Tracking URL Navigation
- **Generator**: Random valid URLs
- **Assertion**: window.open called with correct URL and '_blank' target

**Property 9: Post-Click State Update**
- **Feature**: payback-spa-frontend, Property 9: Post-Click State Update
- **Generator**: Random merchant data before/after click
- **Assertion**: Merchant data changes after successful click

**Property 10: Click Debouncing**
- **Feature**: payback-spa-frontend, Property 10: Click Debouncing
- **Generator**: Random number of rapid clicks (2-10)
- **Assertion**: Only one API request sent despite multiple clicks

**Property 11: Transaction Field Display**
- **Feature**: payback-spa-frontend, Property 11: Transaction Field Display
- **Generator**: Random transaction objects with all required fields
- **Assertion**: All fields (merchant, date, amounts) appear in DOM

**Property 12: Transaction Status Color Mapping**
- **Feature**: payback-spa-frontend, Property 12: Transaction Status Color Mapping
- **Generator**: Random transaction status (PENDING, CONFIRMED, REJECTED)
- **Assertion**: Badge has correct color class for status

**Property 13: Currency Formatting Consistency**
- **Feature**: payback-spa-frontend, Property 13: Currency Formatting Consistency
- **Generator**: Random currency values (0-1000000)
- **Assertion**: Formatted value has bold and large typography classes

**Property 14: Retry Mechanism Availability**
- **Feature**: payback-spa-frontend, Property 14: Retry Mechanism Availability
- **Generator**: Random error scenarios
- **Assertion**: Retry button or mechanism exists in error state

### Test Data Generators

Property tests require generators for creating random test data:

```javascript
// Wallet generator
const walletArbitrary = fc.record({
  totalEarned: fc.float({ min: 0, max: 100000 }),
  pending: fc.float({ min: 0, max: 50000 }),
  available: fc.float({ min: 0, max: 50000 })
});

// Merchant generator
const merchantArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  logoUrl: fc.webUrl(),
  cashbackPercentage: fc.float({ min: 0.5, max: 20 }),
  manualTrackingUrl: fc.webUrl(),
  clickCount: fc.integer({ min: 0, max: 100000 })
});

// Transaction generator
const transactionArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 100000 }),
  merchantName: fc.string({ minLength: 3, maxLength: 50 }),
  date: fc.date().map(d => d.toISOString()),
  orderAmount: fc.float({ min: 100, max: 50000 }),
  cashbackAmount: fc.float({ min: 10, max: 5000 }),
  status: fc.constantFrom('PENDING', 'CONFIRMED', 'REJECTED')
});
```

### Testing Balance

**Unit Tests**: Focus on specific examples and edge cases
- Example: Empty merchant list displays "No merchants available"
- Example: Wallet with zero balance displays "₹0"
- Edge case: Merchant with missing logo shows placeholder
- Edge case: Transaction with invalid date shows "Invalid Date"

**Property Tests**: Focus on universal properties across all inputs
- Property: Any valid wallet data renders all three values
- Property: Any merchant array renders correct number of cards
- Property: Any error triggers error notification

**Complementary Coverage**: Together, unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across the input space.

### Test Execution

**Development**:
```bash
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

**CI/CD**:
- All tests run on every commit
- Property tests run with 100 iterations minimum
- Coverage threshold: 80% for statements, branches, functions

### Future Testing Enhancements

1. **Visual Regression Testing**: Capture screenshots and detect unintended UI changes
2. **E2E Testing**: Full user journey tests with Playwright or Cypress
3. **Performance Testing**: Measure and track component render times
4. **Accessibility Testing**: Automated a11y checks with axe-core

