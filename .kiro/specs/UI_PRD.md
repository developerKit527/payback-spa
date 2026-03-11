UI PRD: Payback SPA (Single Page Application)

1. Project Overview

A modern, high-performance fintech dashboard that allows users to browse merchants, activate cashback, and track their wallet earnings in real-time.

Tech Stack: React (Vite), Tailwind CSS, Lucide React (Icons), Axios.

2. Design System

Color Palette

Category	Hex Code	Purpose
Primary	#4F46E5 (Indigo-600)	Brand color, primary buttons, links
Success	#10B981 (Emerald-500)	Earned cashback, confirmed status
Warning	#F59E0B (Amber-500)	Pending transactions
Surface	#F9FAFB (Gray-50)	App background
Text	#111827 (Gray-900)	Main headings and body text
Typography

Font: Inter or Sans-Serif stack.

Scale: Large, bold numbers for currency; clean, medium-weight labels for data.

3. Component Architecture

3.1 Global Header (Navigation)

Left: App Logo ("Payback") + Search bar for merchants.

Right: Compact Wallet Glance showing Available Balance and a User Profile icon.

3.2 Hero Section (Wallet Dashboard)

A prominent card at the top of the home page showing three stats:

Total Earned: Big, bold emerald text.

Pending Amount: Amber text (to drive anticipation).

Available for Payout: With a "Withdraw" button (currently disabled/mocked).

3.3 Merchant Grid

A responsive grid of cards fetching data from /api/v1/merchants.

Card Design:

Merchant Logo (centered).

Cashback Rate (e.g., "10% Cashback") in a high-contrast badge.

"Activate Cashback" Button (Primary Indigo).

Interaction: Clicking the button triggers the /click API, then opens the merchant's tracking URL in a new tab.

3.4 Transaction History

A clean table or list below the grid showing:

Merchant Name, Date, Order Amount, and Cashback Amount.

Status Badges: Rounded pills (e.g., [ PENDING ] in amber, [ CONFIRMED ] in green).

4. User Flows

On Load: Fetch /merchants and /wallet/1 simultaneously using Promise.all.

Activating Cashback:

User clicks a merchant.

App calls POST /api/v1/merchants/{id}/click.

App opens manualTrackingUrl in a new window.

App increments local clickCount or refreshes data.

5. Technical Requirements (For Kiro)

CORS: Backend must allow http://localhost:5173.

Responsive Design: Mobile-first approach using Tailwind (1 column on mobile, 3+ on desktop).

Loading States: Skeleton loaders for the Merchant Grid while the API is fetching.

Error Handling: Toast notifications if the API is down.