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

### Requirement 13: Design System Upgrade

**User Story:** As a user, I want a modern, energetic interface, so that the app feels trustworthy and engaging.

#### Acceptance Criteria

1. THE Frontend_Application SHALL replace the Indigo-600 primary color with #FF4D00 (orange-red) as the resolved value for all references to "Primary brand color" in existing requirements
2. THE Frontend_Application SHALL add secondary color #1A1A2E (deep navy) and accent color #FFD700 (gold) to the design system
3. THE Frontend_Application SHALL load Sora (headings) and DM Sans (body) fonts from Google Fonts via index.html
4. THE Frontend_Application SHALL define all color tokens as CSS custom properties in index.css
5. THE Frontend_Application SHALL maintain Tailwind v4 + CSS Modules as the only styling tools

### Requirement 14: Hero Section

**User Story:** As a visitor, I want an engaging hero section, so that I immediately understand what Payback offers.

#### Acceptance Criteria

1. THE Frontend_Application SHALL display a full-width hero section above the merchant grid
2. THE HeroSection SHALL display headline "Shop Smart. Earn Real Cashback." in Sora font
3. THE HeroSection SHALL display a diagonal gradient background from #1A1A2E to #FF4D00
4. THE HeroSection SHALL display three floating cashback badges (₹127, ₹250, ₹89) using CSS keyframe float animation defined in a CSS Module
5. THE HeroSection SHALL display a stats bar: "500+ Stores | ₹2Cr+ Cashback Paid | 1L+ Happy Users"
6. THE HeroSection SHALL display two CTAs: "Explore Stores →" (scrolls to merchant grid) and "How It Works" (scrolls to how-it-works section)

### Requirement 15: Category Filter

**User Story:** As a user, I want to filter merchants by category, so that I can find relevant stores faster.

#### Acceptance Criteria

1. THE Frontend_Application SHALL display a horizontally scrollable category pill row above the merchant grid
2. THE CategoryPills SHALL include: Fashion, Electronics, Home, Beauty, Travel, Food, Health, Education
3. WHEN a User clicks a category pill, THE Merchant_Grid SHALL filter to show only merchants in that category
4. THE active category pill SHALL use bg-primary (#FF4D00) with white text
5. THE CategoryPills scrollbar SHALL be hidden using a CSS Module utility class
6. WHEN no category is selected, THE Merchant_Grid SHALL display all merchants

### Requirement 16: Enhanced Merchant Card

**User Story:** As a user, I want richer merchant cards, so that I can see offers and cashback rates at a glance.

#### Acceptance Criteria

1. THE MerchantCard SHALL display cashback rate as "Upto {cashbackRate}% Cashback" in an orange pill badge
2. THE MerchantCard SHALL display an offer tag (e.g. "Sale Live", "Trending", "B1G1") sourced from a hardcoded static map in the frontend keyed by merchant id or name; if no match exists, no tag is shown
3. THE MerchantCard SHALL lift on hover using translateY(-4px) with shadow-xl transition
4. THE MerchantCard SHALL display a gold ribbon badge for featured merchants using a CSS Module
5. THE MerchantCard "Shop Now →" button SHALL fill bg-primary (#FF4D00) on hover with smooth transition
6. WHEN a User clicks a MerchantCard, THE Frontend_Application SHALL call GET /api/v1/merchants/{id}/click then open the returned URL in a new tab

### Requirement 17: How It Works Section

**User Story:** As a new visitor, I want to understand how Payback works, so that I feel confident using it.

#### Acceptance Criteria

1. THE Frontend_Application SHALL display a "How It Works" section with id="how-it-works" below the merchant grid
2. THE HowItWorks section SHALL display 3 steps: "Find a Store", "Click & Shop", "Earn Cashback"
3. THE HowItWorks steps SHALL display horizontally on desktop and vertically stacked on mobile
4. THE HowItWorks steps SHALL use lucide-react icons inside colored circles
5. WHEN the section enters the viewport, THE HowItWorks steps SHALL animate in using IntersectionObserver fade-in-up

### Requirement 18: Enhanced Wallet Dashboard

**User Story:** As a user, I want a more prominent wallet display, so that my balance feels like a financial asset.

#### Acceptance Criteria

1. THE WalletCard SHALL be a single unified card replacing the previous 3-card layout, displaying Total Earned, Pending, and Available for Payout together
2. THE WalletCard SHALL display a gradient card background from #1A1A2E to #2D4A6E
3. THE WalletCard balance number SHALL animate with a count-up effect on load using vanilla JS
4. THE WalletCard SHALL display pending amount in amber below the main balance
5. THE WalletCard SHALL show a skeleton loader while GET /api/v1/wallet/1 is fetching
6. THE WalletCard SHALL show a lucide WifiOff icon with "Could not load balance" on fetch error

### Requirement 19: Toast Notification System

**User Story:** As a user, I want non-intrusive feedback for actions, so that I know when things succeed or fail.

#### Acceptance Criteria

1. THE Frontend_Application SHALL implement a ToastContext and useToast hook
2. THE Toast SHALL appear fixed at bottom-right with z-index 50
3. THE Toast SHALL auto-dismiss after 3 seconds
4. THE Toast SHALL support variants: success (green), error (red), info (blue)
5. THE Toast slide-in animation SHALL be defined in a CSS Module keyframe
6. ANY component SHALL be able to trigger a toast via the useToast hook

### Requirement 20: Mobile Navigation

**User Story:** As a mobile user, I want a bottom navigation bar, so that key sections are always reachable with my thumb.

#### Acceptance Criteria

1. THE Frontend_Application SHALL display a fixed bottom navigation bar on mobile only (hidden at md breakpoint)
2. THE MobileBottomNav SHALL display 4 tabs: Home, Stores, Wallet, Profile using lucide-react icons
3. THE active tab SHALL display text-primary (#FF4D00) with a top border accent line
4. THE MobileBottomNav SHALL have bg-white border-t shadow-lg styling
5. THE Profile tab SHALL be a non-functional placeholder with no route or page; clicking it does nothing

### Requirement 21: Render Cold Start Handling

**User Story:** As a user, I want feedback when the backend is waking up, so that I don't think the app is broken.

#### Acceptance Criteria

1. WHEN GET /api/v1/health takes longer than 3 seconds to respond, THE Frontend_Application SHALL display a "Waking up server..." message
2. THE Frontend_Application SHALL poll /api/v1/health on startup before fetching merchants and wallet data
3. WHEN the health check succeeds, THE Frontend_Application SHALL proceed with normal data fetching
4. THE "Waking up server..." message SHALL disappear automatically once the health check succeeds

### Requirement 22: API Service Layer

**User Story:** As a developer, I want all API calls centralized, so that endpoint changes only require updating one file.

#### Acceptance Criteria

1. THE api.js service SHALL export named functions: getMerchants, trackMerchantClick, getWallet, getHealth
2. ALL components SHALL import from src/services/api.js — no raw fetch or axios calls inside components
3. THE api.js SHALL read base URL from import.meta.env.VITE_API_URL with fallback to http://localhost:8080
4. THE api.js SHALL use the existing configured Axios instance (no second Axios instance)

---

## Requirements: UI Redesign (REQ-023–031)

### Requirement 23: Design System Reset

**User Story:** As a user, I want a clean, modern interface using emerald and slate tones, so that the app feels fresh and trustworthy.

#### Acceptance Criteria

1. THE Frontend_Application SHALL replace the primary color token with emerald-500 (#10B981)
2. THE Frontend_Application SHALL replace the background color with slate-50 (#F8FAFC)
3. THE Frontend_Application SHALL use white as the surface/card color
4. THE Frontend_Application SHALL use slate-900 as the primary text color and slate-500 as secondary text
5. THE Frontend_Application SHALL use slate-200 as the default border color
6. THE Frontend_Application SHALL replace Sora and DM Sans with Inter (loaded from Google Fonts in index.html)
7. THE Frontend_Application SHALL update tailwind.config.js, index.css CSS custom properties, and index.html font link accordingly
8. THE Frontend_Application SHALL NOT change any file in src/services/, src/context/, src/utils/merchantCategories.js, or src/utils/offerTags.js

### Requirement 24: Navbar Redesign

**User Story:** As a user, I want a sticky, polished navbar that adapts on scroll, so that navigation always feels accessible and premium.

#### Acceptance Criteria

1. THE Header SHALL be sticky with z-50
2. THE Header default state SHALL be bg-white py-5
3. WHEN the user scrolls down, THE Header SHALL transition to bg-white/80 backdrop-blur-md border-b border-slate-200 py-3
4. THE Header left side SHALL display an emerald Wallet icon and "Payback" text in font-extrabold tracking-tight
5. THE Header center SHALL display a search input with bg-slate-100, focus:border-emerald-500, rounded-2xl styling; hidden on mobile
6. THE Header right side SHALL display a balance chip, a "Sign In" ghost button (rounded-full), and a "Join Now" emerald button (rounded-full)
7. THE balance chip SHALL display the available balance fetched from GET /api/v1/wallet/1 using the existing App.jsx data flow
8. THE Header SHALL NOT change any API call or data fetching logic

### Requirement 25: Hero Section Redesign

**User Story:** As a visitor, I want a two-column hero with a live activity card, so that I immediately see real cashback activity and feel confident.

#### Acceptance Criteria

1. THE HeroSection SHALL use a two-column layout on large screens (lg:grid-cols-2 gap-12) and single column on mobile
2. THE left column SHALL display headline "Shop Smart. Earn Real Cashback." in text-5xl lg:text-7xl font-bold tracking-tight with "Cashback" in emerald-500
3. THE left column SHALL display subtitle "Browse 500+ Indian stores, activate cashback in one click" in text-xl text-slate-500
4. THE left column SHALL display a "Explore Stores →" CTA button in emerald with rounded-full and shadow-lg shadow-emerald-500/25
5. THE left column SHALL display social proof text "+1L users saving today" with 3 overlapping avatar circles
6. THE right column SHALL display a "Live Activity" card: bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6
7. THE Live Activity card SHALL display a "Live Cashback" header with a green "LIVE" badge
8. THE Live Activity card SHALL show the last 3 transactions from the wallet transactions array (from GET /api/v1/wallet/1)
9. IF no transactions exist, THE Live Activity card SHALL show 3 placeholder rows using top merchant names
10. THE HeroSection SHALL NOT change any API call or data fetching logic

### Requirement 26: Merchant Card Redesign

**User Story:** As a user, I want merchant cards with a hover overlay, so that the interaction feels modern and engaging.

#### Acceptance Criteria

1. THE MerchantCard SHALL use bg-white rounded-3xl p-6 border border-slate-200 shadow-sm styling
2. THE MerchantCard SHALL apply hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all on hover
3. THE MerchantCard logo SHALL be w-16 h-16 rounded-2xl bg-slate-100 (image or letter fallback)
4. THE MerchantCard SHALL display cashback as "Upto {cashbackRate}% Cashback" in text-emerald-500 font-bold text-xl
5. THE MerchantCard offer tag SHALL use an emerald pill style
6. THE MerchantCard SHALL keep the FEATURED_IDS gold ribbon logic from src/utils/offerTags.js unchanged
7. THE MerchantCard SHALL display a hover overlay: absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 rounded-3xl with a centered white "Shop Now" button
8. THE MerchantCard click SHALL continue to call GET /api/v1/merchants/{id}/click and open the returned URL (existing logic unchanged)

### Requirement 27: Wallet Card Redesign

**User Story:** As a user, I want a clean white wallet card, so that my balance feels clear and prominent.

#### Acceptance Criteria

1. THE WalletCard SHALL replace the dark gradient with bg-white rounded-3xl border border-slate-200 shadow-sm p-8
2. THE WalletCard SHALL display a Wallet icon and "My Wallet" heading
3. THE WalletCard available balance SHALL be displayed as text-5xl font-bold text-emerald-500 with count-up animation
4. THE WalletCard SHALL display two chips below the balance: "Total Earned: ₹X" in bg-emerald-50 text-emerald-700 and "Pending: ₹X" in bg-amber-50 text-amber-700
5. THE WalletCard SHALL keep the existing GET /api/v1/wallet/1 data source, skeleton loader, and error state
6. THE WalletCard error state SHALL continue to show WifiOff icon and "Could not load balance"

### Requirement 28: Transaction History Redesign

**User Story:** As a user, I want a clean transaction table, so that my history is easy to scan.

#### Acceptance Criteria

1. THE TransactionList section heading SHALL be "Transaction History" in font-bold text-2xl
2. THE TransactionList container SHALL use bg-white rounded-3xl border border-slate-200 overflow-hidden
3. THE TransactionList header row SHALL use bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-400
4. THE TransactionList data rows SHALL apply hover:bg-slate-50 border-t border-slate-100
5. THE PENDING status badge SHALL use bg-amber-50 text-amber-700 rounded-full px-3 py-1 text-xs font-bold
6. THE CONFIRMED status badge SHALL use bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-bold
7. THE REJECTED status badge SHALL use bg-red-50 text-red-700 rounded-full px-3 py-1 text-xs font-bold
8. ON mobile, THE TransactionList SHALL display a card layout instead of a table

### Requirement 29: How It Works Redesign

**User Story:** As a visitor, I want a clean, white How It Works section, so that the steps are easy to read.

#### Acceptance Criteria

1. THE HowItWorks section SHALL use bg-white py-24 border-y border-slate-200
2. THE HowItWorks steps SHALL display emerald number circles alongside lucide icons, step title, and a short description
3. THE HowItWorks layout SHALL be horizontal on desktop and vertical stack on mobile
4. THE HowItWorks SHALL keep the existing IntersectionObserver fade-in-up animation

### Requirement 30: Footer

**User Story:** As a user, I want a professional footer, so that the app feels complete and trustworthy.

#### Acceptance Criteria

1. THE Frontend_Application SHALL include a Footer component with bg-white py-20
2. THE Footer SHALL display a 5-column grid on desktop: logo+tagline, Platform, Categories, Support, Legal
3. THE Footer links SHALL use text-slate-500 hover:text-emerald-600 transition-colors
4. THE Footer bottom bar SHALL display a border-t border-slate-200 with "© 2026 Payback India. All rights reserved."
5. THE Footer content SHALL use Indian market context (not US)

### Requirement 31: Mobile Bottom Nav Update

**User Story:** As a mobile user, I want the bottom nav to match the new emerald design system.

#### Acceptance Criteria

1. THE MobileBottomNav active tab SHALL use text-emerald-500 border-t-2 border-emerald-500
2. THE MobileBottomNav SHALL use bg-white border-t border-slate-200 shadow-lg styling
3. THE MobileBottomNav SHALL NOT change tab structure, icons, or scroll behavior

---

## Requirements: Auth Pages (REQ-032–037)

### Requirement 32: Auth API Methods

**User Story:** As a developer, I want centralized auth API calls, so that login and register use the same api.js pattern as other endpoints.

#### Acceptance Criteria

1. THE api.js SHALL export `registerUser(name, email, password)` that sends POST to `/api/v1/auth/register`
2. THE api.js SHALL export `loginUser(email, password)` that sends POST to `/api/v1/auth/login`
3. THE `getWallet` function SHALL accept an optional `token` parameter; if token is provided, it SHALL call `GET /api/v1/wallet/me` with an `Authorization: Bearer {token}` header; if no token is provided, it SHALL call `GET /api/v1/wallet/1`

### Requirement 33: Auth Context

**User Story:** As a developer, I want global auth state, so that any component knows if the user is logged in.

#### Acceptance Criteria

1. THE Frontend_Application SHALL provide an `AuthContext` exposing: `user`, `token`, `isAuthenticated`, `login()`, `register()`, `logout()`
2. ON mount, `AuthContext` SHALL read the token from `localStorage` key `'payback_token'`
3. ON successful login or register, the token SHALL be saved to `localStorage` under key `'payback_token'`
4. ON logout, `localStorage` SHALL be cleared and auth state SHALL be reset to unauthenticated
5. THE JWT payload SHALL be decoded client-side using `atob()` to extract user info (no external JWT library)

### Requirement 34: Login Modal

**User Story:** As a user, I want a login modal, so that I can sign in without leaving the page.

#### Acceptance Criteria

1. THE "Sign In" button in the navbar SHALL open a modal overlay (not navigate to a new page)
2. THE Login modal SHALL contain email and password fields with a show/hide password toggle
3. WHEN login succeeds, the modal SHALL close and a toast SHALL display "Welcome back!"
4. WHEN login fails, the modal SHALL display an inline error message "Invalid email or password"
5. THE Login modal SHALL include a link to switch to the Register modal

### Requirement 35: Register Modal

**User Story:** As a new user, I want a register modal, so that I can create an account without leaving the page.

#### Acceptance Criteria

1. THE "Join Now" button in the navbar SHALL open a modal overlay (not navigate to a new page)
2. THE Register modal SHALL contain name, email, password, and confirm password fields
3. CLIENT-SIDE validation SHALL enforce: name minimum 2 characters, password minimum 6 characters, passwords must match
4. WHEN registration succeeds, the modal SHALL close and a toast SHALL display "Welcome to Payback!"
5. WHEN registration fails, the modal SHALL display an inline error from the API response
6. THE Register modal SHALL include a link to switch to the Login modal

### Requirement 36: Authenticated Navbar State

**User Story:** As a logged-in user, I want the navbar to show my name and a logout button, so that I know I am signed in.

#### Acceptance Criteria

1. WHEN `isAuthenticated` is true, the navbar SHALL display a "Hi, {firstName}" chip and a logout icon button
2. WHEN `isAuthenticated` is false, the navbar SHALL display the "Sign In" ghost button and the "Join Now" emerald button
3. WHEN the user clicks logout, the token SHALL be cleared, auth state SHALL be reset, and a toast SHALL display "Logged out successfully"

### Requirement 37: Authenticated Wallet Fetching

**User Story:** As a logged-in user, I want my personal wallet data, so that I see my own balance not a hardcoded user.

#### Acceptance Criteria

1. WHEN `isAuthenticated` is true, `App.jsx` SHALL fetch `GET /api/v1/wallet/me` with the JWT token in the `Authorization` header
2. WHEN `isAuthenticated` is false, `App.jsx` SHALL fetch `GET /api/v1/wallet/1` as a public fallback
3. `App.jsx` SHALL re-fetch wallet data whenever the auth state changes (login, logout, or token restored from localStorage)
4. WHEN `isAuthenticated` is false, the wallet section SHALL display a "Your wallet is waiting" prompt card with a lucide `Wallet` icon, a short description, and Sign In / Join Now buttons instead of the WalletCard component
5. WHEN `isAuthenticated` is false, the Transaction History section SHALL be hidden entirely
6. WHEN `isAuthenticated` is true, both the WalletCard and Transaction History section SHALL be visible

### Requirement 38: Transaction Creation from Frontend

**User Story:** As a logged-in user, I want clicking "Shop Now" on a merchant card to record a transaction, so that my cashback is tracked in my wallet.

#### Acceptance Criteria

1. THE `api.js` SHALL export `createTransaction(merchantId, orderAmount, token)` that sends `POST /api/v1/transactions` with body `{ merchantId, orderAmount }` and `Authorization: Bearer {token}` header
2. WHEN a logged-in user clicks "Shop Now" on a merchant card, `App.jsx` SHALL call `createTransaction` with the merchant's ID, a default `orderAmount` of `1000`, and the current JWT token before opening the merchant URL
3. WHEN `createTransaction` succeeds, `App.jsx` SHALL refresh wallet data by calling `getWallet(token)` so the new transaction appears in the wallet and transaction history
4. WHEN `isAuthenticated` is false, `App.jsx` SHALL skip the `createTransaction` call and only open the merchant URL (existing behaviour)
5. IF `createTransaction` fails, `App.jsx` SHALL show a toast "Could not record transaction" but SHALL still open the merchant URL so the user is not blocked
6. THE `createTransaction` function SHALL NOT be called if `token` is null or undefined

---

## Requirements: Merchant Detail Page (REQ-043–048)

### Requirement 43: React Router Setup

**User Story:** As a developer, I want client-side routing, so that users can navigate between pages without full page reloads.

#### Acceptance Criteria

1. THE Frontend_Application SHALL install and configure react-router-dom v6
2. THE Frontend_Application SHALL define these routes: `/` → HomePage (existing App.jsx content), `/merchants/:id` → MerchantDetailPage (new)
3. THE Frontend_Application SHALL use `BrowserRouter` in `main.jsx`
4. ALL existing functionality SHALL remain unchanged

### Requirement 44: Merchant Detail Page

**User Story:** As a user, I want to see a dedicated page for each merchant with categories and offers, so that I can choose what to shop for before activating cashback.

#### Acceptance Criteria

1. THE Frontend_Application SHALL create a `/merchants/:id` page
2. THE page SHALL fetch `GET /api/v1/merchants/{id}` on load
3. THE page SHALL display: merchant logo, name, cashback rate prominently
4. THE page SHALL display a "← Back to Stores" link returning to homepage
5. THE page SHALL display merchant stats: cashback rate badge, "X categories available"
6. IF merchant not found, THE page SHALL show a 404 message
7. THE page SHALL show a skeleton loader while fetching

### Requirement 45: Cashback Calculator on Merchant Page

**User Story:** As a user, I want to calculate my cashback before shopping, so that I feel motivated to shop through Payback.

#### Acceptance Criteria

1. THE MerchantDetailPage SHALL display a cashback calculator section
2. THE calculator SHALL have an input field: "I plan to spend: ₹____"
3. AS the user types, THE calculator SHALL update live: "You will earn: ₹XX.XX cashback"
4. THE calculation SHALL be: `cashback = inputAmount × (merchant.cashbackRate / 100)`
5. THE calculator SHALL display: "That's like X% OFF your purchase!"
6. THE calculator CTA button text SHALL update dynamically: "Shop on {merchantName} & Earn ₹XX →"
7. IF input is empty or zero, THE button SHALL show: "Activate Cashback & Shop →"

### Requirement 46: Merchant Category Grid

**User Story:** As a user, I want to see merchant categories with cashback rates, so that I can navigate directly to what I want to buy.

#### Acceptance Criteria

1. THE MerchantDetailPage SHALL display a "Shop by Category" section
2. THE categories SHALL be displayed in a responsive grid: 3 columns mobile, 4 columns desktop
3. EACH category card SHALL display: icon (emoji), category name, cashback rate
4. WHEN a user clicks a category AND is authenticated, THE app SHALL:
   - Call `POST /api/v1/transactions` with `{ merchantId, orderAmount: 1000 }`
   - Open `category.affiliateUrl` in a new tab
   - Show toast "Cashback activated! Shop and earn ₹XX"
5. WHEN a user clicks a category AND is NOT authenticated, THE app SHALL open the Login modal
6. AFTER transaction created, THE wallet data SHALL refresh

### Requirement 47: Merchant Offers Section

**User Story:** As a user, I want to see current deals and offers for a merchant, so that I can get the best value.

#### Acceptance Criteria

1. THE MerchantDetailPage SHALL display a "Today's Best Deals" section if offers exist
2. EACH offer card SHALL display: title, description, discountText badge, CTA button
3. THE offer CTA button text SHALL be "Activate Deal →"
4. WHEN a user clicks an offer AND is authenticated, THE app SHALL:
   - Call `POST /api/v1/transactions` with `{ merchantId, orderAmount: 1000 }`
   - Open `offer.affiliateUrl` in a new tab
   - Show toast "Deal activated! Cashback tracking started"
5. WHEN a user clicks an offer AND is NOT authenticated, THE app SHALL open the Login modal

### Requirement 48: Merchant Page Navigation from Homepage

**User Story:** As a user, I want clicking a merchant card on the homepage to take me to the merchant detail page, so that I can see full details before shopping.

#### Acceptance Criteria

1. WHEN a logged-in user clicks "Shop Now" on a MerchantCard, THE app SHALL navigate to `/merchants/{id}` instead of directly opening the affiliate URL
2. WHEN a guest user clicks "Shop Now" on a MerchantCard, THE app SHALL open the Login modal
3. THE existing click tracking `GET /api/v1/merchants/{id}/click` SHALL still be called when navigating to merchant page
4. THE MerchantCard SHALL use react-router-dom `useNavigate` hook for navigation

---

## Requirements: Merchant Detail Page (REQ-043–048)

### Requirement 43: React Router Setup

**User Story:** As a developer, I want client-side routing, so that users can navigate between pages without full page reloads.

#### Acceptance Criteria

1. THE Frontend_Application SHALL install and configure react-router-dom v6
2. THE Frontend_Application SHALL define these routes: `/` → HomePage (existing App.jsx content), `/merchants/:id` → MerchantDetailPage (new)
3. THE Frontend_Application SHALL use `BrowserRouter` in `main.jsx`
4. ALL existing functionality SHALL remain unchanged

### Requirement 44: Merchant Detail Page

**User Story:** As a user, I want to see a dedicated page for each merchant with categories and offers, so that I can choose what to shop for before activating cashback.

#### Acceptance Criteria

1. THE Frontend_Application SHALL create a `/merchants/:id` page
2. THE page SHALL fetch `GET /api/v1/merchants/{id}` on load
3. THE page SHALL display: merchant logo, name, cashback rate prominently
4. THE page SHALL display a "← Back to Stores" link returning to homepage
5. THE page SHALL display merchant stats: cashback rate badge, "X categories available"
6. IF merchant not found, THE page SHALL show a 404 message
7. THE page SHALL show a skeleton loader while fetching

### Requirement 45: Cashback Calculator on Merchant Page

**User Story:** As a user, I want to calculate my cashback before shopping, so that I feel motivated to shop through Payback.

#### Acceptance Criteria

1. THE MerchantDetailPage SHALL display a cashback calculator section
2. THE calculator SHALL have an input field: "I plan to spend: ₹____"
3. AS the user types, THE calculator SHALL update live: "You will earn: ₹XX.XX cashback"
4. THE calculation SHALL be: `cashback = inputAmount × (merchant.cashbackRate / 100)`
5. THE calculator SHALL display: "That's like X% OFF your purchase!"
6. THE calculator CTA button text SHALL update dynamically: "Shop on {merchantName} & Earn ₹XX →"
7. IF input is empty or zero, THE button SHALL show: "Activate Cashback & Shop →"

### Requirement 46: Merchant Category Grid

**User Story:** As a user, I want to see merchant categories with cashback rates, so that I can navigate directly to what I want to buy.

#### Acceptance Criteria

1. THE MerchantDetailPage SHALL display a "Shop by Category" section
2. THE categories SHALL be displayed in a responsive grid: 3 columns mobile, 4 columns desktop
3. EACH category card SHALL display: icon (emoji), category name, cashback rate
4. WHEN a user clicks a category AND is authenticated, THE app SHALL:
   - Call `POST /api/v1/transactions` with `{ merchantId, orderAmount: 1000 }`
   - Open `category.affiliateUrl` in a new tab
   - Show toast "Cashback activated! Shop and earn ₹XX"
5. WHEN a user clicks a category AND is NOT authenticated, THE app SHALL open the Login modal
6. AFTER transaction created, THE wallet data SHALL refresh

### Requirement 47: Merchant Offers Section

**User Story:** As a user, I want to see current deals and offers for a merchant, so that I can get the best value.

#### Acceptance Criteria

1. THE MerchantDetailPage SHALL display a "Today's Best Deals" section if offers exist
2. EACH offer card SHALL display: title, description, discountText badge, CTA button
3. THE offer CTA button text SHALL be "Activate Deal →"
4. WHEN a user clicks an offer AND is authenticated, THE app SHALL:
   - Call `POST /api/v1/transactions` with `{ merchantId, orderAmount: 1000 }`
   - Open `offer.affiliateUrl` in a new tab
   - Show toast "Deal activated! Cashback tracking started"
5. WHEN a user clicks an offer AND is NOT authenticated, THE app SHALL open the Login modal

### Requirement 48: Merchant Page Navigation from Homepage

**User Story:** As a user, I want clicking a merchant card on the homepage to take me to the merchant detail page, so that I can see full details before shopping.

#### Acceptance Criteria

1. WHEN a logged-in user clicks "Shop Now" on a MerchantCard, THE app SHALL navigate to `/merchants/{id}` instead of directly opening the affiliate URL
2. WHEN a guest user clicks "Shop Now" on a MerchantCard, THE app SHALL open the Login modal
3. THE existing click tracking `GET /api/v1/merchants/{id}/click` SHALL still be called when navigating to merchant page
4. THE MerchantCard SHALL use react-router-dom `useNavigate` hook for navigation
