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
│  - GET  /merchants/:id/click                                 │
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

// Track merchant click — GET endpoint, returns redirect URL in response body
export const trackMerchantClick = async (merchantId) => {
  const response = await apiClient.get(`/merchants/${merchantId}/click`);
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
  cashbackRate: number,          // Cashback rate (e.g., 10 for 10%)
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

*For any* merchant card, when the "Shop Now →" button is clicked, a GET request should be sent to `/api/v1/merchants/{id}/click` with the correct merchant ID, and the URL returned in the response body should be opened in a new tab. If the response URL is null, a toast error "Merchant link not available yet." should be shown.

**Validates: Requirements 8.1**

---

### Property 8: Tracking URL Navigation

*For any* merchant, when click tracking succeeds and the response contains a non-null URL, the application should open that URL in a new browser tab.

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


---

## Design Additions: Requirements 13–22

### Design System Upgrade (Req 13)

#### Color Tokens

All colors are defined as CSS custom properties in `index.css` and referenced via Tailwind config:

```css
:root {
  --color-primary:   #FF4D00;  /* orange-red — replaces Indigo-600 everywhere */
  --color-secondary: #1A1A2E;  /* deep navy */
  --color-accent:    #FFD700;  /* gold */
  --color-success:   #10B981;  /* Emerald-500 */
  --color-warning:   #F59E0B;  /* Amber-500 */
}
```

`tailwind.config.js` maps these tokens so Tailwind utilities like `bg-primary`, `text-secondary`, `border-accent` work throughout the app.

#### Typography

Loaded via `<link>` in `index.html` (Google Fonts):
- **Sora** — headings (`font-heading`)
- **DM Sans** — body text (`font-body`)

`index.css` applies `font-family: 'DM Sans', sans-serif` to `body` and `font-family: 'Sora', sans-serif` to heading elements.

---

### Hero Section (Req 14)

**Component**: `src/components/HeroSection/HeroSection.jsx`

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│  Diagonal gradient: #1A1A2E → #FF4D00                    │
│                                                          │
│  "Shop Smart. Earn Real Cashback."  [Sora, white]        │
│                                                          │
│  [Explore Stores →]   [How It Works]                     │
│                                                          │
│  ── Stats bar: 500+ Stores | ₹2Cr+ Paid | 1L+ Users ──  │
│                                                          │
│  Floating badges: ₹127  ₹250  ₹89  (CSS keyframe float) │
└──────────────────────────────────────────────────────────┘
```

**Floating badges**: CSS `@keyframes float` defined in `HeroSection.module.css`, each badge has a different `animation-delay` for staggered motion.

**CTAs**:
- "Explore Stores →" → `document.getElementById('merchant-grid').scrollIntoView()`
- "How It Works" → `document.getElementById('how-it-works').scrollIntoView()`

---

### Category Filter (Req 15)

**Component**: `src/components/CategoryPills/CategoryPills.jsx`

**State** (lifted to App.jsx): `activeCategory: string | null`

**Categories** (static): `['Fashion', 'Electronics', 'Home', 'Beauty', 'Travel', 'Food', 'Health', 'Education']`

**Filtering logic** (in App.jsx):
```javascript
const filteredMerchants = activeCategory
  ? merchants.filter(m => m.category === activeCategory)
  : merchants;
```

**Scrollbar hiding**: `CategoryPills.module.css` utility class:
```css
.scrollContainer {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}
.scrollContainer::-webkit-scrollbar { display: none; }
```

---

### Enhanced Merchant Card (Req 16)

**Changes to existing `MerchantCard.jsx`**:

- Cashback badge text changes to `"Upto {cashbackRate}% Cashback"` in orange pill (field is `cashbackRate`, not `cashbackPercentage`)
- Offer tag sourced from a static map in `src/utils/offerTags.js`:
  ```javascript
  export const OFFER_TAGS = {
    1: 'Sale Live',
    2: 'Trending',
    // ... keyed by merchant id
  };
  ```
  Rendered as a teal chip; omitted if no entry exists.
- Hover lift: CSS Module class with `transform: translateY(-4px); box-shadow: var(--shadow-xl);`
- Gold ribbon badge: `FEATURED_IDS.includes(merchant.id)` checked against `export const FEATURED_IDS = [1, 5, 6]` in `src/utils/offerTags.js` — no `featured` field expected from API
- Button text changes to `"Shop Now →"`; hover fills `bg-primary`
- Click flow: `GET /api/v1/merchants/{id}/click` → open URL returned in response body; if response URL is null, show toast "Merchant link not available yet." Do not use `manualTrackingUrl` (it is null on all merchants).

---

### How It Works Section (Req 17)

**Component**: `src/components/HowItWorks/HowItWorks.jsx`

**Layout**:
```
id="how-it-works"
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Search  │  │  Click   │  │  Earn    │
│  icon    │  │  icon    │  │  icon    │
│ Find a   │  │ Click &  │  │  Earn    │
│  Store   │  │  Shop    │  │ Cashback │
└──────────┘  └──────────┘  └──────────┘
  (horizontal on desktop, vertical stack on mobile)
```

**Animation**: `IntersectionObserver` adds a `is-visible` class when the section enters the viewport. `HowItWorks.module.css` defines:
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.step { opacity: 0; }
.step.is-visible { animation: fadeInUp 0.5s ease forwards; }
```
Each step has a staggered `animation-delay`.

---

### Enhanced Wallet Dashboard (Req 18)

**Replaces** the 3-card layout with a **single unified `WalletCard`**.

**Layout**:
```
┌─────────────────────────────────────────┐
│  gradient: #1A1A2E → #2D4A6E            │
│                                         │
│  Available for Payout                   │
│  ₹ [count-up animated number]           │
│                                         │
│  Total Earned: ₹xxx   Pending: ₹xxx     │
└─────────────────────────────────────────┘
```

**Count-up**: vanilla JS `requestAnimationFrame` loop in a `useEffect`, animating from 0 to the target value over ~1 second.

**Error state**: renders `<WifiOff />` icon (lucide) + "Could not load balance" text.

**Skeleton**: single card-shaped shimmer while loading.

---

### Toast Notification System (Req 19)

**Files**:
- `src/context/ToastContext.jsx` — provides `ToastContext`
- `src/hooks/useToast.js` — `const { showToast } = useToast()`
- `src/components/Toast/Toast.jsx` — renders the toast UI

**Context shape**:
```javascript
{
  showToast: (message: string, variant: 'success' | 'error' | 'info') => void
}
```

**Positioning**: `position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 50`

**Auto-dismiss**: `setTimeout(() => removeToast(id), 3000)` in context

**Animation**: `Toast.module.css` keyframe:
```css
@keyframes slideIn {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
```

**Variant colors**: success → green-600, error → red-600, info → blue-600

---

### Mobile Navigation (Req 20)

**Component**: `src/components/MobileBottomNav/MobileBottomNav.jsx`

**Visibility**: `block md:hidden` (Tailwind)

**Tabs**: Home (`Home` icon), Stores (`Store` icon), Wallet (`Wallet` icon), Profile (`User` icon — placeholder, no action)

**Active tab**: `text-primary` + `border-t-2 border-primary`

**Styling**: `fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg`

---

### Render Cold Start Handling (Req 21)

**Flow** (in App.jsx `useEffect`):

```
1. Call getHealth() with a 3s timeout threshold
2. If no response within 3s → show "Waking up server..." banner
3. Poll getHealth() every 2s until success
4. On success → hide banner → call fetchData()
```

**UI**: A dismissible banner below the Header, not a modal. Disappears automatically on health check success.

---

### API Service Layer (Req 22)

**Additions to `src/services/api.js`**:

```javascript
export const getHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
```

All existing exports (`getWallet`, `getMerchants`, `trackMerchantClick`) remain. No second Axios instance is created.

---

### Updated Component Hierarchy

```
App
├── ToastProvider (wraps everything)
├── Header
├── HeroSection
├── CategoryPills          ← new
├── WalletCard (unified)   ← replaces 3-card layout
├── MerchantGrid
│   └── MerchantCard[]     ← enhanced
├── HowItWorks             ← new
├── TransactionList
└── MobileBottomNav        ← new (mobile only)
```

### Updated Correctness Properties

**Property 15: Toast Trigger from Any Component**
Any component calling `showToast(message, variant)` via `useToast` should result in a visible toast at bottom-right within one render cycle.
*Validates: Req 19.1, 19.6*

**Property 16: Category Filter Completeness**
For any active category, the rendered merchant count should equal the count of merchants whose `category` field matches the active category.
*Validates: Req 15.3, 15.6*

**Property 17: Health Poll Progression**
If `getHealth()` fails N times then succeeds, the "Waking up server..." banner should be visible during all N failures and hidden after the success.
*Validates: Req 21.1, 21.3, 21.4*

**Property 18: Count-Up Accuracy**
For any wallet `available` value, the count-up animation should end at exactly that value (no rounding or truncation).
*Validates: Req 18.3*


---

## Design Additions: Requirements 23–31 (UI Redesign)

### Design System Reset (Req 23)

#### New Color Tokens

```css
/* index.css — replaces existing custom properties */
:root {
  --color-primary:    #10B981;  /* emerald-500 */
  --color-bg:         #F8FAFC;  /* slate-50 */
  --color-surface:    #FFFFFF;  /* white */
  --color-text:       #0F172A;  /* slate-900 */
  --color-text-muted: #64748B;  /* slate-500 */
  --color-border:     #E2E8F0;  /* slate-200 */
}
```

`tailwind.config.js` updates:
```javascript
colors: {
  primary:   '#10B981',  // emerald-500
  secondary: '#0F172A',  // slate-900
  accent:    '#FFD700',  // gold (kept)
  success:   '#10B981',
  warning:   '#F59E0B',
}
```

Font: Inter loaded via Google Fonts `<link>` in `index.html`. Applied to `body` in `index.css`.

**Constraint**: `src/services/api.js`, `src/context/ToastContext.jsx`, `src/utils/merchantCategories.js`, `src/utils/offerTags.js` — untouched.

---

### Navbar Redesign (Req 24)

**Component**: `src/components/Header/Header.jsx` (replace existing)

**Scroll behavior**: `useEffect` adds a `scroll` event listener; sets `scrolled` state when `window.scrollY > 10`.

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  [💚 Payback]   [🔍 Search AI tools...]   [₹10,000 | Sign In | Join Now] │
└──────────────────────────────────────────────────────────────┘
```

**Class logic**:
```javascript
const navClass = scrolled
  ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3'
  : 'bg-white py-5';
```

**Balance chip**: `bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-sm font-semibold`

**Sign In button**: `border border-slate-200 text-slate-700 rounded-full px-4 py-2 text-sm hover:border-emerald-500 hover:text-emerald-600`

**Join Now button**: `bg-emerald-500 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-emerald-600`

---

### Hero Section Redesign (Req 25)

**Component**: `src/components/HeroSection/HeroSection.jsx` (replace existing)

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  bg-slate-50 py-20 lg:py-32                                 │
│                                                             │
│  LEFT COLUMN                    RIGHT COLUMN                │
│  ─────────────                  ─────────────               │
│  "Shop Smart.                   ┌──────────────────────┐    │
│   Earn Real                     │  Live Cashback  LIVE │    │
│   Cashback."                    │  ─────────────────── │    │
│                                 │  👤 ChatGPT  +₹300  │    │
│  subtitle text                  │  👤 Notion   +₹180  │    │
│                                 │  👤 Canva    +₹400  │    │
│  [Explore Stores →]             └──────────────────────┘    │
│                                                             │
│  👤👤👤 +1L users saving today                              │
└─────────────────────────────────────────────────────────────┘
```

**Live Activity card data source**: `transactions` prop (last 3 from `wallet.transactions`). If empty, show placeholder rows with merchant names from `MOCK_MERCHANTS` in `src/utils/mockData.js`.

**Avatar circles**: 3 small overlapping `w-8 h-8 rounded-full bg-emerald-100` divs with initials.

**"Cashback" word**: wrapped in `<span className="text-emerald-500">` inside the headline.

**No floating badges** — removed in this redesign.

---

### Merchant Card Redesign (Req 26)

**Component**: `src/components/MerchantCard/MerchantCard.jsx` (replace existing)

**Key structural change — hover overlay**:
```jsx
<div className="... group relative overflow-hidden">
  {/* Normal card content */}
  <div className="...card body...">...</div>

  {/* Hover overlay */}
  <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 
                  transition-opacity rounded-3xl flex items-center justify-center">
    <button className="bg-white text-emerald-600 font-bold px-6 py-3 rounded-full">
      Shop Now →
    </button>
  </div>
</div>
```

**Logo container**: `w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden`

**Cashback display**: `<p className="text-emerald-500 font-bold text-xl">Upto {cashbackRate}% Cashback</p>`

**Offer tag**: `bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full`

**Featured ribbon**: unchanged — `FEATURED_IDS.includes(merchant.id)` from `src/utils/offerTags.js`

**Click logic**: unchanged — `GET /api/v1/merchants/{id}/click` → open URL

---

### Wallet Card Redesign (Req 27)

**Component**: `src/components/WalletCard/WalletCard.jsx` (replace existing)

**Layout**:
```
┌──────────────────────────────────────────────┐
│  bg-white rounded-3xl border border-slate-200 │
│  shadow-sm p-8                                │
│                                               │
│  💚 My Wallet                                 │
│                                               │
│  ₹10,000.00   ← text-5xl font-bold emerald   │
│  Available for Payout                         │
│                                               │
│  [Total Earned: ₹12,500]  [Pending: ₹2,500]  │
│   bg-emerald-50 text-emerald-700              │
│                              bg-amber-50 text-amber-700 │
└──────────────────────────────────────────────┘
```

**Count-up**: same `requestAnimationFrame` approach, targeting `available` value.

**Skeleton**: single card-shaped shimmer, same dimensions as the card.

**Error state**: `WifiOff` icon + "Could not load balance" — same as before, but on white card.

---

### Transaction History Redesign (Req 28)

**Component**: `src/components/TransactionList/TransactionList.jsx` (replace existing)

**Desktop layout** (table):
```
┌──────────────────────────────────────────────────────────────┐
│  bg-white rounded-3xl border border-slate-200 overflow-hidden │
│                                                              │
│  MERCHANT    DATE    ORDER AMT    CASHBACK    STATUS         │  ← bg-slate-50 header
│  ──────────────────────────────────────────────────────────  │
│  ChatGPT     10 Mar  ₹1,999       ₹300       CONFIRMED      │  ← hover:bg-slate-50
│  Notion      8 Mar   ₹1,499       ₹180       PENDING        │
└──────────────────────────────────────────────────────────────┘
```

**Mobile layout** (cards): each transaction becomes a `bg-white rounded-2xl border border-slate-100 p-4` card with merchant + date on top row, amounts + status on bottom row.

**Status badge classes**:
```javascript
const STATUS_STYLES = {
  PENDING:   'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-emerald-50 text-emerald-700',
  REJECTED:  'bg-red-50 text-red-700',
};
```

---

### How It Works Redesign (Req 29)

**Component**: `src/components/HowItWorks/HowItWorks.jsx` (replace existing)

**Layout**:
```
bg-white py-24 border-y border-slate-200

  Step 1              Step 2              Step 3
  ① [Search icon]     ② [Click icon]      ③ [Wallet icon]
  Find a Store        Click & Shop        Earn Cashback
  Browse 500+         Click activate      Cashback lands
  stores...           and shop...         in your wallet...
```

**Number circle**: `w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center`

**Animation**: same `IntersectionObserver` + `fadeInUp` CSS Module keyframe, staggered delays.

---

### Footer (Req 30)

**Component**: `src/components/Footer/Footer.jsx` (new file)

**Layout**:
```
bg-white py-20

  [💚 Payback]          Platform    Categories    Support    Legal
  India's #1 cashback   Merchants   AI Tools      Help       Privacy
  platform for AI       Wallet      Productivity  Contact    Terms
  tools & more.         Transactions Learning     Blog       Cookies

  ─────────────────────────────────────────────────────────────────
  © 2026 Payback India. All rights reserved.
```

**Column structure**: `grid grid-cols-2 md:grid-cols-5 gap-8`

**Link style**: `text-slate-500 hover:text-emerald-600 transition-colors text-sm`

**Logo**: same emerald Wallet icon + "Payback" text as Header

---

### Mobile Bottom Nav Update (Req 31)

**Component**: `src/components/MobileBottomNav/MobileBottomNav.jsx` (update existing)

**Only changes**:
- Active tab: `text-emerald-500 border-t-2 border-emerald-500` (was `text-primary border-primary`)
- Container: `border-t border-slate-200` (was `border-gray-200`)

**No structural changes** — tabs, icons, scroll behavior all unchanged.

---

### Updated Component Hierarchy (Post-Redesign)

```
App
├── ToastProvider
├── Header              ← redesigned (scroll-aware, emerald)
├── HeroSection         ← redesigned (two-column, Live Activity card)
├── main
│   ├── WalletCard      ← redesigned (white card, emerald balance)
│   ├── CategoryPills   ← unchanged
│   ├── MerchantGrid
│   │   └── MerchantCard[]  ← redesigned (hover overlay, emerald)
│   ├── TransactionList ← redesigned (clean table/card)
│   └── HowItWorks      ← redesigned (white bg, emerald numbers)
├── Footer              ← new
└── MobileBottomNav     ← updated (emerald active state)
```

### New Correctness Properties

**Property 19: Scroll-Aware Navbar**
When `window.scrollY > 10`, the Header should have backdrop-blur and border-b classes applied; when at top, these should be absent.
*Validates: Req 24.3*

**Property 20: Live Activity Fallback**
When the transactions array is empty, the Live Activity card should render exactly 3 placeholder rows.
*Validates: Req 25.9*

**Property 21: Hover Overlay Visibility**
The MerchantCard hover overlay should have `opacity-0` by default and `group-hover:opacity-100` on hover.
*Validates: Req 26.7*


---

## Design Additions: Auth Pages (Requirements 32–37)

### Auth API Methods (Req 32)

**File**: `src/services/api.js` (additions only — no second Axios instance)

```javascript
// POST /api/v1/auth/register
export const registerUser = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data; // { token, user }
};

// POST /api/v1/auth/login
export const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data; // { token, user }
};
```

**Updated `getWallet`**:
```javascript
export const getWallet = async (token = null) => {
  if (token) {
    const response = await apiClient.get('/wallet/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
  const response = await apiClient.get('/wallet/1');
  return response.data;
};
```

---

### Auth Context (Req 33)

**File**: `src/context/AuthContext.jsx`

**Context shape**:
```javascript
{
  user: { id, name, email, firstName } | null,
  token: string | null,
  isAuthenticated: boolean,
  login: (email, password) => Promise<void>,
  register: (name, email, password) => Promise<void>,
  logout: () => void
}
```

**JWT decode** (no library — uses `atob`):
```javascript
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};
```

**Initialization** (on mount):
```javascript
useEffect(() => {
  const stored = localStorage.getItem('payback_token');
  if (stored) {
    const decoded = decodeToken(stored);
    if (decoded) {
      setToken(stored);
      setUser({ ...decoded, firstName: decoded.name?.split(' ')[0] });
    }
  }
}, []);
```

**`login()` flow**:
1. Call `loginUser(email, password)` from api.js
2. Save token to `localStorage('payback_token')`
3. Decode JWT → set `user` and `token` state

**`register()` flow**: same as login but calls `registerUser(name, email, password)`

**`logout()` flow**:
1. `localStorage.removeItem('payback_token')`
2. Set `user = null`, `token = null`

**Provider**: in `main.jsx`, `<ToastProvider>` is the outer wrapper so `AuthContext` can call `showToast` during logout:
```jsx
<ToastProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ToastProvider>
```

---

### Login Modal (Req 34)

**File**: `src/components/AuthModal/LoginModal.jsx`

**Trigger**: "Sign In" button in `Header.jsx` calls `setAuthModal('login')` (state lifted to App or via context).

**Layout**:
```
┌──────────────────────────────────────┐
│  Sign In                         [×] │
│                                      │
│  Email ________________________      │
│  Password [__________________] 👁    │
│                                      │
│  [inline error if failed]            │
│                                      │
│  [Sign In]  (full-width emerald btn) │
│                                      │
│  Don't have an account? Join Now →   │
└──────────────────────────────────────┘
```

**Modal overlay**: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center`

**Card**: `bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl`

**Show/hide password**: local `showPassword` boolean state; toggles `type="password"` / `type="text"` and eye icon.

**On submit**:
1. Call `auth.login(email, password)`
2. On success: close modal + `showToast('Welcome back!', 'success')`
3. On failure: set inline error `"Invalid email or password"`

**Switch link**: clicking "Join Now →" closes Login modal and opens Register modal.

---

### Register Modal (Req 35)

**File**: `src/components/AuthModal/RegisterModal.jsx`

**Trigger**: "Join Now" button in `Header.jsx` calls `setAuthModal('register')`.

**Layout**:
```
┌──────────────────────────────────────┐
│  Create Account                  [×] │
│                                      │
│  Name   ________________________     │
│  Email  ________________________     │
│  Password [__________________] 👁    │
│  Confirm  [__________________] 👁    │
│                                      │
│  [inline error if failed]            │
│                                      │
│  [Create Account]  (emerald btn)     │
│                                      │
│  Already have an account? Sign In →  │
└──────────────────────────────────────┘
```

**Client-side validation** (run before API call):
- `name.trim().length >= 2`
- `password.length >= 6`
- `password === confirmPassword`

**On submit**:
1. Run client-side validation; show inline error if invalid
2. Call `auth.register(name, email, password)`
3. On success: close modal + `showToast('Welcome to Payback!', 'success')`
4. On failure: show inline error from API response message

**Switch link**: clicking "Sign In →" closes Register modal and opens Login modal.

---

### Authenticated Navbar State (Req 36)

**Changes to `src/components/Header/Header.jsx`**:

The Header receives `isAuthenticated`, `user`, and `onLogout` props (or reads from `AuthContext` directly).

**Unauthenticated state** (existing):
```jsx
<button onClick={() => setAuthModal('login')}>Sign In</button>
<button onClick={() => setAuthModal('register')}>Join Now</button>
```

**Authenticated state**:
```jsx
<span className="bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-sm font-semibold">
  Hi, {user.firstName}
</span>
<button onClick={auth.logout} aria-label="Logout">
  <LogOut className="w-5 h-5 text-slate-500 hover:text-red-500" />
</button>
```

**Logout side-effect** (in `AuthContext.logout`): after clearing state, call `showToast('Logged out successfully', 'info')`.

---

### Authenticated Wallet Fetching (Req 37)

**Changes to `App.jsx`**:

```javascript
const { token, isAuthenticated } = useAuth();

useEffect(() => {
  fetchData();
}, [isAuthenticated]); // re-fetch when auth state changes

const fetchData = async () => {
  // getWallet now accepts optional token
  const walletData = await getWallet(token); // passes token if authenticated
  // ...rest of fetch logic unchanged
};
```

**`getWallet` routing** (already defined in Req 32 design):
- `token` present → `GET /api/v1/wallet/me` with `Authorization: Bearer {token}`
- no `token` → `GET /api/v1/wallet/1`

**Unauthenticated wallet section** — when `isAuthenticated` is false, the wallet section renders a prompt card instead of `WalletCard`:

```jsx
<section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 py-12 ...">
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8
                  flex flex-col items-center text-center gap-4 max-w-md mx-auto">
    {/* lucide Wallet icon in emerald circle */}
    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
      <Wallet className="w-7 h-7 text-emerald-600" />
    </div>
    <h2 className="text-xl font-bold text-slate-900">Your wallet is waiting</h2>
    <p className="text-slate-500 text-sm">
      Sign in or create an account to track your cashback earnings.
    </p>
    <div className="flex gap-3 mt-2">
      <button onClick={() => setAuthModal('login')} ...>Sign In</button>
      <button onClick={() => setAuthModal('register')} ...>Join Now</button>
    </div>
  </div>
</section>
```

**Transaction History section** — conditionally rendered only when `isAuthenticated` is true:
```jsx
{isAuthenticated && (
  <section className="py-12">
    <TransactionList transactions={transactions} loading={loading} />
  </section>
)}

---

### Modal State Management

Modal open/close state is managed in `App.jsx` (or a dedicated `useModal` hook):

```javascript
const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
```

`Header` receives `onSignIn` and `onJoinNow` callbacks that set `authModal`. `LoginModal` and `RegisterModal` receive `onClose` and `onSwitch` props.

---

### Updated Component Hierarchy (Post-Auth)

```
ToastProvider           ← outer (so AuthContext can call showToast)
└── AuthProvider
    └── App
        ├── Header              ← auth-aware (Hi chip / Sign In / Join Now)
├── LoginModal          ← new (conditional render when authModal === 'login')
├── RegisterModal       ← new (conditional render when authModal === 'register')
├── HeroSection
├── main
│   ├── WalletCard      ← fetches /wallet/me when authenticated
│   ├── CategoryPills
│   ├── MerchantGrid
│   │   └── MerchantCard[]
│   ├── TransactionList
│   └── HowItWorks
├── Footer
└── MobileBottomNav
```

---

### New Correctness Properties (Auth)

**Property 22: Token Persistence**
After a successful login or register, `localStorage.getItem('payback_token')` SHALL return the token received from the API. After logout, it SHALL return `null`.
*Validates: Req 33.3, 33.4*

**Property 23: Auth State Hydration**
On mount, if `localStorage` contains a valid JWT under `'payback_token'`, `isAuthenticated` SHALL be `true` and `user.firstName` SHALL be derived from the decoded payload.
*Validates: Req 33.2, 33.5*

**Property 24: Wallet Endpoint Routing**
For any call to `getWallet`, if a non-null token is passed the request URL SHALL be `/wallet/me` with an Authorization header; if token is null/undefined the URL SHALL be `/wallet/1` with no Authorization header.
*Validates: Req 32.3, 37.1, 37.2*

**Property 25: Register Validation**
For any combination of name (length < 2), password (length < 6), or mismatched confirm password, the Register modal SHALL display an inline error and SHALL NOT call the API.
*Validates: Req 35.3*


---

## Design Additions: Transaction Creation (Requirement 38)

### Transaction Creation API Method (Req 38.1)

**File**: `src/services/api.js` (addition only)

```javascript
// POST /api/v1/transactions
export const createTransaction = async (merchantId, orderAmount, token) => {
  const response = await apiClient.post(
    '/transactions',
    { merchantId, orderAmount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // TransactionDTO
};
```

**Backend endpoint**: `POST /api/v1/transactions` — requires JWT, returns the created `TransactionDTO`:
```json
{
  "id": 3,
  "merchantName": "Flipkart",
  "orderAmount": "1000.00",
  "cashbackAmount": "100.00",
  "status": "PENDING",
  "createdAt": "2026-03-17T13:46:49.394605"
}
```

---

### Updated `handleMerchantActivate` Flow (Req 38.2–38.6)

**File**: `App.jsx`

**Updated flow**:
```
User clicks "Shop Now" on a MerchantCard
  ↓
handleMerchantActivate(merchantId) called
  ↓
GET /api/v1/merchants/{id}/click  → get redirect URL
  ↓
isAuthenticated?
  YES → POST /api/v1/transactions { merchantId, orderAmount: 1000 }
          ↓ success → getWallet(token) to refresh wallet + transactions
          ↓ failure → showToast('Could not record transaction', 'error')
                       (continue to open URL regardless)
  NO  → skip createTransaction
  ↓
Open redirect URL in new tab (always, regardless of transaction result)
```

**Code sketch**:
```javascript
const handleMerchantActivate = async (merchantId) => {
  try {
    const result = await trackMerchantClick(merchantId);
    const url = result?.redirectUrl || result?.url || result;

    // Record transaction for authenticated users
    if (isAuthenticated && token) {
      try {
        await createTransaction(merchantId, 1000, token);
        // Refresh wallet so new transaction appears immediately
        const updatedWallet = await getWallet(token);
        setWallet(updatedWallet);
        setTransactions(updatedWallet.transactions || []);
      } catch (txErr) {
        showToast('Could not record transaction', 'error');
        // Do NOT return — still open the URL below
      }
    }

    if (!url || typeof url !== 'string') {
      showToast('Merchant link not available yet.', 'info');
      return;
    }
    window.open(url, '_blank');
  } catch (err) {
    showToast('Failed to activate cashback. Please try again.', 'error');
  }
};
```

**Key design decisions**:
- `orderAmount` is hardcoded to `1000` (a sensible default; real amount tracking is a future feature)
- Transaction failure is non-blocking — the user always reaches the merchant site
- Wallet refresh is a targeted re-fetch (not a full `fetchData()`) to avoid re-triggering the health check
- The guard `isAuthenticated && token` ensures `createTransaction` is never called for unauthenticated users

---

### Updated Data Flow Diagram

```
User clicks "Shop Now"
  ↓
trackMerchantClick(id)          GET /merchants/{id}/click
  ↓
[if authenticated]
createTransaction(id, 1000, token)  POST /transactions
  ↓ success
getWallet(token)                GET /wallet/me
  → setWallet + setTransactions (live update in UI)
  ↓
window.open(url, '_blank')      (always)
```

---

### New Correctness Property

**Property 26: Transaction Creation Auth Guard**
For any merchant click where `token` is `null` or `isAuthenticated` is `false`, `createTransaction` SHALL NOT be called. The merchant URL SHALL still be opened.
*Validates: Req 38.4, 38.6*


---

## Design Additions: Merchant Detail Page (Requirements 43–48)

### React Router Setup (Req 43)

**Installation**: `npm install react-router-dom`

**`main.jsx` update**:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import MerchantDetailPage from './pages/MerchantDetailPage';

<ToastProvider>
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/merchants/:id" element={<MerchantDetailPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
</ToastProvider>
```

All existing `App.jsx` content remains on the `/` route — no structural changes to App.jsx.

---

### New API Method (Req 44)

**File**: `src/services/api.js` (addition only — `createTransaction` already exists from Req 38)

```javascript
export const getMerchantById = async (id) => {
  const response = await apiClient.get(`/merchants/${id}`);
  return response.data;
};
```

`createTransaction` is already exported from Task 42 — do not re-add it.

---

### MerchantDetailPage (Req 44)

**File**: `src/pages/MerchantDetailPage.jsx`

**Layout** (premium, not a CashKaro clone):
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Stores                                            │
│                                                              │
│  HERO BANNER (emerald gradient accent, full-width)           │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  [Logo]  Merchant Name                               │    │
│  │          Upto X% Cashback  •  N categories           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  │
│  │  CashbackCalculator     │  │  Today's Best Deals      │  │
│  │  (left col, desktop)    │  │  (right col, desktop)    │  │
│  ├─────────────────────────┤  └──────────────────────────┘  │
│  │  Shop by Category       │                                 │
│  │  (below calculator)     │                                 │
│  └─────────────────────────┘                                 │
└──────────────────────────────────────────────────────────────┘
```

**Responsive**: two-column (`lg:grid-cols-[1fr_380px]`) on desktop, single column on mobile.

**Data fetching**:
```javascript
const { id } = useParams();
const [merchant, setMerchant] = useState(null);
const [loading, setLoading] = useState(true);
const [notFound, setNotFound] = useState(false);

useEffect(() => {
  getMerchantById(id)
    .then(setMerchant)
    .catch(err => {
      if (err?.status === 404 || err?.response?.status === 404) setNotFound(true);
    })
    .finally(() => setLoading(false));
}, [id]);
```

**Skeleton loader**: pulsing placeholder matching hero banner height + grid layout below.

**404 state**: centered `<SearchX />` lucide icon + "Merchant not found" heading + "← Back to Stores" link.

**Hero banner**:
```jsx
<div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-8">
  <img src={merchant.logoUrl} className="w-20 h-20 rounded-2xl bg-white p-2" />
  <h1 className="text-3xl font-bold text-white">{merchant.name}</h1>
  <span className="bg-emerald-500 text-white px-4 py-1 rounded-full font-bold">
    Upto {merchant.cashbackRate}% Cashback
  </span>
  <span className="text-slate-300 text-sm">{merchant.categories?.length ?? 0} categories available</span>
</div>
```

---

### CashbackCalculator Component (Req 45)

**File**: `src/components/CashbackCalculator/CashbackCalculator.jsx`

**Props**:
```javascript
{
  cashbackRate: number,      // e.g. 10 for 10%
  merchantName: string,
  onActivate: () => void     // called when CTA button is clicked
}
```

**State**: `inputAmount: string` (controlled input)

**Calculation** (derived, no extra state):
```javascript
const amount = parseFloat(inputAmount) || 0;
const cashback = amount * (cashbackRate / 100);
const hasAmount = amount > 0;
```

**Layout**:
```
┌──────────────────────────────────────────────┐
│  bg-white rounded-3xl border border-slate-200 │
│  shadow-sm p-6                                │
│                                               │
│  💰 Cashback Calculator                       │
│                                               │
│  I plan to spend: ₹ [____________]            │
│                                               │
│  You will earn: ₹12.50 cashback               │
│  That's like 10% OFF your purchase!           │
│                                               │
│  [Shop on Flipkart & Earn ₹12.50 →]           │
│   or [Activate Cashback & Shop →] if empty    │
└──────────────────────────────────────────────┘
```

**CTA button**: `bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 py-3 font-semibold w-full transition-colors`

**"That's like X% OFF"**: always shows `cashbackRate`% since cashback = rate% of spend.

---

### CategoryGrid Component (Req 46)

**File**: `src/components/CategoryGrid/CategoryGrid.jsx`

**Props**:
```javascript
{
  categories: Array<{
    id: number,
    name: string,
    icon: string,          // emoji
    cashbackRate: number,
    affiliateUrl: string
  }>,
  onCategoryClick: (category) => void
}
```

**Grid**: `grid grid-cols-3 lg:grid-cols-4 gap-4`

**Category card**:
```jsx
<button className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center gap-2
                   hover:border-emerald-300 hover:shadow-md transition-all">
  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl">
    {category.icon}
  </div>
  <span className="text-sm font-semibold text-slate-800 text-center">{category.name}</span>
  <span className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5 font-medium">
    {category.cashbackRate}% CB
  </span>
</button>
```

**Click handler in MerchantDetailPage**:
```javascript
const handleCategoryClick = async (category) => {
  if (!isAuthenticated) {
    setAuthModal('login');
    return;
  }
  try {
    const tx = await createTransaction(merchant.id, 1000, token);
    const cashback = tx?.cashbackAmount ?? (1000 * merchant.cashbackRate / 100).toFixed(2);
    window.open(category.affiliateUrl, '_blank');
    showToast(`Cashback activated! Shop and earn ₹${cashback}`, 'success');
    const updated = await getWallet(token);
    // wallet refresh passed up via prop or context
  } catch {
    showToast('Could not record transaction', 'error');
    window.open(category.affiliateUrl, '_blank');
  }
};
```

---

### OfferCard Component (Req 47)

**File**: `src/components/OfferCard/OfferCard.jsx`

**Props**:
```javascript
{
  offer: {
    id: number,
    title: string,
    description: string,
    discountText: string,   // e.g. "20% OFF"
    affiliateUrl: string
  },
  onActivate: (offer) => void
}
```

**Layout**:
```jsx
<div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
  <div className="flex items-start justify-between gap-2">
    <h3 className="font-semibold text-slate-900 text-sm leading-snug">{offer.title}</h3>
    <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-full shrink-0">
      {offer.discountText}
    </span>
  </div>
  <p className="text-slate-500 text-xs leading-relaxed">{offer.description}</p>
  <button
    onClick={() => onActivate(offer)}
    className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold
               rounded-full px-4 py-2 transition-colors self-start"
  >
    Activate Deal →
  </button>
</div>
```

**Click handler in MerchantDetailPage** (same auth-guard pattern as categories):
```javascript
const handleOfferActivate = async (offer) => {
  if (!isAuthenticated) {
    setAuthModal('login');
    return;
  }
  try {
    await createTransaction(merchant.id, 1000, token);
    window.open(offer.affiliateUrl, '_blank');
    showToast('Deal activated! Cashback tracking started', 'success');
    const updated = await getWallet(token);
    // refresh wallet
  } catch {
    showToast('Could not record transaction', 'error');
    window.open(offer.affiliateUrl, '_blank');
  }
};
```

---

### MerchantCard Navigation Update (Req 48)

**File**: `src/components/MerchantCard/MerchantCard.jsx`

**Change**: replace `window.open` on authenticated click with `useNavigate`:

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const handleClick = async () => {
  if (!isAuthenticated) {
    onSignIn(); // open Login modal
    return;
  }
  // Still call click tracking
  try {
    await trackMerchantClick(merchant.id);
  } catch {
    // non-blocking
  }
  navigate(`/merchants/${merchant.id}`);
};
```

**Key constraint**: `trackMerchantClick` is still called (Req 48.3). The direct `window.open` is removed from the authenticated path. Guest users still see the Login modal.

---

### New Component Structure

```
src/pages/
  MerchantDetailPage.jsx       # Route component for /merchants/:id

src/components/
  CashbackCalculator/
    CashbackCalculator.jsx
    CashbackCalculator.module.css
    index.js
  CategoryGrid/
    CategoryGrid.jsx
    CategoryGrid.module.css
    index.js
  OfferCard/
    OfferCard.jsx
    index.js
```

---

### Updated Component Hierarchy (Post-Router)

```
main.jsx
└── BrowserRouter
    └── Routes
        ├── Route "/"
        │   └── App (existing homepage)
        └── Route "/merchants/:id"
            └── MerchantDetailPage
                ├── Hero Banner
                ├── CashbackCalculator
                ├── CategoryGrid
                └── OfferCard[] (Today's Best Deals)
```

---

### New Correctness Properties

**Property 27: Cashback Calculation Accuracy**
For any `inputAmount` ≥ 0 and any `cashbackRate` ≥ 0, the displayed cashback value SHALL equal `(inputAmount × cashbackRate / 100)` rounded to 2 decimal places. No floating-point drift shall be visible in the UI.
*Validates: Req 45.4*

**Property 28: Category Click Auth Guard**
For any category or offer click where `isAuthenticated` is `false` or `token` is `null`, `createTransaction` SHALL NOT be called. The Login modal SHALL be opened instead.
*Validates: Req 46.4, 46.5, 47.4, 47.5*

**Property 29: Merchant 404 Handling**
When `getMerchantById` rejects with a 404 error for any merchant ID, the MerchantDetailPage SHALL render the 404 message state and SHALL NOT throw an unhandled exception or render a blank page.
*Validates: Req 44.6*


---

## Design Additions: Guest Navigation, Duplicate Prevention, Wallet Refresh, Admin Page (Requirements 49–52)

### Guest Merchant Navigation (Req 49)

**File**: `src/components/MerchantCard/MerchantCard.jsx`

**Change**: Remove the auth-gate on the "Shop Now" click. Both guests and authenticated users navigate to `/merchants/:id`. Only authenticated users trigger `trackMerchantClick` first.

```javascript
const handleClick = async () => {
  if (isAuthenticated) {
    try { await trackMerchantClick(merchant.id); } catch { /* non-blocking */ }
  }
  navigate(`/merchants/${merchant.id}`);
};
```

- `onSignIn` prop is removed entirely from `MerchantCard` — it is no longer needed.
- Guest users land on the merchant detail page; the login modal only appears when they attempt to activate cashback (category click or offer click).

---

### Duplicate Transaction Prevention (Req 50)

**File**: `src/pages/MerchantDetailPage.jsx`

**New state**:
```javascript
const [isActivating, setIsActivating] = useState(false);
```

**Guard pattern** applied to both `handleCategoryClick` and `handleOfferActivate`:
```javascript
const handleCategoryClick = async (category) => {
  if (isActivating) return;           // early return while in-flight
  if (!isAuthenticated) { setAuthModal('login'); return; }
  setIsActivating(true);
  try {
    // ... createTransaction + window.open + toast + wallet refresh
  } finally {
    setIsActivating(false);           // always reset
  }
};
```

**UI**: every category card `<button>` and every `OfferCard` "Activate Deal →" button receives `disabled={isActivating}`. Disabled state uses `opacity-50 cursor-not-allowed`.

---

### Wallet Auto-Refresh After Transaction (Req 51)

**Pattern**: custom browser event `walletUpdated` decouples `MerchantDetailPage` from `App.jsx` state without prop drilling or context changes.

**MerchantDetailPage** — dispatch after successful transaction:
```javascript
window.dispatchEvent(new Event('walletUpdated'));
```

**App.jsx** — listen and re-fetch:
```javascript
useEffect(() => {
  const handleWalletUpdated = async () => {
    const updated = await getWallet(token);
    setWalletData(updated);
    setTransactions(updated.transactions || []);
  };
  window.addEventListener('walletUpdated', handleWalletUpdated);
  return () => window.removeEventListener('walletUpdated', handleWalletUpdated);
}, [token]);
```

- Existing wallet state variable names (`walletData`, `transactions`) are preserved.
- The listener is cleaned up on unmount via the `useEffect` return function.
- Works for both category clicks and offer clicks since both dispatch the same event.

---

### Admin Transaction Management Page (Req 52)

#### New API Method

**File**: `src/services/api.js` (addition only — no changes to existing exports or base config)

```javascript
// PUT /api/v1/transactions/{id}/status
export const updateTransactionStatus = async (transactionId, status, token) => {
  const response = await apiClient.put(
    `/transactions/${transactionId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
```

#### New Route

**File**: `main.jsx` — add alongside existing routes:
```jsx
<Route path="/admin" element={<AdminPage />} />
```

#### AdminPage Component

**File**: `src/pages/AdminPage.jsx`

**State**:
```javascript
const [unlocked, setUnlocked] = useState(false);
const [passwordInput, setPasswordInput] = useState('');
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(false);
const ADMIN_PASSWORD = 'payback@admin2026';
```

**Auth reads from `useAuth()`** — no separate auth system:
```javascript
const { token } = useAuth();
```

**Password gate** (shown when `!unlocked`):
```
┌──────────────────────────────────────┐
│  🔒 Admin Access                     │
│                                      │
│  Password: [__________________]      │
│  [Unlock]                            │
└──────────────────────────────────────┘
```
On submit: compare `passwordInput === ADMIN_PASSWORD`; if match set `unlocked = true` and fetch transactions; else show inline "Incorrect password".

**Transaction table** (shown when `unlocked`):
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Admin — Transaction Management                                          │
│                                                                          │
│  ID   MERCHANT   ORDER AMT   CASHBACK   STATUS     CREATED AT   ACTIONS │
│  ──────────────────────────────────────────────────────────────────────  │
│  1    Flipkart   ₹1,000      ₹100       PENDING    10 Mar 2026  [✓][✗]  │
│  2    Amazon     ₹1,000      ₹80        CONFIRMED  9 Mar 2026            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Fetching transactions**:
```javascript
const fetchTransactions = async () => {
  setLoading(true);
  try {
    const res = await apiClient.get('/transactions/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTransactions(res.data);
  } finally {
    setLoading(false);
  }
};
```

**Confirm / Reject buttons** (PENDING rows only):
```jsx
<button
  onClick={() => handleStatusUpdate(tx.id, 'CONFIRMED')}
  className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full"
>
  Confirm
</button>
<button
  onClick={() => handleStatusUpdate(tx.id, 'REJECTED')}
  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full"
>
  Reject
</button>
```

**Status update handler**:
```javascript
const handleStatusUpdate = async (id, status) => {
  await updateTransactionStatus(id, status, token);
  await fetchTransactions(); // refresh list
};
```

**Design**: uses existing emerald/slate design system — `bg-white rounded-3xl border border-slate-200`, status badges matching `TransactionList` styles.

---

### New Correctness Properties

**Property 30: Guest Navigation to Merchant Detail**
For any merchant card click where `isAuthenticated` is `false`, the app SHALL navigate to `/merchants/{id}` and SHALL NOT open the Login modal. `trackMerchantClick` SHALL NOT be called.
*Validates: Req 49.1, 49.4*

**Property 31: Duplicate Activation Prevention**
While `isActivating` is `true`, any subsequent call to `handleCategoryClick` or `handleOfferActivate` SHALL return immediately without calling `createTransaction` or any other API method.
*Validates: Req 50.1, 50.2*

**Property 32: Wallet Event Propagation**
After any successful `createTransaction` call on `MerchantDetailPage`, a `walletUpdated` event SHALL be dispatched on `window`, and `App.jsx`'s listener SHALL call `getWallet(token)` exactly once per event.
*Validates: Req 51.1, 51.2*

**Property 33: Admin Password Gate**
For any password value that is not exactly `'payback@admin2026'`, the AdminPage SHALL NOT fetch transactions and SHALL display an inline error. Only the exact correct password SHALL unlock the page.
*Validates: Req 52.2, 52.3*


---

## Design Additions: JWT Token Expiry Handling (Requirement 53)

### Overview

When a JWT token expires, the backend API returns a 401 Unauthorized response. Rather than showing an error or forcing the user to re-login, the application gracefully degrades to public wallet mode, allowing the user to continue browsing merchants and viewing public wallet data without disruption.

### Error Handling in fetchData Function

**File**: `src/App.jsx`

**Current flow** (before 401 handling):
```javascript
const fetchData = async () => {
  try {
    const walletData = await getWallet(isAuthenticated ? token : null);
    setWalletData(walletData);
    setTransactions(walletData.transactions || []);
  } catch (err) {
    showToast('Failed to load wallet data', 'error');
  }
};
```

**Updated flow** (with 401 handling):
```javascript
const fetchData = async () => {
  try {
    const walletData = await getWallet(isAuthenticated ? token : null);
    setWalletData(walletData);
    setTransactions(walletData.transactions || []);
  } catch (err) {
    // Check for 401 authentication error
    if (err?.status === 401 || err?.response?.status === 401) {
      // Token expired - gracefully degrade to public mode
      logout(); // clears localStorage and resets auth state
      
      // Load public wallet data
      try {
        const publicWalletData = await getWallet(null);
        setWalletData(publicWalletData);
        setTransactions(publicWalletData.transactions || []);
        // No error toast - silent degradation for better UX
      } catch (publicErr) {
        // If public wallet also fails, show error
        showToast('Failed to load wallet data', 'error');
      }
    } else {
      // Non-401 errors: existing error handling
      showToast('Failed to load wallet data', 'error');
    }
  }
};
```

### Implementation Pattern

**Try-Catch Structure**:
```javascript
try {
  // Attempt authenticated wallet fetch
  const walletData = await getWallet(token);
  // ... set state
} catch (err) {
  if (err?.status === 401 || err?.response?.status === 401) {
    // 401 handling: logout + fallback to public wallet
    logout();
    const publicWalletData = await getWallet(null);
    // ... set state with public data
  } else {
    // Other errors: existing error handling
  }
}
```

**Key design decisions**:
- **Dual 401 check**: Checks both `err?.status` and `err?.response?.status` to handle different Axios error structures
- **Silent degradation**: No error toast shown for expired tokens - the user simply sees public wallet data
- **Nested try-catch**: The fallback `getWallet(null)` call is wrapped in its own try-catch to handle cases where even the public endpoint fails
- **State consistency**: After 401 handling, the app state is identical to an unauthenticated user viewing public data

### State Management After 401

**Auth state changes** (via `logout()` function):
```javascript
// From AuthContext.logout()
localStorage.removeItem('payback_token');
setToken(null);
setUser(null);
setIsAuthenticated(false);
```

**UI state changes**:
- Navbar: "Hi, {firstName}" chip → "Sign In" / "Join Now" buttons
- Wallet section: Personal wallet → Public wallet (User ID 1)
- Transaction History: Hidden (since `isAuthenticated` is now false)
- Merchant cards: Continue to work normally (no auth required for browsing)

### Error Type Distinction

**401 errors** (authentication failures):
- Token expired
- Token invalid
- Token missing when required
- **Handling**: Silent logout + public wallet fallback

**Non-401 errors** (other failures):
- Network errors (no connection)
- Timeout errors (request took too long)
- 500 server errors (backend crash)
- 404 not found (endpoint missing)
- **Handling**: Existing error toast + retry mechanism

### Data Flow Diagram

```
User opens app with expired token
  ↓
fetchData() called with token
  ↓
getWallet(token) → 401 Unauthorized
  ↓
catch block detects 401
  ↓
logout() → clear localStorage + reset auth state
  ↓
getWallet(null) → fetch public wallet
  ↓
setWalletData(publicWallet)
  ↓
UI updates: navbar shows "Sign In", wallet shows public data
  ↓
User continues browsing (no disruption)
```

### Integration with Existing Error Handling

**Existing error handling** (preserved for non-401 errors):
- Toast notifications for network failures
- Retry buttons for failed operations
- Loading states during async operations
- Error boundaries for component crashes

**New 401 handling** (added):
- Silent logout on token expiry
- Automatic fallback to public wallet
- No user-facing error message
- Seamless transition to unauthenticated state

### Testing Considerations

**Unit tests** should verify:
- 401 error triggers logout()
- 401 error triggers getWallet(null) call
- Public wallet data is set after 401
- Non-401 errors still show error toast
- Both err?.status and err?.response?.status are checked

**Property tests** should verify:
- For any 401 error, localStorage is cleared
- For any 401 error, auth state is reset
- For any 401 error, public wallet is loaded
- For any non-401 error, existing error handling applies

### Constraints

**Files modified**:
- `src/App.jsx` only (fetchData function)

**Files unchanged**:
- `src/services/api.js` (no changes to error propagation)
- `src/context/AuthContext.jsx` (logout function already exists)
- `src/context/ToastContext.jsx` (no changes needed)
- All other components (no changes needed)

**Backward compatibility**:
- Existing error handling for non-401 errors is preserved
- Existing logout() function is reused (no new auth logic)
- Existing getWallet(null) pattern is reused (no new API calls)

### New Correctness Property

**Property 34: 401 Error Graceful Degradation**

*For any* API call to `getWallet(token)` that returns a 401 error, the application SHALL call `logout()` to clear auth state, then call `getWallet(null)` to load public wallet data, and SHALL NOT display an error toast to the user.

**Validates: Requirements 53.1, 53.2, 53.3, 53.4, 53.5**

---

**Property 35: Non-401 Error Handling Preservation**

*For any* API call to `getWallet(token)` that returns a non-401 error (network error, timeout, 500, etc.), the application SHALL display an error toast and SHALL NOT call `logout()` or attempt to load public wallet data.

**Validates: Requirements 53.6, 53.7**


*Validates: Req 53.1, 53.2, 53.3, 53.4, 53.5*


---

## Design Additions: Search, Calculator Integration, Profile Page (Requirements 54–56)

### Search Functionality (Req 54)

#### Implementation Approach

Search is implemented as a real-time filter on the merchant list, with state managed in `App.jsx` and passed down to the `Header` component. The search works in combination with category filters, allowing users to search within a selected category.

#### State Management

**File**: `src/App.jsx`

**New state variable**:
```javascript
const [searchQuery, setSearchQuery] = useState('');
```

**Filter logic** (applied before category filter):
```javascript
// Step 1: Filter by search query (case-insensitive)
const searchFiltered = searchQuery.trim()
  ? merchants.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : merchants;

// Step 2: Filter by active category (if any)
const filteredMerchants = activeCategory
  ? searchFiltered.filter(m => MERCHANT_CATEGORIES[m.name] === activeCategory)
  : searchFiltered;
```

**Props passed to Header**:
```javascript
<Header
  availableBalance={walletData?.available}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  // ... other props
/>
```

#### Header Component Updates

**File**: `src/components/Header/Header.jsx`

**New props**:
```javascript
{
  searchQuery: string,
  onSearchChange: (query: string) => void
}
```

**Search input wiring**:
```jsx
<input
  type="text"
  placeholder="Search merchants..."
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  className="bg-slate-100 rounded-2xl px-4 py-2 text-sm focus:outline-none 
             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
             transition-all w-full max-w-md"
/>
```

**Responsive behavior**: Search input is hidden on mobile (`hidden md:block`) as per existing design.

#### Empty State Handling

**File**: `src/components/MerchantGrid/MerchantGrid.jsx`

**Empty state** (when `filteredMerchants.length === 0`):
```jsx
{filteredMerchants.length === 0 && !loading && (
  <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4">
    <SearchX className="w-16 h-16 text-slate-300" />
    <h3 className="text-xl font-semibold text-slate-700">No merchants found</h3>
    <p className="text-slate-500 text-sm">
      Try adjusting your search or category filter
    </p>
    {(searchQuery || activeCategory) && (
      <button
        onClick={() => {
          setSearchQuery('');
          setActiveCategory(null);
        }}
        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        Clear all filters
      </button>
    )}
  </div>
)}
```

#### Search + Category Filter Interaction

**Combined filter behavior**:
1. User types "flip" in search → shows only merchants with "flip" in name
2. User clicks "Electronics" category → shows only electronics merchants with "flip" in name
3. User clears search → shows all electronics merchants
4. User clears category → shows all merchants

**Filter order matters**: Search is applied first, then category filter is applied to the search results. This ensures the category filter only operates on the already-filtered search results.

#### Performance Considerations

**Debouncing**: Not implemented in MVP since the merchant list is small (<100 merchants). If the list grows, add a debounce hook:
```javascript
const debouncedSearchQuery = useDebounce(searchQuery, 300);
```

**Case-insensitive matching**: Uses `.toLowerCase()` on both search query and merchant names for consistent matching regardless of user input case.

---

### Wire Cashback Calculator to Transaction Creation (Req 55)

#### Current State

The `CashbackCalculator` component already exists on `MerchantDetailPage` with an `inputAmount` state variable that tracks the user-entered amount. However, transaction creation currently uses a hardcoded `orderAmount` of `1000`.

#### Implementation Changes

**File**: `src/pages/MerchantDetailPage.jsx`

**Updated transaction creation flow**:

```javascript
// State already exists in CashbackCalculator
const [calculatorAmount, setCalculatorAmount] = useState('');

// Pass amount state to calculator
<CashbackCalculator
  cashbackRate={merchant.cashbackRate}
  merchantName={merchant.name}
  amount={calculatorAmount}
  onAmountChange={setCalculatorAmount}
  onActivate={handleCalculatorActivate}
/>

// New handler for calculator CTA button
const handleCalculatorActivate = async () => {
  if (isActivating) return;
  if (!isAuthenticated) {
    setAuthModal('login');
    return;
  }

  // Use entered amount or default to 1000
  const orderAmount = parseFloat(calculatorAmount) || 1000;
  
  // Validate amount is positive
  if (orderAmount <= 0) {
    showToast('Please enter a valid amount', 'error');
    return;
  }

  setIsActivating(true);
  try {
    const tx = await createTransaction(merchant.id, orderAmount, token);
    const cashbackAmount = tx?.cashbackAmount ?? (orderAmount * merchant.cashbackRate / 100).toFixed(2);
    
    // Open merchant website
    window.open(merchant.websiteUrl || merchant.manualTrackingUrl, '_blank');
    
    showToast(`Cashback activated! You'll earn ₹${cashbackAmount}`, 'success');
    
    // Refresh wallet
    window.dispatchEvent(new Event('walletUpdated'));
  } catch (err) {
    showToast('Could not record transaction', 'error');
    // Still open URL on error
    window.open(merchant.websiteUrl || merchant.manualTrackingUrl, '_blank');
  } finally {
    setIsActivating(false);
  }
};
```

#### CashbackCalculator Component Updates

**File**: `src/components/CashbackCalculator/CashbackCalculator.jsx`

**Updated props**:
```javascript
{
  cashbackRate: number,
  merchantName: string,
  amount: string,              // controlled by parent
  onAmountChange: (amount: string) => void,
  onActivate: () => void
}
```

**Calculation** (derived from amount prop):
```javascript
const orderAmount = parseFloat(amount) || 0;
const cashbackAmount = orderAmount * (cashbackRate / 100);
const hasAmount = orderAmount > 0;
```

**Dynamic CTA button text**:
```jsx
<button
  onClick={onActivate}
  disabled={isActivating}
  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full 
             px-6 py-3 font-semibold w-full transition-colors
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  {hasAmount
    ? `Shop on ${merchantName} & Earn ₹${cashbackAmount.toFixed(2)} →`
    : 'Activate Cashback & Shop →'
  }
</button>
```

**Input validation**:
```jsx
<input
  type="number"
  min="0"
  step="1"
  placeholder="1000"
  value={amount}
  onChange={(e) => onAmountChange(e.target.value)}
  className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 
             rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
/>
```

#### Category and Offer Click Updates

**Category clicks** and **offer clicks** continue to use the default `orderAmount` of `1000` since they don't have a calculator input. Only the main calculator CTA button uses the user-entered amount.

**Rationale**: Categories and offers are quick-action buttons for users who want to shop immediately without calculating. The calculator is for users who want to see their exact cashback before shopping.

#### Data Flow

```
User enters ₹2500 in calculator
  ↓
calculatorAmount state = "2500"
  ↓
Cashback display updates: "You will earn: ₹250.00 cashback"
  ↓
CTA button updates: "Shop on Flipkart & Earn ₹250 →"
  ↓
User clicks CTA button
  ↓
handleCalculatorActivate() called
  ↓
createTransaction(merchantId, 2500, token)
  ↓
Backend calculates: cashbackAmount = 2500 × 0.10 = 250.00
  ↓
Transaction created with orderAmount=2500, cashbackAmount=250.00
  ↓
Wallet refreshes, new transaction appears in history
```

---

### Profile Page (Req 56)

#### Route Setup

**File**: `main.jsx`

**New route**:
```jsx
<Route path="/profile" element={<ProfilePage />} />
```

**Protected route logic**: Handled within `ProfilePage` component (redirect to login if not authenticated).

#### New API Method

**File**: `src/services/api.js`

```javascript
// PUT /api/v1/users/me
export const updateUserProfile = async (name, token) => {
  const response = await apiClient.put(
    '/users/me',
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // Updated user object
};
```

**Note**: The wallet endpoint `GET /api/v1/wallet/me` already returns user info (name, email) along with wallet data and transactions, so no additional user profile endpoint is needed for fetching.

#### ProfilePage Component

**File**: `src/pages/ProfilePage.jsx`

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  Profile                                                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PROFILE CARD                                          │  │
│  │  ┌──────┐                                              │  │
│  │  │  JD  │  John Doe                                    │  │
│  │  └──────┘  john@example.com                            │  │
│  │            [Edit Name]                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  WALLET SUMMARY                                        │  │
│  │  Total Earned: ₹12,500  •  Pending: ₹2,500            │  │
│  │  Available: ₹10,000                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  TRANSACTION HISTORY                                   │  │
│  │  (reuse TransactionList component)                     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**State**:
```javascript
const { user, token, isAuthenticated, updateUser } = useAuth();
const navigate = useNavigate();
const { showToast } = useToast();

const [walletData, setWalletData] = useState(null);
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);
const [editMode, setEditMode] = useState(false);
const [nameInput, setNameInput] = useState('');
const [updating, setUpdating] = useState(false);
```

**Auth guard** (redirect if not authenticated):
```javascript
useEffect(() => {
  if (!isAuthenticated) {
    navigate('/');
    showToast('Please sign in to view your profile', 'info');
  }
}, [isAuthenticated, navigate]);
```

**Data fetching** (on mount):
```javascript
useEffect(() => {
  if (!isAuthenticated || !token) return;
  
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const data = await getWallet(token);
      setWalletData(data);
      setTransactions(data.transactions || []);
    } catch (err) {
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  fetchProfileData();
}, [isAuthenticated, token]);
```

#### Profile Card Section

```jsx
<section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
  <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile</h2>
  
  <div className="flex items-start gap-6">
    {/* Avatar circle with initials */}
    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center 
                    justify-center text-2xl font-bold text-emerald-700">
      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
    </div>
    
    <div className="flex-1">
      {!editMode ? (
        <>
          <h3 className="text-xl font-semibold text-slate-900">{user?.name}</h3>
          <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
          <button
            onClick={() => {
              setEditMode(true);
              setNameInput(user?.name || '');
            }}
            className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            Edit Name
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl 
                       focus:border-emerald-500 focus:outline-none"
            placeholder="Enter your name"
          />
          <p className="text-slate-500 text-sm mt-2">{user?.email}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSaveName}
              disabled={updating || !nameInput.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 
                         rounded-full text-sm font-semibold transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setEditMode(false)}
              disabled={updating}
              className="border border-slate-200 text-slate-700 px-4 py-2 
                         rounded-full text-sm font-medium hover:border-slate-300"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  </div>
</section>
```

#### Name Update Handler

```javascript
const handleSaveName = async () => {
  if (!nameInput.trim()) {
    showToast('Name cannot be empty', 'error');
    return;
  }
  
  setUpdating(true);
  try {
    const updatedUser = await updateUserProfile(nameInput.trim(), token);
    
    // Update auth context with new user data
    updateUser(updatedUser);
    
    setEditMode(false);
    showToast('Name updated successfully', 'success');
  } catch (err) {
    showToast('Failed to update name', 'error');
  } finally {
    setUpdating(false);
  }
};
```

**Note**: The `updateUser` function needs to be added to `AuthContext` to update the user state after a successful profile update:

```javascript
// In AuthContext.jsx
const updateUser = (updatedUserData) => {
  setUser(prev => ({ ...prev, ...updatedUserData }));
};

// Add to context value
return (
  <AuthContext.Provider value={{ 
    user, token, isAuthenticated, 
    login, register, logout, updateUser 
  }}>
    {children}
  </AuthContext.Provider>
);
```

#### Wallet Summary Section

```jsx
<section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
  <h2 className="text-2xl font-bold text-slate-900 mb-6">Wallet Summary</h2>
  
  {loading ? (
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="h-6 bg-slate-200 rounded w-1/2"></div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-slate-500 text-sm">Total Earned</span>
        <span className="text-2xl font-bold text-emerald-600">
          ₹{walletData?.totalEarned?.toLocaleString('en-IN') || '0'}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-slate-500 text-sm">Pending</span>
        <span className="text-2xl font-bold text-amber-600">
          ₹{walletData?.pending?.toLocaleString('en-IN') || '0'}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-slate-500 text-sm">Available for Payout</span>
        <span className="text-2xl font-bold text-slate-900">
          ₹{walletData?.available?.toLocaleString('en-IN') || '0'}
        </span>
      </div>
    </div>
  )}
</section>
```

#### Transaction History Section

```jsx
<section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
  <h2 className="text-2xl font-bold text-slate-900 mb-6">Transaction History</h2>
  
  {loading ? (
    <div className="animate-pulse space-y-3">
      <div className="h-12 bg-slate-200 rounded"></div>
      <div className="h-12 bg-slate-200 rounded"></div>
      <div className="h-12 bg-slate-200 rounded"></div>
    </div>
  ) : transactions.length > 0 ? (
    <TransactionList transactions={transactions} loading={false} />
  ) : (
    <div className="text-center py-12">
      <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-500">No transactions yet</p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
      >
        Start shopping to earn cashback →
      </button>
    </div>
  )}
</section>
```

#### Navigation Integration

**Mobile Bottom Nav** (update existing):
```javascript
// In MobileBottomNav.jsx
const tabs = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Stores', icon: Store, path: '/' },
  { name: 'Wallet', icon: Wallet, path: '/' },
  { name: 'Profile', icon: User, path: '/profile' }, // Now functional
];

// Update click handler
const handleTabClick = (tab) => {
  navigate(tab.path);
};
```

**Desktop Header** (add profile link):
```jsx
// In Header.jsx, when authenticated
<button
  onClick={() => navigate('/profile')}
  className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 
             transition-colors"
>
  <User className="w-5 h-5" />
  <span className="text-sm font-medium">Profile</span>
</button>
```

#### Component Structure

```
src/pages/
  ProfilePage.jsx              # New profile page component

src/context/
  AuthContext.jsx              # Add updateUser function

src/services/
  api.js                       # Add updateUserProfile function
```

#### Updated Component Hierarchy

```
main.jsx
└── BrowserRouter
    └── Routes
        ├── Route "/"
        │   └── App (homepage)
        ├── Route "/merchants/:id"
        │   └── MerchantDetailPage
        ├── Route "/admin"
        │   └── AdminPage
        └── Route "/profile"          ← NEW
            └── ProfilePage
                ├── Profile Card (with edit name)
                ├── Wallet Summary
                └── Transaction History (reused component)
```

---

### New Correctness Properties

**Property 35: Search Filter Accuracy**

*For any* search query string and any merchant list, the filtered results SHALL contain only merchants whose name includes the search query (case-insensitive), and SHALL contain all such merchants.

*Validates: Requirements 54.2, 54.3*

---

**Property 36: Search + Category Filter Composition**

*For any* active category and any search query, the filtered results SHALL be the intersection of merchants matching the search query AND merchants in the active category.

*Validates: Requirements 54.7*

---

**Property 37: Calculator Amount Transaction Creation**

*For any* user-entered amount in the cashback calculator, when the calculator CTA button is clicked, the `createTransaction` call SHALL use the entered amount as `orderAmount`. If no amount is entered, it SHALL use a default value of 1000.

*Validates: Requirements 55.2, 55.6*

---

**Property 38: Cashback Calculation Accuracy**

*For any* order amount and any merchant cashback rate, the displayed cashback amount SHALL equal `(orderAmount × cashbackRate / 100)` rounded to 2 decimal places.

*Validates: Requirements 55.3*

---

**Property 39: Profile Page Auth Guard**

*For any* unauthenticated user attempting to access `/profile`, the application SHALL redirect to the homepage and SHALL NOT render the profile page content.

*Validates: Requirements 56.9*

---

**Property 40: Profile Name Update Persistence**

*For any* successful name update via `updateUserProfile`, the updated name SHALL be reflected in the `AuthContext` user state, the profile page display, and the navbar greeting without requiring a page refresh.

*Validates: Requirements 56.6, 56.7*

---

**Property 41: Profile Data Source**

*For any* authenticated user on the profile page, the wallet summary and transaction history SHALL be fetched from `GET /api/v1/wallet/me` using the user's JWT token.

*Validates: Requirements 56.10*


---

## Design Additions: Order Confirmation, Empty States, Referral System, Withdrawal Flow (Requirements 57–60)

### Order Confirmation Flow (Req 57)

#### Overview

Before redirecting users to merchant websites, the application displays a confirmation modal that educates users about cashback tracking requirements. This improves user understanding and reduces support queries about "missing cashback."

#### ConfirmationModal Component

**File**: `src/components/ConfirmationModal/ConfirmationModal.jsx`

**Props**:
```javascript
{
  isOpen: boolean,
  merchantName: string,
  onConfirm: () => void,
  onClose: () => void
}
```

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  Modal Overlay (fixed inset-0 bg-black/50 z-50)             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  bg-white rounded-3xl p-8 max-w-md                     │  │
│  │                                                    [×]  │  │
│  │  ⚠️ Ready to Shop?                                     │  │
│  │                                                        │  │
│  │  You're about to shop at [Merchant Name].             │  │
│  │  Make sure to complete your purchase for               │  │
│  │  cashback to be tracked.                               │  │
│  │                                                        │  │
│  │  [Got it, Take me to [Merchant Name] →]               │  │
│  │   (full-width emerald button)                          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```


**Component structure**:
```jsx
const ConfirmationModal = ({ isOpen, merchantName, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="float-right text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center 
                        justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-amber-600" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Ready to Shop?
        </h2>

        {/* Message */}
        <p className="text-slate-600 leading-relaxed mb-6">
          You're about to shop at <strong>{merchantName}</strong>. 
          Make sure to complete your purchase for cashback to be tracked.
        </p>

        {/* Confirm button */}
        <button
          onClick={onConfirm}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white 
                     font-semibold py-3 rounded-full transition-colors"
        >
          Got it, Take me to {merchantName} →
        </button>
      </div>
    </div>
  );
};
```


#### Integration with MerchantDetailPage

**File**: `src/pages/MerchantDetailPage.jsx`

**New state**:
```javascript
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [pendingAction, setPendingAction] = useState(null);
```

**Updated category click handler**:
```javascript
const handleCategoryClick = async (category) => {
  if (isActivating) return;
  if (!isAuthenticated) {
    setAuthModal('login');
    return;
  }

  // Store the action and show confirmation modal
  setPendingAction({ type: 'category', data: category });
  setShowConfirmModal(true);
};
```

**Updated offer click handler**:
```javascript
const handleOfferActivate = async (offer) => {
  if (isActivating) return;
  if (!isAuthenticated) {
    setAuthModal('login');
    return;
  }

  // Store the action and show confirmation modal
  setPendingAction({ type: 'offer', data: offer });
  setShowConfirmModal(true);
};
```


**Confirmation handler** (executes the pending action):
```javascript
const handleConfirmAction = async () => {
  setShowConfirmModal(false);
  
  if (!pendingAction) return;

  setIsActivating(true);
  try {
    const { type, data } = pendingAction;
    
    // Create transaction
    const tx = await createTransaction(merchant.id, 1000, token);
    const cashbackAmount = tx?.cashbackAmount ?? 
                          (1000 * merchant.cashbackRate / 100).toFixed(2);
    
    // Get the URL based on action type
    const url = type === 'category' ? data.affiliateUrl : data.affiliateUrl;
    
    // Open merchant website
    window.open(url, '_blank');
    
    // Show success toast
    const message = type === 'category'
      ? `Cashback activated! Shop and earn ₹${cashbackAmount}`
      : 'Deal activated! Cashback tracking started';
    showToast(message, 'success');
    
    // Refresh wallet
    window.dispatchEvent(new Event('walletUpdated'));
  } catch (err) {
    showToast('Could not record transaction', 'error');
    // Still open URL on error
    const url = pendingAction.type === 'category' 
      ? pendingAction.data.affiliateUrl 
      : pendingAction.data.affiliateUrl;
    window.open(url, '_blank');
  } finally {
    setIsActivating(false);
    setPendingAction(null);
  }
};
```

**Modal close handler**:
```javascript
const handleCloseConfirmModal = () => {
  setShowConfirmModal(false);
  setPendingAction(null);
};
```


**Render modal**:
```jsx
<ConfirmationModal
  isOpen={showConfirmModal}
  merchantName={merchant?.name || ''}
  onConfirm={handleConfirmAction}
  onClose={handleCloseConfirmModal}
/>
```

#### Data Flow

```
User clicks category/offer
  ↓
Auth check (redirect to login if not authenticated)
  ↓
Store pending action in state
  ↓
Show confirmation modal
  ↓
User clicks "Got it, Take me to [Merchant]"
  ↓
Execute pending action:
  - Create transaction
  - Open merchant URL
  - Show success toast
  - Refresh wallet
  ↓
Clear pending action
```

**Cancel flow**:
```
User clicks X or clicks outside modal
  ↓
Close modal
  ↓
Clear pending action
  ↓
No transaction created, no URL opened
```


---

### Empty States Polish (Req 58)

#### Empty Transaction State

**File**: `src/components/TransactionList/TransactionList.jsx`

**Updated empty state** (when `transactions.length === 0`):
```jsx
{transactions.length === 0 && !loading && (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    {/* Icon */}
    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center 
                    justify-center">
      <ShoppingBag className="w-8 h-8 text-emerald-500" />
    </div>
    
    {/* Message */}
    <h3 className="text-xl font-semibold text-slate-700">
      Start shopping to earn cashback!
    </h3>
    <p className="text-slate-500 text-sm text-center max-w-md">
      Browse our merchant partners and activate cashback before shopping 
      to start earning rewards.
    </p>
    
    {/* CTA Button */}
    <button
      onClick={() => {
        const merchantGrid = document.getElementById('merchant-grid');
        if (merchantGrid) {
          merchantGrid.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white 
                 font-semibold px-6 py-3 rounded-full transition-colors"
    >
      Browse Merchants
    </button>
  </div>
)}
```

**Note**: The merchant grid section should have `id="merchant-grid"` for scroll targeting.


#### Unauthenticated Wallet Empty State

**File**: `src/App.jsx`

**Already implemented in Req 37** — the unauthenticated wallet section displays:
```jsx
<section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 py-12">
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8
                  flex flex-col items-center text-center gap-4 max-w-md mx-auto">
    {/* Wallet icon */}
    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center 
                    justify-center">
      <Wallet className="w-7 h-7 text-emerald-600" />
    </div>
    
    {/* Heading */}
    <h2 className="text-xl font-bold text-slate-900">
      Your wallet is waiting
    </h2>
    
    {/* Description */}
    <p className="text-slate-500 text-sm">
      Sign in or create an account to track your cashback earnings.
    </p>
    
    {/* CTA Buttons */}
    <div className="flex gap-3 mt-2">
      <button onClick={() => setAuthModal('login')} 
              className="border border-slate-200 text-slate-700 px-4 py-2 
                         rounded-full text-sm font-medium hover:border-emerald-500">
        Sign In
      </button>
      <button onClick={() => setAuthModal('register')}
              className="bg-emerald-500 text-white px-4 py-2 rounded-full 
                         text-sm font-semibold hover:bg-emerald-600">
        Join Now
      </button>
    </div>
  </div>
</section>
```


#### No Offers Empty State

**File**: `src/pages/MerchantDetailPage.jsx`

**Conditional rendering** (already implemented in Req 47):
```jsx
{merchant.offers && merchant.offers.length > 0 && (
  <section>
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Today's Best Deals
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {merchant.offers.map(offer => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onActivate={handleOfferActivate}
        />
      ))}
    </div>
  </section>
)}
```

**Design note**: When `merchant.offers` is empty or null, the entire "Today's Best Deals" section is not rendered. No empty state message is shown — the section simply doesn't appear.

#### Profile Page Empty Transaction State

**File**: `src/pages/ProfilePage.jsx`

**Already implemented in Req 56** — when `transactions.length === 0`:
```jsx
<div className="text-center py-12">
  <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
  <p className="text-slate-500">No transactions yet</p>
  <button
    onClick={() => navigate('/')}
    className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
  >
    Start shopping to earn cashback →
  </button>
</div>
```


---

### Referral System Frontend Components (Req 59)

#### Overview

The referral system allows users to share Payback with friends and earn bonuses. The frontend displays the user's unique referral code, provides sharing options, and shows referral statistics.

#### New API Methods

**File**: `src/services/api.js`

```javascript
// GET /api/v1/users/me/referral
export const getReferralData = async (token) => {
  const response = await apiClient.get('/users/me/referral', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // { referralCode, friendsJoined, bonusEarned }
};
```

**Note**: The referral code is also included in the wallet response from `GET /api/v1/wallet/me`, so it can be accessed from existing wallet data without an additional API call.


#### ReferralCard Component

**File**: `src/components/ReferralCard/ReferralCard.jsx`

**Props**:
```javascript
{
  referralCode: string,
  friendsJoined: number,
  bonusEarned: number
}
```

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  bg-white rounded-3xl border border-slate-200 shadow-sm p-8  │
│                                                              │
│  🎁 Refer & Earn                                             │
│                                                              │
│  Share Payback with friends and earn ₹100 for each signup!  │
│                                                              │
│  Your Referral Code                                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PAYBACK2026XYZ                          [Copy Link]   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Share via:  [WhatsApp] [Twitter] [Facebook]                │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  Friends Joined     │  │  Bonus Earned       │          │
│  │  12                 │  │  ₹1,200             │          │
│  └─────────────────────┘  └─────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```


**Component structure**:
```jsx
const ReferralCard = ({ referralCode, friendsJoined, bonusEarned }) => {
  const { showToast } = useToast();
  const referralLink = `https://payback.app/ref/${referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast('Referral link copied!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleShare = (platform) => {
    const message = encodeURIComponent(
      `Join Payback and earn cashback on every purchase! Use my referral code: ${referralCode}`
    );
    
    const urls = {
      whatsapp: `https://wa.me/?text=${message}%20${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(referralLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center 
                        justify-center">
          <Gift className="w-5 h-5 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Refer & Earn</h2>
      </div>

      {/* Description */}
      <p className="text-slate-600 mb-6">
        Share Payback with friends and earn ₹100 for each signup!
      </p>

      {/* Referral Code Section */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Your Referral Code
        </label>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl 
                          px-4 py-3 font-mono text-lg font-semibold text-slate-900">
            {referralCode}
          </div>
          <button
            onClick={handleCopyLink}
            className="bg-emerald-500 hover:bg-emerald-600 text-white 
                       px-6 py-3 rounded-xl font-semibold transition-colors 
                       flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">Share via:</p>
        <div className="flex gap-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white 
                       py-2 rounded-full font-medium transition-colors 
                       flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white 
                       py-2 rounded-full font-medium transition-colors 
                       flex items-center justify-center gap-2"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white 
                       py-2 rounded-full font-medium transition-colors 
                       flex items-center justify-center gap-2"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-4">
          <p className="text-sm text-emerald-700 font-medium mb-1">
            Friends Joined
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {friendsJoined}
          </p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4">
          <p className="text-sm text-amber-700 font-medium mb-1">
            Bonus Earned
          </p>
          <p className="text-3xl font-bold text-amber-600">
            ₹{bonusEarned.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};
```


#### Integration with ProfilePage

**File**: `src/pages/ProfilePage.jsx`

**Updated state**:
```javascript
const [referralData, setReferralData] = useState({
  referralCode: '',
  friendsJoined: 0,
  bonusEarned: 0
});
```

**Data fetching** (add to existing useEffect):
```javascript
useEffect(() => {
  if (!isAuthenticated || !token) return;
  
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [walletData, referralData] = await Promise.all([
        getWallet(token),
        getReferralData(token)
      ]);
      
      setWalletData(walletData);
      setTransactions(walletData.transactions || []);
      setReferralData(referralData);
    } catch (err) {
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  fetchProfileData();
}, [isAuthenticated, token]);
```

**Render ReferralCard** (add after Wallet Summary section):
```jsx
{/* Referral Section */}
<ReferralCard
  referralCode={referralData.referralCode}
  friendsJoined={referralData.friendsJoined}
  bonusEarned={referralData.bonusEarned}
/>
```


#### Referral Bonus Notification

**Trigger**: When the backend sends a referral bonus event (via WebSocket or polling), display a toast notification.

**Implementation approach** (polling-based for MVP):
```javascript
// In App.jsx or ProfilePage.jsx
useEffect(() => {
  if (!isAuthenticated || !token) return;
  
  let previousBonusEarned = referralData.bonusEarned;
  
  const checkReferralBonus = async () => {
    try {
      const data = await getReferralData(token);
      if (data.bonusEarned > previousBonusEarned) {
        const bonusAmount = data.bonusEarned - previousBonusEarned;
        showToast(`You earned ₹${bonusAmount} referral bonus!`, 'success');
        previousBonusEarned = data.bonusEarned;
      }
      setReferralData(data);
    } catch (err) {
      // Silent failure for background polling
    }
  };
  
  // Poll every 30 seconds
  const interval = setInterval(checkReferralBonus, 30000);
  
  return () => clearInterval(interval);
}, [isAuthenticated, token, referralData.bonusEarned]);
```

**Note**: For production, consider using WebSockets or Server-Sent Events for real-time notifications instead of polling.


---

### Withdrawal Flow Frontend Components (Req 60)

#### Overview

The withdrawal flow allows users to request payouts of their available balance to their UPI ID. The frontend provides a modal for withdrawal requests and displays withdrawal history on the profile page.

#### New API Methods

**File**: `src/services/api.js`

```javascript
// POST /api/v1/withdrawals
export const createWithdrawal = async (upiId, amount, token) => {
  const response = await apiClient.post(
    '/withdrawals',
    { upiId, amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // WithdrawalDTO
};

// GET /api/v1/withdrawals/me
export const getWithdrawalHistory = async (token) => {
  const response = await apiClient.get('/withdrawals/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // Array<WithdrawalDTO>
};
```


#### WithdrawalModal Component

**File**: `src/components/WithdrawalModal/WithdrawalModal.jsx`

**Props**:
```javascript
{
  isOpen: boolean,
  availableBalance: number,
  onClose: () => void,
  onSuccess: () => void
}
```

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  Modal Overlay (fixed inset-0 bg-black/50 z-50)             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  bg-white rounded-3xl p-8 max-w-md                     │  │
│  │                                                    [×]  │  │
│  │  💰 Withdraw Cashback                                  │  │
│  │                                                        │  │
│  │  Available Balance: ₹10,000                            │  │
│  │                                                        │  │
│  │  UPI ID                                                │  │
│  │  [yourname@upi_________________]                       │  │
│  │                                                        │  │
│  │  [inline error if validation fails]                    │  │
│  │                                                        │  │
│  │  [Request Withdrawal]                                  │  │
│  │   (full-width emerald button)                          │  │
│  │                                                        │  │
│  │  ℹ️ You'll receive payment within 24-48 hours          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```


**Component structure**:
```jsx
const WithdrawalModal = ({ isOpen, availableBalance, onClose, onSuccess }) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateUpiId = (value) => {
    // Pattern: alphanumeric@alphanumeric
    const upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
    return upiPattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!upiId.trim()) {
      setError('Please enter your UPI ID');
      return;
    }

    if (!validateUpiId(upiId)) {
      setError('Invalid UPI ID format. Use: yourname@upi');
      return;
    }

    if (availableBalance <= 0) {
      setError('Insufficient balance for withdrawal');
      return;
    }

    setSubmitting(true);
    try {
      await createWithdrawal(upiId, availableBalance, token);
      showToast(
        'Withdrawal request submitted! You\'ll receive payment within 24-48 hours',
        'success'
      );
      setUpiId('');
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 
                          'Failed to submit withdrawal request';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="float-right text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center 
                          justify-center">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Withdraw Cashback
          </h2>
        </div>

        {/* Available Balance */}
        <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-emerald-700 font-medium mb-1">
            Available Balance
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            ₹{availableBalance.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl 
                         focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting || availableBalance <= 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white 
                       font-semibold py-3 rounded-full transition-colors mb-4
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Request Withdrawal'}
          </button>

          {/* Info message */}
          <div className="flex items-start gap-2 text-sm text-slate-500">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>You'll receive payment within 24-48 hours</p>
          </div>
        </form>
      </div>
    </div>
  );
};
```


#### Integration with WalletCard

**File**: `src/components/WalletCard/WalletCard.jsx`

**Add Withdraw button** (shown when `available > 0`):
```jsx
{available > 0 && (
  <button
    onClick={onWithdrawClick}
    className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white 
               font-semibold py-3 rounded-full transition-colors 
               flex items-center justify-center gap-2"
  >
    <ArrowUpCircle className="w-5 h-5" />
    Withdraw
  </button>
)}
```

**Updated props**:
```javascript
{
  wallet: { totalEarned, pending, available },
  loading: boolean,
  onWithdrawClick: () => void  // New prop
}
```

#### Integration with App.jsx

**File**: `src/App.jsx`

**New state**:
```javascript
const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
```

**Pass handler to WalletCard**:
```jsx
<WalletCard
  wallet={walletData}
  loading={loading}
  onWithdrawClick={() => setShowWithdrawalModal(true)}
/>
```

**Render modal**:
```jsx
<WithdrawalModal
  isOpen={showWithdrawalModal}
  availableBalance={walletData?.available || 0}
  onClose={() => setShowWithdrawalModal(false)}
  onSuccess={async () => {
    // Refresh wallet data after successful withdrawal
    const updated = await getWallet(token);
    setWalletData(updated);
  }}
/>
```


#### WithdrawalHistory Component

**File**: `src/components/WithdrawalHistory/WithdrawalHistory.jsx`

**Props**:
```javascript
{
  withdrawals: Array<{
    id: number,
    amount: number,
    upiId: string,
    status: 'PENDING' | 'COMPLETED' | 'FAILED',
    createdAt: string
  }>,
  loading: boolean
}
```

**Layout** (desktop table):
```
┌──────────────────────────────────────────────────────────────┐
│  Withdrawal History                                          │
│                                                              │
│  AMOUNT    UPI ID           STATUS      DATE                 │
│  ──────────────────────────────────────────────────────────  │
│  ₹10,000   john@paytm       COMPLETED   15 Mar 2026         │
│  ₹5,000    john@paytm       PENDING     10 Mar 2026         │
└──────────────────────────────────────────────────────────────┘
```

**Layout** (mobile cards):
```
┌──────────────────────────────────────┐
│  ₹10,000                             │
│  john@paytm                          │
│  COMPLETED • 15 Mar 2026             │
└──────────────────────────────────────┘
```


**Component structure**:
```jsx
const WithdrawalHistory = ({ withdrawals, loading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      PENDING: 'bg-amber-50 text-amber-700',
      COMPLETED: 'bg-emerald-50 text-emerald-700',
      FAILED: 'bg-red-50 text-red-700'
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12">
        <ArrowUpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No withdrawal requests yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase 
                             tracking-widest text-slate-400">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase 
                             tracking-widest text-slate-400">
                UPI ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase 
                             tracking-widest text-slate-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase 
                             tracking-widest text-slate-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr
                key={withdrawal.id}
                className="border-t border-slate-100 hover:bg-slate-50 
                           transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-slate-900">
                  ₹{withdrawal.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                  {withdrawal.upiId}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                   ${getStatusStyle(withdrawal.status)}`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {formatDate(withdrawal.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-slate-100">
        {withdrawals.map((withdrawal) => (
          <div key={withdrawal.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-lg font-bold text-slate-900">
                ₹{withdrawal.amount.toLocaleString('en-IN')}
              </p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold 
                               ${getStatusStyle(withdrawal.status)}`}>
                {withdrawal.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-mono mb-1">
              {withdrawal.upiId}
            </p>
            <p className="text-xs text-slate-500">
              {formatDate(withdrawal.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
```


#### Integration with ProfilePage

**File**: `src/pages/ProfilePage.jsx`

**Updated state**:
```javascript
const [withdrawals, setWithdrawals] = useState([]);
```

**Data fetching** (add to existing useEffect):
```javascript
useEffect(() => {
  if (!isAuthenticated || !token) return;
  
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [walletData, referralData, withdrawalHistory] = await Promise.all([
        getWallet(token),
        getReferralData(token),
        getWithdrawalHistory(token)
      ]);
      
      setWalletData(walletData);
      setTransactions(walletData.transactions || []);
      setReferralData(referralData);
      setWithdrawals(withdrawalHistory);
    } catch (err) {
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  fetchProfileData();
}, [isAuthenticated, token]);
```

**Render WithdrawalHistory** (add after Transaction History section):
```jsx
{/* Withdrawal History Section */}
<section>
  <h2 className="text-2xl font-bold text-slate-900 mb-6">
    Withdrawal History
  </h2>
  <WithdrawalHistory withdrawals={withdrawals} loading={loading} />
</section>
```


---

### New Correctness Properties (Requirements 57–60)

#### Property Reflection

After analyzing all acceptance criteria for requirements 57-60, I identified the following patterns:

1. **Modal Display Consolidation**: Requirements 57.1, 57.8, 60.2 all specify modal display behavior. These can be consolidated into properties about modal triggering.

2. **Empty State Consolidation**: Requirements 58.1, 58.2, 58.3 all specify the no-transactions empty state. These can be consolidated into a single property about empty state rendering.

3. **Button State Consolidation**: Requirements 60.1 and 60.12 both specify when the withdraw button should be enabled/disabled. These can be consolidated into a single property.

The following properties represent the unique, non-redundant testable behaviors:


**Property 42: Confirmation Modal Trigger**

*For any* category or offer click on the merchant detail page when the user is authenticated, the confirmation modal SHALL be displayed before any transaction is created or URL is opened.

**Validates: Requirements 57.1, 57.8**

---

**Property 43: Confirmation Modal Content**

*For any* merchant name, the confirmation modal message SHALL include the merchant name in both the message text and the confirmation button text.

**Validates: Requirements 57.2, 57.3**

---

**Property 44: Confirmation Modal Action Flow**

*For any* confirmed action in the confirmation modal, the application SHALL create a transaction AND open the merchant URL. For any canceled action (modal closed without confirming), the application SHALL NOT create a transaction or open a URL.

**Validates: Requirements 57.4, 57.6**

---

**Property 45: Empty Transaction State Rendering**

*For any* authenticated user with zero transactions, the transaction list SHALL display an empty state with a shopping bag icon, the message "Start shopping to earn cashback!", and a "Browse Merchants" button.

**Validates: Requirements 58.1, 58.2, 58.3**

---

**Property 46: Conditional Offers Section**

*For any* merchant with an empty or null offers array, the "Today's Best Deals" section SHALL NOT be rendered on the merchant detail page.

**Validates: Requirements 58.6**

---


**Property 47: Referral Code Display**

*For any* authenticated user on the profile page, the referral code fetched from the API SHALL be displayed in the referral card.

**Validates: Requirements 59.1, 59.2**

---

**Property 48: Referral Link Format**

*For any* referral code, the generated referral link SHALL follow the format `https://payback.app/ref/[Referral_Code]`.

**Validates: Requirements 59.4**

---

**Property 49: Referral Link Copy Action**

*For any* click on the "Copy Referral Link" button, the referral link SHALL be copied to the clipboard using `navigator.clipboard.writeText`, and a toast notification "Referral link copied!" SHALL be displayed.

**Validates: Requirements 59.3, 59.5**

---

**Property 50: Referral Stats Display**

*For any* referral data fetched from the API, both "Friends Joined" count and "Bonus Earned" amount SHALL be displayed in the referral stats section.

**Validates: Requirements 59.7, 59.8**

---

**Property 51: Withdraw Button Visibility**

*For any* wallet state, the "Withdraw" button SHALL be displayed when `available > 0` and SHALL be disabled when `available <= 0` or when a withdrawal is in progress.

**Validates: Requirements 60.1, 60.12**

---


**Property 52: Withdrawal Modal Display**

*For any* click on the "Withdraw" button, the withdrawal modal SHALL be displayed with the available balance prominently shown.

**Validates: Requirements 60.2, 60.4**

---

**Property 53: UPI ID Validation**

*For any* UPI ID input, the validation SHALL accept strings matching the pattern `alphanumeric@alphanumeric` and SHALL reject all other formats, displaying an appropriate error message.

**Validates: Requirements 60.5**

---

**Property 54: Withdrawal Request Submission**

*For any* valid withdrawal request (valid UPI ID and available balance > 0), clicking submit SHALL call the `createWithdrawal` API with the UPI ID and available balance amount.

**Validates: Requirements 60.6**

---

**Property 55: Withdrawal Success Feedback**

*For any* successful withdrawal request, the application SHALL display a toast notification "Withdrawal request submitted! You'll receive payment within 24-48 hours" and SHALL close the modal.

**Validates: Requirements 60.7**

---

**Property 56: Withdrawal Error Handling**

*For any* failed withdrawal request, the application SHALL display an error message from the API response in the modal without closing it.

**Validates: Requirements 60.8**

---

**Property 57: Withdrawal History Display**

*For any* withdrawal history entry, the display SHALL include the amount, UPI ID, status (PENDING/COMPLETED/FAILED), and date.

**Validates: Requirements 60.10**


---

### Updated Component Structure (Post-Requirements 57–60)

```
src/components/
  ConfirmationModal/
    ConfirmationModal.jsx        # New - order confirmation before redirect
    ConfirmationModal.module.css
    index.js
  ReferralCard/
    ReferralCard.jsx              # New - referral code and sharing
    index.js
  WithdrawalModal/
    WithdrawalModal.jsx           # New - withdrawal request form
    index.js
  WithdrawalHistory/
    WithdrawalHistory.jsx         # New - withdrawal history table
    index.js
  TransactionList/
    TransactionList.jsx           # Updated - enhanced empty state
    TransactionList.module.css
    index.js
  WalletCard/
    WalletCard.jsx                # Updated - added withdraw button
    WalletCard.module.css
    index.js

src/services/
  api.js                          # Updated - added withdrawal and referral endpoints

src/pages/
  ProfilePage.jsx                 # Updated - added referral card and withdrawal history
  MerchantDetailPage.jsx          # Updated - added confirmation modal
```


### Updated Component Hierarchy (Post-Requirements 57–60)

```
main.jsx
└── BrowserRouter
    └── Routes
        ├── Route "/"
        │   └── App (homepage)
        │       ├── Header
        │       ├── HeroSection
        │       ├── WalletCard (with Withdraw button)
        │       ├── CategoryPills
        │       ├── MerchantGrid
        │       ├── TransactionList (enhanced empty state)
        │       ├── HowItWorks
        │       ├── Footer
        │       ├── MobileBottomNav
        │       └── WithdrawalModal ← NEW
        ├── Route "/merchants/:id"
        │   └── MerchantDetailPage
        │       ├── Hero Banner
        │       ├── CashbackCalculator
        │       ├── CategoryGrid
        │       ├── OfferCard[]
        │       └── ConfirmationModal ← NEW
        ├── Route "/admin"
        │   └── AdminPage
        └── Route "/profile"
            └── ProfilePage
                ├── Profile Card
                ├── Wallet Summary
                ├── ReferralCard ← NEW
                ├── Transaction History
                └── WithdrawalHistory ← NEW
```


### Data Flow Diagrams

#### Order Confirmation Flow

```
User clicks category/offer on merchant detail page
  ↓
Auth check (if not authenticated → show login modal)
  ↓
Store pending action { type, data } in state
  ↓
Show ConfirmationModal with merchant name
  ↓
User clicks "Got it, Take me to [Merchant]"
  ↓
Execute pending action:
  - createTransaction(merchantId, 1000, token)
  - window.open(affiliateUrl, '_blank')
  - showToast(success message)
  - dispatch 'walletUpdated' event
  ↓
Clear pending action, close modal
```

#### Withdrawal Flow

```
User clicks "Withdraw" button on WalletCard
  ↓
Show WithdrawalModal with available balance
  ↓
User enters UPI ID
  ↓
Client-side validation (alphanumeric@alphanumeric pattern)
  ↓
User clicks "Request Withdrawal"
  ↓
POST /api/v1/withdrawals { upiId, amount }
  ↓
Success:
  - showToast("Withdrawal request submitted! You'll receive payment within 24-48 hours")
  - Close modal
  - Refresh wallet data (getWallet)
  ↓
Failure:
  - Display error message in modal
  - Keep modal open for retry
```


#### Referral System Flow

```
User navigates to /profile
  ↓
Fetch referral data: GET /api/v1/users/me/referral
  ↓
Display ReferralCard with:
  - referralCode
  - friendsJoined count
  - bonusEarned amount
  ↓
User clicks "Copy Link"
  ↓
navigator.clipboard.writeText(`https://payback.app/ref/${referralCode}`)
  ↓
showToast("Referral link copied!")
  ↓
User clicks social share button (WhatsApp/Twitter/Facebook)
  ↓
window.open(social platform share URL with referral link)
```

#### Referral Bonus Notification (Polling)

```
User is authenticated on any page
  ↓
Poll GET /api/v1/users/me/referral every 30 seconds
  ↓
Compare new bonusEarned with previous value
  ↓
If bonusEarned increased:
  - Calculate bonus amount (new - previous)
  - showToast(`You earned ₹${bonusAmount} referral bonus!`)
  - Update referralData state
```


---

### Design Summary (Requirements 57–60)

#### Key Design Decisions

**Order Confirmation Modal (Req 57)**:
- Uses a pending action pattern to decouple modal display from action execution
- Modal is reusable for both category and offer clicks
- Canceling the modal clears the pending action without side effects
- Confirmation executes the full transaction flow (create transaction → open URL → refresh wallet)

**Empty States (Req 58)**:
- Transaction empty state includes actionable CTA to browse merchants
- Unauthenticated wallet state already implemented in Req 37
- No offers section uses conditional rendering (section not shown when offers array is empty)
- All empty states follow emerald/slate design system

**Referral System (Req 59)**:
- Referral data fetched from dedicated endpoint `/api/v1/users/me/referral`
- Clipboard API used for copy functionality with fallback error handling
- Social sharing uses platform-specific URL schemes (WhatsApp, Twitter, Facebook)
- Referral bonus notifications use polling (30-second interval) for MVP
- Production should consider WebSockets or Server-Sent Events for real-time notifications

**Withdrawal Flow (Req 60)**:
- Withdraw button conditionally rendered based on available balance
- UPI ID validation uses regex pattern: `alphanumeric@alphanumeric`
- Withdrawal amount is always the full available balance (no partial withdrawals in MVP)
- Withdrawal history displayed on profile page with status badges
- Modal remains open on error to allow user to correct input and retry

#### API Endpoints Added

```
POST   /api/v1/withdrawals              # Create withdrawal request
GET    /api/v1/withdrawals/me           # Get user's withdrawal history
GET    /api/v1/users/me/referral        # Get referral code and stats
```

#### Testing Strategy Updates

**Unit Tests** should cover:
- ConfirmationModal rendering with merchant name
- WithdrawalModal UPI ID validation (valid and invalid formats)
- ReferralCard clipboard copy functionality
- Empty state rendering for zero transactions
- Withdraw button visibility based on balance

**Property Tests** should cover:
- Confirmation modal trigger for any category/offer click
- UPI ID validation for any input string
- Referral link format for any referral code
- Withdrawal history display for any withdrawal array
- Empty state display for any zero-length transaction array

