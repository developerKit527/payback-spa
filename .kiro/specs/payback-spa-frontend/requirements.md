# Requirements Document

## Introduction

The Payback SPA Frontend is a modern React-based single-page application that provides users with a fintech dashboard to browse merchants, activate cashback offers, and track wallet earnings. The application connects to an existing backend API at http://localhost:8080/api/v1 and implements the design specifications defined in the UI PRD.

## Glossary

- **Frontend_Application**: The React SPA built with Vite that runs in the user's browser
- **Backend_API**: The existing REST API service running at http://localhost:8080/api/v1
- **Merchant_Grid**: The responsive grid component displaying merchant cards with cashback offers
- **Wallet_Dashboard**: The hero section displaying user's total earned, pending, and available balance
- **Global_Header**: The top navigation bar containing logo, search, and wallet glance
- **Transaction_History**: The list/table component showing user's transaction records
- **API_Client**: The configured Axios instance for making HTTP requests to the Backend_API
- **User**: The end user interacting with the Frontend_Application

## Requirements

### Requirement 1: Project Infrastructure Setup

**User Story:** As a developer, I want the project properly initialized with all necessary dependencies, so that I can build the React application with the required tools.

#### Acceptance Criteria

1. THE Frontend_Application SHALL be initialized using Vite with React template inside the payback-spa directory
2. THE Frontend_Application SHALL include tailwindcss, postcss, and autoprefixer as dependencies
3. THE Frontend_Application SHALL include axios for HTTP requests
4. THE Frontend_Application SHALL include lucide-react for icon components
5. THE Frontend_Application SHALL configure Tailwind with brand colors: Indigo-600 (#4F46E5), Emerald-500 (#10B981), Amber-500 (#F59E0B), Gray-50 (#F9FAFB), and Gray-900 (#111827)

### Requirement 2: API Communication Layer

**User Story:** As a developer, I want a centralized API client, so that all HTTP requests use consistent configuration.

#### Acceptance Criteria

1. THE API_Client SHALL be created in src/services/api.js using Axios
2. THE API_Client SHALL configure baseURL as 'http://localhost:8080/api/v1'
3. THE API_Client SHALL export a configured Axios instance for use throughout the application
4. WHEN the Backend_API returns an error response, THE API_Client SHALL propagate the error to the calling component

### Requirement 3: Global Header Component

**User Story:** As a user, I want to see a consistent navigation header, so that I can access key features from any page.

#### Acceptance Criteria

1. THE Global_Header SHALL display the application logo with text "Payback" on the left side
2. THE Global_Header SHALL display a search bar for merchants in the center
3. THE Global_Header SHALL display a compact wallet glance showing available balance on the right side
4. THE Global_Header SHALL display a user profile icon on the right side
5. THE Global_Header SHALL use the Primary brand color (Indigo-600) for interactive elements

### Requirement 4: Wallet Dashboard Display

**User Story:** As a user, I want to see my wallet summary at the top of the page, so that I can quickly understand my earnings status.

#### Acceptance Criteria

1. THE Wallet_Dashboard SHALL display Total Earned amount in Emerald-500 color with bold fintech typography
2. THE Wallet_Dashboard SHALL display Pending Amount in Amber-500 color with bold fintech typography
3. THE Wallet_Dashboard SHALL display Available for Payout amount with bold fintech typography
4. THE Wallet_Dashboard SHALL display a "Withdraw" button that is currently disabled
5. THE Wallet_Dashboard SHALL format all currency amounts using bold, large-sized numbers

### Requirement 5: Wallet Data Fetching

**User Story:** As a user, I want my wallet data loaded automatically, so that I see my current balance when the app opens.

#### Acceptance Criteria

1. WHEN the Frontend_Application loads, THE Frontend_Application SHALL fetch wallet data for User ID 1 from the Backend_API endpoint /wallet/1
2. WHEN the wallet data fetch is in progress, THE Wallet_Dashboard SHALL display a loading state
3. WHEN the wallet data fetch succeeds, THE Wallet_Dashboard SHALL display the received wallet information
4. IF the wallet data fetch fails, THEN THE Frontend_Application SHALL display an error notification to the User
5. THE Frontend_Application SHALL use React useEffect hook in App.jsx to trigger the wallet data fetch on mount

### Requirement 6: Merchant Grid Display

**User Story:** As a user, I want to browse available merchants in a grid layout, so that I can easily find cashback offers.

#### Acceptance Criteria

1. THE Merchant_Grid SHALL display merchant cards in a responsive grid layout
2. WHILE viewing on mobile devices, THE Merchant_Grid SHALL display 1 column
3. WHILE viewing on desktop devices, THE Merchant_Grid SHALL display 3 or more columns
4. THE Merchant_Grid SHALL display each merchant card with centered logo, cashback rate badge, and activation button
5. THE Merchant_Grid SHALL use the Primary brand color (Indigo-600) for the "Activate Cashback" button

### Requirement 7: Merchant Data Fetching

**User Story:** As a user, I want to see available merchants when the app loads, so that I can browse cashback offers immediately.

#### Acceptance Criteria

1. WHEN the Frontend_Application loads, THE Frontend_Application SHALL fetch merchant data from the Backend_API endpoint /merchants
2. WHEN the merchant data fetch is in progress, THE Merchant_Grid SHALL display skeleton loaders
3. WHEN the merchant data fetch succeeds, THE Merchant_Grid SHALL display the received merchant cards
4. IF the merchant data fetch fails, THEN THE Frontend_Application SHALL display an error notification to the User
5. THE Frontend_Application SHALL fetch wallet data and merchant data simultaneously using Promise.all

### Requirement 8: Cashback Activation Flow

**User Story:** As a user, I want to activate cashback for a merchant, so that I can earn rewards on my purchases.

#### Acceptance Criteria

1. WHEN a User clicks the "Activate Cashback" button on a merchant card, THE Frontend_Application SHALL send a POST request to /api/v1/merchants/{id}/click
2. WHEN the click tracking request succeeds, THE Frontend_Application SHALL open the merchant's manualTrackingUrl in a new browser tab
3. WHEN the click tracking request succeeds, THE Frontend_Application SHALL update the local merchant data or refresh from the Backend_API
4. IF the click tracking request fails, THEN THE Frontend_Application SHALL display an error notification to the User
5. THE Frontend_Application SHALL prevent multiple simultaneous click requests for the same merchant

### Requirement 9: Transaction History Display

**User Story:** As a user, I want to see my transaction history, so that I can track my cashback earnings.

#### Acceptance Criteria

1. THE Transaction_History SHALL display a list or table of transactions below the Merchant_Grid
2. THE Transaction_History SHALL display merchant name, date, order amount, and cashback amount for each transaction
3. THE Transaction_History SHALL display status badges using rounded pill design
4. THE Transaction_History SHALL display PENDING status in Amber-500 color
5. THE Transaction_History SHALL display CONFIRMED status in Emerald-500 color
6. THE Transaction_History SHALL display REJECTED status in an appropriate error color

### Requirement 10: Responsive Design Implementation

**User Story:** As a user on any device, I want the application to work well on my screen size, so that I have a good experience regardless of device.

#### Acceptance Criteria

1. THE Frontend_Application SHALL implement a mobile-first responsive design approach
2. THE Frontend_Application SHALL use Tailwind CSS utility classes for responsive breakpoints
3. WHILE viewing on mobile devices, THE Frontend_Application SHALL display components in single-column layout
4. WHILE viewing on tablet devices, THE Frontend_Application SHALL display components in appropriate multi-column layouts
5. WHILE viewing on desktop devices, THE Frontend_Application SHALL display components in optimized wide-screen layouts

### Requirement 11: Loading and Error States

**User Story:** As a user, I want clear feedback when data is loading or errors occur, so that I understand what's happening.

#### Acceptance Criteria

1. WHILE data is being fetched from the Backend_API, THE Frontend_Application SHALL display skeleton loaders or loading indicators
2. IF the Backend_API is unreachable, THEN THE Frontend_Application SHALL display a toast notification with error details
3. IF a network request times out, THEN THE Frontend_Application SHALL display an appropriate error message
4. THE Frontend_Application SHALL provide visual feedback during all asynchronous operations
5. THE Frontend_Application SHALL allow Users to retry failed operations

### Requirement 12: Typography and Visual Design

**User Story:** As a user, I want a polished, professional interface, so that I trust the application with my financial information.

#### Acceptance Criteria

1. THE Frontend_Application SHALL use Inter or a sans-serif font stack for all text
2. THE Frontend_Application SHALL display currency amounts using large, bold typography
3. THE Frontend_Application SHALL display labels and secondary text using medium-weight typography
4. THE Frontend_Application SHALL use Gray-900 (#111827) for main headings and body text
5. THE Frontend_Application SHALL use Gray-50 (#F9FAFB) for the application background
6. THE Frontend_Application SHALL maintain consistent spacing and alignment throughout all components
