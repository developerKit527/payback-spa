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
    - Display cashback rate badge using `cashbackRate` field (Indigo background, white text)
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
    - Test that clicking "Shop Now →" button sends GET to correct endpoint with merchant ID

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
    - Auto-dismiss toasts after 3 seconds (per REQ-019.3)
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

---

## Tasks: Requirements 13–22

- [x] 15. Design system upgrade
  - [x] 15.1 Update color tokens and fonts
    - Add CSS custom properties (`--color-primary`, `--color-secondary`, `--color-accent`) to `index.css`
    - Update `tailwind.config.js` to map `primary` → `#FF4D00`, `secondary` → `#1A1A2E`, `accent` → `#FFD700`
    - Add Google Fonts `<link>` for Sora and DM Sans in `index.html`
    - Apply `font-family` tokens in `index.css` for body (DM Sans) and headings (Sora)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 16. Implement HeroSection component
  - [x] 16.1 Create `src/components/HeroSection/` (JSX, module.css, test, stories, index.js)
    - Diagonal gradient background `#1A1A2E → #FF4D00`
    - Headline "Shop Smart. Earn Real Cashback." in Sora font
    - Three floating cashback badges (₹127, ₹250, ₹89) with CSS keyframe `float` animation in module.css
    - Stats bar: "500+ Stores | ₹2Cr+ Cashback Paid | 1L+ Happy Users"
    - Two CTAs: "Explore Stores →" (scroll to `#merchant-grid`) and "How It Works" (scroll to `#how-it-works`)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ]* 16.2 Write unit tests for HeroSection
    - Test headline text renders
    - Test all three floating badges render
    - Test stats bar text renders
    - Test CTA buttons exist

- [x] 17. Implement CategoryPills component
  - [x] 17.1 Create `src/components/CategoryPills/` (JSX, module.css, test, stories, index.js)
    - Horizontally scrollable pill row with hidden scrollbar (CSS Module)
    - Static category list: Fashion, Electronics, Home, Beauty, Travel, Food, Health, Education
    - Active pill: `bg-primary` (#FF4D00) with white text
    - Emit `onCategoryChange(category | null)` to parent
    - _Requirements: 15.1, 15.2, 15.4, 15.5_

  - [x] 17.2 Wire category filter in App.jsx
    - Add `activeCategory` state to App.jsx
    - Create `src/utils/merchantCategories.js` with static map:
      ```js
      export const MERCHANT_CATEGORIES = {
        'Flipkart': 'Fashion', 'Myntra': 'Fashion', 'Ajio': 'Fashion',
        'Adidas': 'Fashion', 'Puma India': 'Fashion',
        'Amazon India': 'Electronics', 'Samsung': 'Electronics', 'Dell': 'Electronics',
        'Nykaa': 'Beauty', 'Mamaearth': 'Beauty',
      };
      ```
    - Filter: `merchants.filter(m => MERCHANT_CATEGORIES[m.name] === activeCategory)`
    - When no category selected, show all merchants
    - Pass `onCategoryChange` to `CategoryPills`
    - _Requirements: 15.3, 15.6_

  - [ ]* 17.3 Write property test for category filter completeness
    - **Property 16: Category Filter Completeness**
    - **Validates: Req 15.3, 15.6**
    - For any active category, rendered card count equals matching merchant count

- [x] 18. Enhance MerchantCard component
  - [x] 18.1 Update `MerchantCard.jsx`
    - Change cashback badge text to `"Upto {cashbackRate}% Cashback"` in orange pill (field is `cashbackRate`, not `cashbackPercentage`)
    - Add offer tag from static map in `src/utils/offerTags.js` (teal chip; hidden if no entry)
    - Add hover lift: `translateY(-4px)` + `shadow-xl` transition (CSS Module)
    - Add gold ribbon badge using `FEATURED_IDS` set from `src/utils/offerTags.js`: `export const FEATURED_IDS = [1, 5, 6]`; show ribbon when `FEATURED_IDS.includes(merchant.id)` — do not expect `featured` field from API
    - Change button text to `"Shop Now →"`; hover fills `bg-primary`
    - Update click handler: call `trackMerchantClick(id)` (GET /api/v1/merchants/{id}/click) → open URL returned in response body; if response URL is null, show toast "Merchant link not available yet."
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

  - [ ]* 18.2 Update MerchantCard tests
    - Test cashback badge shows "Upto X% Cashback" (using `cashbackRate` field)
    - Test offer tag renders when static map has entry
    - Test offer tag hidden when no entry
    - Test featured ribbon renders when `merchant.id` is in `FEATURED_IDS`

- [x] 19. Implement HowItWorks section
  - [x] 19.1 Create `src/components/HowItWorks/` (JSX, module.css, test, stories, index.js)
    - Section with `id="how-it-works"`
    - Three steps: "Find a Store", "Click & Shop", "Earn Cashback" with lucide icons in colored circles
    - Horizontal on desktop, vertical stack on mobile
    - `IntersectionObserver` adds `is-visible` class; CSS Module `fadeInUp` keyframe with staggered delays
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [ ]* 19.2 Write unit tests for HowItWorks
    - Test all three step titles render
    - Test section has correct `id` attribute

- [x] 20. Enhance WalletCard to unified dashboard (Req 18)
  - [x] 20.1 Refactor `WalletCard.jsx` to unified single-card layout
    - Gradient background `#1A1A2E → #2D4A6E`
    - Display Available for Payout (primary), Total Earned and Pending below
    - Count-up animation via `requestAnimationFrame` in `useEffect`
    - Skeleton loader while fetching
    - Error state: `<WifiOff />` icon + "Could not load balance"
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ]* 20.2 Write property test for count-up accuracy
    - **Property 18: Count-Up Accuracy**
    - **Validates: Req 18.3**
    - For any wallet `available` value, animation ends at exact value

- [x] 21. Implement Toast notification system (Req 19)
  - [x] 21.1 Create `src/context/ToastContext.jsx` and `src/hooks/useToast.js`
    - `ToastContext` holds toast list and `showToast(message, variant)` function
    - Auto-dismiss after 3 seconds via `setTimeout`
    - _Requirements: 19.1, 19.3_

  - [x] 21.2 Create `src/components/Toast/` (JSX, module.css, index.js)
    - Fixed bottom-right, `z-index: 50`
    - Variants: success (green), error (red), info (blue)
    - Slide-in animation keyframe in `Toast.module.css`
    - _Requirements: 19.2, 19.4, 19.5_

  - [x] 21.3 Wrap App in `ToastProvider`; replace all `alert()` calls with `showToast`
    - _Requirements: 19.6_

  - [ ]* 21.4 Write property test for toast trigger
    - **Property 15: Toast Trigger from Any Component**
    - **Validates: Req 19.1, 19.6**

- [x] 22. Implement MobileBottomNav (Req 20)
  - [x] 22.1 Create `src/components/MobileBottomNav/` (JSX, module.css, index.js)
    - Fixed bottom bar, `block md:hidden`
    - Tabs: Home, Stores, Wallet, Profile (lucide icons)
    - Active tab: `text-primary` + `border-t-2 border-primary`
    - Profile tab: non-functional placeholder
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 23. Implement Render cold start handling (Req 21)
  - [x] 23.1 Add health-poll logic to App.jsx `useEffect`
    - NOTE: `getHealth()` already exists in `src/services/api.js` — do not add a duplicate
    - Poll `getHealth()` (already exported from api.js) before `fetchData()`
    - Show "Waking up server..." banner if no response within 3s
    - Hide banner and proceed on success
    - _Requirements: 21.1, 21.2, 21.3, 21.4_

  - [ ]* 23.3 Write property test for health poll progression
    - **Property 17: Health Poll Progression**
    - **Validates: Req 21.1, 21.3, 21.4**

- [x] 24. Wire all new components into App.jsx
  - Import and render: `HeroSection`, `CategoryPills`, `HowItWorks`, `MobileBottomNav`
  - Add `id="merchant-grid"` to the merchant section wrapper
  - Ensure `ToastProvider` wraps the full app in `main.jsx`
  - _Requirements: 14.6, 15.3, 17.1, 19.6, 20.1_

- [x] 25. Final checkpoint — Requirements 13–22
  - Verify all new components render without errors
  - Run `npm test -- --run` and confirm all tests pass
  - Verify responsive behavior: mobile bottom nav visible, desktop hidden
  - Verify primary color is #FF4D00 throughout (no Indigo-600 remnants)
  - Ask the user if questions arise before closing


---

## Tasks: UI Redesign (Requirements 23–31)

- [ ] 26. Design system reset
  - [ ] 26.1 Update color tokens and font
    - Replace CSS custom properties in `index.css`: primary → #10B981, bg → #F8FAFC, surface → white, text → slate-900, text-muted → slate-500, border → slate-200
    - Update `tailwind.config.js`: primary → #10B981, remove orange/navy tokens
    - Replace Google Fonts link in `index.html`: remove Sora + DM Sans, add Inter
    - Apply `font-family: 'Inter', sans-serif` to body in `index.css`
    - DO NOT touch: src/services/api.js, src/context/ToastContext.jsx, src/utils/merchantCategories.js, src/utils/offerTags.js
    - _Requirements: 23.1–23.8_

- [ ] 27. Navbar redesign
  - [ ] 27.1 Rewrite `src/components/Header/Header.jsx`
    - Add `scrolled` state via `useEffect` scroll listener (`window.scrollY > 10`)
    - Default: `bg-white py-5`; scrolled: `bg-white/80 backdrop-blur-md border-b border-slate-200 py-3`
    - Left: emerald `<Wallet />` icon + "Payback" in font-extrabold tracking-tight
    - Center: search input `bg-slate-100 rounded-2xl focus:border-emerald-500` — hidden on mobile
    - Right: balance chip (`bg-emerald-50 text-emerald-700 rounded-full`) + "Sign In" ghost button + "Join Now" emerald button (both rounded-full)
    - Keep existing `wallet` prop for balance display — no API changes
    - _Requirements: 24.1–24.8_

  - [ ]* 27.2 Update Header tests
    - Test scrolled class applied when scrollY > 10
    - Test balance chip renders with wallet prop
    - Test Sign In and Join Now buttons render

- [ ] 28. Hero section redesign
  - [ ] 28.1 Rewrite `src/components/HeroSection/HeroSection.jsx`
    - Two-column layout: `lg:grid-cols-2 gap-12` on large screens, single column on mobile
    - Left: headline with "Cashback" in `text-emerald-500`, subtitle in `text-slate-500`, "Explore Stores →" emerald CTA, avatar social proof
    - Right: Live Activity card (`bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6`) with "Live Cashback" header + green "LIVE" badge
    - Live Activity rows: last 3 from `transactions` prop; if empty, show 3 placeholder rows
    - Remove floating badges and dark gradient background
    - Accept `transactions` prop from App.jsx (already available as `walletData.transactions`)
    - _Requirements: 25.1–25.10_

  - [ ]* 28.2 Update HeroSection tests
    - Test two-column layout classes present
    - Test "Cashback" span has text-emerald-500
    - Test Live Activity card renders
    - Test placeholder rows shown when transactions empty

- [ ] 29. Merchant card redesign
  - [ ] 29.1 Rewrite `src/components/MerchantCard/MerchantCard.jsx`
    - Container: `bg-white rounded-3xl p-6 border border-slate-200 shadow-sm group relative overflow-hidden`
    - Hover: `hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all`
    - Logo: `w-16 h-16 rounded-2xl bg-slate-100` (image or letter fallback — keep existing fallback logic)
    - Cashback: `text-emerald-500 font-bold text-xl` "Upto {cashbackRate}% Cashback"
    - Offer tag: `bg-emerald-50 text-emerald-700` pill (keep OFFER_TAGS logic)
    - Featured ribbon: keep FEATURED_IDS logic unchanged
    - Hover overlay: `absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 rounded-3xl` with centered white "Shop Now" button
    - Click logic: unchanged (GET /api/v1/merchants/{id}/click)
    - _Requirements: 26.1–26.8_

  - [ ]* 29.2 Update MerchantCard tests
    - Test hover overlay element exists with opacity-0 class
    - Test cashback uses text-emerald-500
    - Test logo container has rounded-2xl bg-slate-100

- [ ] 30. Wallet card redesign
  - [ ] 30.1 Rewrite `src/components/WalletCard/WalletCard.jsx`
    - Replace dark gradient with `bg-white rounded-3xl border border-slate-200 shadow-sm p-8`
    - Add `<Wallet />` icon + "My Wallet" heading
    - Available balance: `text-5xl font-bold text-emerald-500` with existing count-up animation
    - Two chips: "Total Earned: ₹X" (`bg-emerald-50 text-emerald-700`) and "Pending: ₹X" (`bg-amber-50 text-amber-700`)
    - Keep existing skeleton loader and WifiOff error state
    - Keep existing `wallet`, `loading`, `error` props — no API changes
    - _Requirements: 27.1–27.6_

  - [ ]* 30.2 Update WalletCard tests
    - Test bg-white card renders (not dark gradient)
    - Test available balance has text-emerald-500
    - Test Total Earned chip has bg-emerald-50
    - Test Pending chip has bg-amber-50

- [ ] 31. Transaction history redesign
  - [ ] 31.1 Rewrite `src/components/TransactionList/TransactionList.jsx`
    - Section heading: "Transaction History" `font-bold text-2xl`
    - Container: `bg-white rounded-3xl border border-slate-200 overflow-hidden`
    - Header row: `bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-400`
    - Data rows: `hover:bg-slate-50 border-t border-slate-100`
    - Status badges: PENDING → `bg-amber-50 text-amber-700`, CONFIRMED → `bg-emerald-50 text-emerald-700`, REJECTED → `bg-red-50 text-red-700`; all `rounded-full px-3 py-1 text-xs font-bold`
    - Mobile: card layout per transaction instead of table
    - _Requirements: 28.1–28.8_

  - [ ]* 31.2 Update TransactionList tests
    - Test CONFIRMED badge has bg-emerald-50 text-emerald-700
    - Test PENDING badge has bg-amber-50 text-amber-700
    - Test REJECTED badge has bg-red-50 text-red-700

- [ ] 32. How It Works redesign
  - [ ] 32.1 Rewrite `src/components/HowItWorks/HowItWorks.jsx`
    - Section: `bg-white py-24 border-y border-slate-200`
    - Each step: emerald number circle (`w-10 h-10 rounded-full bg-emerald-500 text-white`) + lucide icon + title + short description
    - Keep IntersectionObserver fadeInUp animation from HowItWorks.module.css
    - Horizontal desktop / vertical mobile layout unchanged
    - _Requirements: 29.1–29.4_

- [ ] 33. Footer
  - [ ] 33.1 Create `src/components/Footer/Footer.jsx` and `Footer/index.js`
    - `bg-white py-20`
    - 5-column grid: logo+tagline | Platform | Categories | Support | Legal
    - Links: `text-slate-500 hover:text-emerald-600 transition-colors text-sm`
    - Bottom bar: `border-t border-slate-200` + "© 2026 Payback India. All rights reserved."
    - Indian market content
    - Import and render in App.jsx after `<HowItWorks />`
    - _Requirements: 30.1–30.5_

- [ ] 34. Mobile bottom nav update + final wiring
  - [ ] 34.1 Update `src/components/MobileBottomNav/MobileBottomNav.jsx`
    - Active tab: `text-emerald-500 border-t-2 border-emerald-500` (replace text-primary/border-primary)
    - Container: `border-t border-slate-200` (replace border-gray-200)
    - No other changes
    - _Requirements: 31.1–31.3_

  - [ ] 34.2 Pass `transactions` prop to HeroSection in App.jsx
    - `<HeroSection transactions={transactions} />`
    - No other App.jsx changes

  - [ ] 34.3 Final checkpoint
    - Run `npm test -- --run` — all tests pass
    - Verify no Indigo-600 or orange (#FF4D00) remnants in components
    - Verify no dark gradient (#1A1A2E) in WalletCard
    - Verify Footer renders in App.jsx


---

## Tasks: Auth Pages (Requirements 32–37)

- [ ] 35. Auth API methods
  - [ ] 35.1 Update `src/services/api.js`
    - Export `registerUser(name, email, password)` → POST `/auth/register`
    - Export `loginUser(email, password)` → POST `/auth/login`
    - Update `getWallet` to accept optional `token`; if provided call `GET /wallet/me` with `Authorization: Bearer {token}` header; otherwise call `GET /wallet/1`
    - _Requirements: 32.1, 32.2, 32.3_

  - [ ]* 35.2 Write property test for wallet endpoint routing
    - **Property 24: Wallet Endpoint Routing**
    - **Validates: Req 32.3, 37.1, 37.2**
    - For any token value (null vs non-null), assert correct URL and headers are used

- [ ] 36. Implement AuthContext
  - [ ] 36.1 Create `src/context/AuthContext.jsx`
    - Provide `user`, `token`, `isAuthenticated`, `login()`, `register()`, `logout()`
    - On mount, read `localStorage('payback_token')` and decode with `atob()` to hydrate state
    - `login()` / `register()` save token to localStorage and decode payload to set `user`
    - `logout()` clears localStorage, resets state, calls `showToast('Logged out successfully', 'info')`
    - Export `AuthProvider` and `useAuth` hook
    - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5_

  - [ ]* 36.2 Write property test for token persistence
    - **Property 22: Token Persistence**
    - **Validates: Req 33.3, 33.4**
    - After login/register, localStorage has token; after logout, localStorage is null

  - [ ]* 36.3 Write property test for auth state hydration
    - **Property 23: Auth State Hydration**
    - **Validates: Req 33.2, 33.5**
    - For any valid JWT in localStorage on mount, isAuthenticated is true and firstName is derived correctly

- [ ] 37. Implement Login Modal
  - [ ] 37.1 Create `src/components/AuthModal/LoginModal.jsx`
    - Modal overlay (`fixed inset-0 bg-black/50 z-50`) with white card (`bg-white rounded-3xl p-8 max-w-md`)
    - Email + password fields; show/hide password toggle
    - On submit: call `auth.login()`; on success close + toast "Welcome back!"; on failure show inline "Invalid email or password"
    - Link to switch to Register modal
    - _Requirements: 34.1, 34.2, 34.3, 34.4, 34.5_

- [ ] 38. Implement Register Modal
  - [ ] 38.1 Create `src/components/AuthModal/RegisterModal.jsx`
    - Modal overlay with white card
    - Name, email, password, confirm password fields; show/hide toggles on password fields
    - Client-side validation: name ≥ 2 chars, password ≥ 6 chars, passwords match — show inline error without calling API
    - On submit: call `auth.register()`; on success close + toast "Welcome to Payback!"; on failure show inline API error
    - Link to switch to Login modal
    - _Requirements: 35.1, 35.2, 35.3, 35.4, 35.5, 35.6_

  - [ ]* 38.2 Write property test for register validation
    - **Property 25: Register Validation**
    - **Validates: Req 35.3**
    - For any invalid input combination, API is not called and inline error is shown

- [ ] 39. Update Header for auth state
  - [ ] 39.1 Update `src/components/Header/Header.jsx`
    - Read `isAuthenticated`, `user` from `useAuth()`
    - WHEN authenticated: show "Hi, {firstName}" chip + `<LogOut />` icon button
    - WHEN unauthenticated: show "Sign In" + "Join Now" buttons (existing)
    - "Sign In" calls `onSignIn` prop; "Join Now" calls `onJoinNow` prop
    - _Requirements: 36.1, 36.2, 36.3_

  - [ ]* 39.2 Update Header tests
    - Test authenticated state renders "Hi, {firstName}" chip
    - Test unauthenticated state renders Sign In + Join Now buttons
    - Test logout button calls auth.logout

- [ ] 40. Wire auth into App.jsx and main.jsx
  - [x] 40.1 Update `App.jsx`
    - Add `authModal` state (`null | 'login' | 'register'`)
    - Pass `onSignIn` / `onJoinNow` callbacks to Header
    - Render `<LoginModal>` and `<RegisterModal>` conditionally
    - Import `useAuth`; pass `token` to `getWallet(token)` in `fetchData`
    - Add `isAuthenticated` to `useEffect` dependency array so wallet re-fetches on auth change
    - WHEN `isAuthenticated` is false, render "Your wallet is waiting" prompt card (lucide Wallet icon + Sign In / Join Now buttons) instead of `<WalletCard />`
    - WHEN `isAuthenticated` is false, hide the Transaction History section entirely
    - _Requirements: 37.1, 37.2, 37.3, 37.4, 37.5, 37.6_

  - [ ] 40.2 Wrap app in `AuthProvider` in `main.jsx`
    - `<ToastProvider>` wraps `<AuthProvider>` wraps `<App />` — ToastProvider must be outer so AuthContext can call showToast during logout
    - _Requirements: 33.1_

- [ ] 41. Final checkpoint — Requirements 32–37
  - Run `npm test -- --run` and confirm all tests pass
  - Verify login flow: open modal → submit → toast → navbar shows "Hi, {name}"
  - Verify register flow: open modal → validate → submit → toast → navbar shows "Hi, {name}"
  - Verify logout: click logout → toast → navbar reverts to Sign In / Join Now
  - Verify wallet re-fetches on login (calls /wallet/me) and on logout (calls /wallet/1)
  - Ask the user if questions arise before writing any code

---

## Tasks: Transaction Creation (Requirement 38)

- [x] 42. Wire transaction creation on merchant click
  - [x] 42.1 Add `createTransaction` to `src/services/api.js`
    - Export `createTransaction(merchantId, orderAmount, token)` → `POST /api/v1/transactions` with body `{ merchantId, orderAmount }` and `Authorization: Bearer {token}` header
    - _Requirements: 38.1_

  - [x] 42.2 Update `handleMerchantActivate` in `App.jsx`
    - WHEN `isAuthenticated` is true: call `createTransaction(merchantId, 1000, token)` before opening the URL
    - On success: call `getWallet(token)` to refresh wallet + transactions state
    - On failure: show toast "Could not record transaction" but still open the merchant URL
    - WHEN `isAuthenticated` is false: skip `createTransaction`, open URL as before
    - _Requirements: 38.2, 38.3, 38.4, 38.5, 38.6_

  - [ ]* 42.3 Write property test for transaction creation guard
    - **Property 26: Transaction Creation Auth Guard**
    - **Validates: Req 38.4, 38.6**
    - When token is null, `createTransaction` is never called regardless of merchant clicked
