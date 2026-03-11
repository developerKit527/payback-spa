# Implementation Plan: Payback SPA Frontend

## Overview

This implementation plan breaks down the Payback SPA Frontend into discrete, incremental coding tasks. The application is a React-based single-page application built with Vite, Tailwind CSS, and Axios that connects to an existing backend API at http://localhost:8080/api/v1. Each task builds on previous steps, with property-based tests and unit tests included as optional sub-tasks to validate correctness.

## Tasks

- [x] 1. Initialize project structure and dependencies
  - Create Vite + React project in payback-spa directory using `npm create vite@latest . -- --template react`
  - Install core dependencies: `npm install tailwindcss postcss autoprefixer axios lucide-react`
  - Initialize Tailwind CSS: `npx tailwindcss init -p`
  - Configure Tailwind with brand colors in tailwind.config.js (Indigo-600, Emerald-500, Amber-500, Gray-50, Gray-900)
  - Update src/index.css with Tailwind directives (@tailwind base, components, utilities)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Create API service layer
  - [x] 2.1 Implement API client in src/services/api.js
    - Create Axios instance with baseURL 'http://localhost:8080/api/v1'
    - Configure timeout (10 seconds) and default headers
    - Export getWallet(userId), getMerchants(), and trackMerchantClick(merchantId) functions
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 2.2 Write property test for API error propagation
    - **Property 1: API Error Propagation**
    - **Validates: Requirements 2.4**
    - Test that errors from backend propagate to calling components without being silently swallowed

- [x] 3. Implement Header component
  - [x] 3.1 Create src/components/Header.jsx
    - Display "Payback" logo on the left
    - Display search bar in center (placeholder input, non-functional in MVP)
    - Display wallet glance showing available balance on the right
    - Display user profile icon (from lucide-react) on the right
    - Use Indigo-600 background with white text
    - Implement responsive layout (hide search on mobile)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 10.3_

  - [ ]* 3.2 Write unit tests for Header component
    - Test logo renders with "Payback" text
    - Test wallet balance displays when provided
    - Test profile icon renders
    - Test handles missing wallet data gracefully
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Implement WalletDashboard component
  - [x] 4.1 Create src/components/WalletDashboard.jsx
    - Display three stat cards: Total Earned (Emerald-500), Pending (Amber-500), Available for Payout
    - Format currency amounts with bold, large typography
    - Display disabled "Withdraw" button
    - Implement loading state with skeleton loaders
    - Implement responsive grid (1 column mobile, 3 columns desktop)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.2, 10.3, 12.2_

  - [ ]* 4.2 Write property test for wallet data rendering
    - **Property 4: Wallet Data Rendering**
    - **Validates: Requirements 5.3**
    - Test that any valid wallet object renders all three values (totalEarned, pending, available) in the UI

  - [ ]* 4.3 Write unit tests for WalletDashboard component
    - Test displays all three wallet stats when data provided
    - Test shows loading skeletons when loading=true
    - Test formats currency correctly (INR format)
    - Test displays error state with retry button
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.2_

- [x] 5. Implement MerchantCard component
  - [x] 5.1 Create src/components/MerchantCard.jsx
    - Display merchant logo (centered, max height 80px)
    - Display cashback percentage badge (Indigo background, white text)
    - Display "Activate Cashback" button (full width, Indigo-600)
    - Implement loading state during activation (disable button, show spinner)
    - Handle button click: call onActivate prop with merchant ID
    - _Requirements: 6.4, 6.5, 8.1_

  - [ ]* 5.2 Write property test for merchant card completeness
    - **Property 5: Merchant Card Completeness**
    - **Validates: Requirements 6.4**
    - Test that any merchant object renders logo, cashback badge, and activation button

  - [ ]* 5.3 Write property test for click debouncing
    - **Property 10: Click Debouncing**
    - **Validates: Requirements 8.5**
    - Test that multiple rapid clicks only trigger one API request

  - [ ]* 5.4 Write unit tests for MerchantCard component
    - Test renders merchant logo, name, and cashback badge
    - Test disables button during activation
    - Test calls onActivate with correct merchant ID
    - Test handles missing logo URL gracefully
    - _Requirements: 6.4, 8.1, 8.5_

- [x] 6. Implement MerchantGrid component
  - [x] 6.1 Create src/components/MerchantGrid.jsx
    - Display merchants in responsive CSS Grid layout
    - Configure grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
    - Map merchants array to MerchantCard components
    - Implement loading state with skeleton card loaders (6-9 cards)
    - Pass onMerchantClick handler to each card
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.2, 10.3, 10.4, 10.5_

  - [ ]* 6.2 Write property test for merchant data rendering
    - **Property 6: Merchant Data Rendering**
    - **Validates: Requirements 7.3**
    - Test that any merchants array renders correct number of MerchantCard components

  - [ ]* 6.3 Write unit tests for MerchantGrid component
    - Test renders correct number of cards for merchants array
    - Test displays skeleton loaders when loading=true
    - Test responsive grid classes applied correctly
    - Test passes onMerchantClick to each card
    - _Requirements: 6.1, 6.2, 6.3, 7.2_

- [x] 7. Implement TransactionList component
  - [x] 7.1 Create src/components/TransactionList.jsx
    - Display transactions in table format (desktop) or stacked cards (mobile)
    - Show columns: Merchant Name, Date, Order Amount, Cashback Amount, Status
    - Display status badges with rounded pill design
    - Apply status colors: PENDING (Amber-500), CONFIRMED (Emerald-500), REJECTED (Red-500)
    - Format dates using Indian locale
    - Format currency amounts with bold typography
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 10.3, 12.2_

  - [ ]* 7.2 Write property test for transaction field display
    - **Property 11: Transaction Field Display**
    - **Validates: Requirements 9.2**
    - Test that any transaction object renders all required fields (merchant, date, amounts)

  - [ ]* 7.3 Write property test for transaction status color mapping
    - **Property 12: Transaction Status Color Mapping**
    - **Validates: Requirements 9.4, 9.5, 9.6**
    - Test that each status (PENDING, CONFIRMED, REJECTED) maps to correct color

  - [ ]* 7.4 Write unit tests for TransactionList component
    - Test renders transaction rows for each transaction
    - Test displays correct status badge colors
    - Test formats dates in Indian locale
    - Test handles empty transaction list
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 8. Checkpoint - Verify component implementations
  - Ensure all components render without errors
  - Verify Tailwind classes applied correctly
  - Check responsive behavior at different breakpoints
  - Ask the user if questions arise

- [ ] 9. Implement App.jsx with data fetching
  - [ ] 9.1 Create main App component logic
    - Set up state: wallet, merchants, transactions, loading, error
    - Implement fetchData function using Promise.all for wallet and merchants
    - Add useEffect hook to call fetchData on mount
    - Implement handleMerchantClick function for click tracking
    - Pass data and handlers as props to child components
    - _Requirements: 5.1, 5.5, 7.1, 7.5, 8.1, 8.2, 8.3_

  - [ ]* 9.2 Write property test for loading state visibility
    - **Property 2: Loading State Visibility**
    - **Validates: Requirements 5.2, 7.2, 11.1, 11.4**
    - Test that loading indicators display during any async operation

  - [ ]* 9.3 Write property test for click tracking API call
    - **Property 7: Click Tracking API Call**
    - **Validates: Requirements 8.1**
    - Test that clicking activation button sends POST to correct endpoint with merchant ID

  - [ ]* 9.4 Write property test for tracking URL navigation
    - **Property 8: Tracking URL Navigation**
    - **Validates: Requirements 8.2**
    - Test that successful click tracking opens merchant URL in new tab

  - [ ]* 9.5 Write property test for post-click state update
    - **Property 9: Post-Click State Update**
    - **Validates: Requirements 8.3**
    - Test that merchant data updates after successful click tracking

  - [ ]* 9.6 Write integration tests for App component
    - Test fetches wallet and merchants on mount
    - Test displays loading states during fetch
    - Test handles fetch errors with error notifications
    - Test passes correct props to child components
    - Test tracks merchant clicks and opens URLs
    - _Requirements: 5.1, 5.5, 7.1, 7.5, 8.1, 8.2, 8.3_

- [ ] 10. Implement error handling and notifications
  - [ ] 10.1 Add error handling to all API calls
    - Wrap API calls in try-catch blocks
    - Set error state on failures
    - Display user-friendly error messages
    - Implement retry buttons for failed operations
    - _Requirements: 5.4, 7.4, 8.4, 11.2, 11.3, 11.5_

  - [ ] 10.2 Create toast notification system
    - Implement simple toast component for error notifications
    - Display toasts for network errors, timeouts, and server errors
    - Auto-dismiss toasts after 5 seconds
    - _Requirements: 11.2, 11.3_

  - [ ]* 10.3 Write property test for error notification display
    - **Property 3: Error Notification Display**
    - **Validates: Requirements 5.4, 7.4, 8.4, 11.2, 11.3**
    - Test that any failed API request displays error notification with details

  - [ ]* 10.4 Write property test for retry mechanism availability
    - **Property 14: Retry Mechanism Availability**
    - **Validates: Requirements 11.5**
    - Test that any error state provides retry button or mechanism

  - [ ]* 10.5 Write unit tests for error handling
    - Test wallet fetch failure displays error toast
    - Test merchant fetch failure displays error toast
    - Test click tracking failure displays error toast
    - Test retry buttons trigger refetch
    - _Requirements: 5.4, 7.4, 8.4, 11.2, 11.3, 11.5_

- [ ] 11. Implement typography and visual polish
  - [ ] 11.1 Apply fintech typography styles
    - Use Inter font or sans-serif font stack
    - Apply bold, large typography to all currency amounts
    - Apply medium-weight typography to labels and secondary text
    - Use Gray-900 for main headings and body text
    - Use Gray-50 for application background
    - Ensure consistent spacing and alignment
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 11.2 Write property test for currency formatting consistency
    - **Property 13: Currency Formatting Consistency**
    - **Validates: Requirements 12.2**
    - Test that any currency value displays with bold, large typography

  - [ ]* 11.3 Write visual regression tests
    - Capture screenshots of key components
    - Test typography consistency across components
    - Test color usage matches brand guidelines
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 12. Setup testing infrastructure
  - [x] 12.1 Configure Vitest and React Testing Library
    - Install dev dependencies: vitest, @testing-library/react, @testing-library/jest-dom, jsdom
    - Create vitest.config.js with React Testing Library setup
    - Add test scripts to package.json (test, test:watch, test:coverage)
    - _Requirements: All testing requirements_

  - [x] 12.2 Configure fast-check for property-based testing
    - Install fast-check as dev dependency
    - Create test data generators (walletArbitrary, merchantArbitrary, transactionArbitrary)
    - Configure minimum 100 iterations per property test
    - Add property test tagging convention
    - _Requirements: All property testing requirements_

  - [x] 12.3 Setup MSW for API mocking
    - Install msw as dev dependency
    - Create mock handlers for /wallet/:id, /merchants, /merchants/:id/click
    - Configure MSW server for tests
    - _Requirements: All API testing requirements_

- [ ] 13. Final integration and wiring
  - [ ] 13.1 Wire all components together in App.jsx
    - Import and render Header, WalletDashboard, MerchantGrid, TransactionList
    - Pass all required props from App state to child components
    - Verify data flows correctly from API to UI
    - Test all user interactions (click tracking, retry buttons)
    - _Requirements: All requirements_

  - [ ] 13.2 Verify responsive design at all breakpoints
    - Test mobile layout (320px - 640px)
    - Test tablet layout (641px - 1024px)
    - Test desktop layout (1025px+)
    - Verify all components adapt correctly
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 13.3 Test with live backend API
    - Start backend server at http://localhost:8080
    - Verify wallet data loads correctly
    - Verify merchants display correctly
    - Test click tracking opens merchant URLs
    - Verify error handling with network disconnected
    - _Requirements: All requirements_

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Run all unit tests: `npm run test`
  - Run all property tests with 100+ iterations
  - Verify test coverage meets 80% threshold
  - Fix any failing tests
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All work must be done within the payback-spa directory
- Backend API must be running at http://localhost:8080/api/v1 for integration testing
- Checkpoints ensure incremental validation and provide opportunities for user feedback
