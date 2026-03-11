import { Wallet, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import WalletCard from './WalletCard';

export default {
  title: 'Components/WalletCard',
  component: WalletCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Lucide React icon component',
    },
    label: {
      control: 'text',
      description: 'Label text for the stat',
    },
    value: {
      control: 'number',
      description: 'Numeric value to display (will be formatted as INR)',
    },
    color: {
      control: 'select',
      options: ['text-primary', 'text-success', 'text-warning', 'text-gray-900'],
      description: 'Tailwind text color class',
    },
    bgColor: {
      control: 'select',
      options: ['bg-indigo-50', 'bg-emerald-50', 'bg-amber-50', 'bg-gray-50'],
      description: 'Tailwind background color class for icon container',
    },
  },
};

// Default story
export const Default = {
  args: {
    icon: Wallet,
    label: 'Available Balance',
    value: 1500.50,
    color: 'text-primary',
    bgColor: 'bg-indigo-50',
  },
};

// Total Earned variant (Success/Emerald)
export const TotalEarned = {
  args: {
    icon: CheckCircle,
    label: 'Total Earned',
    value: 5327.80,
    color: 'text-success',
    bgColor: 'bg-emerald-50',
  },
};

// Pending variant (Warning/Amber)
export const Pending = {
  args: {
    icon: Clock,
    label: 'Pending',
    value: 892.30,
    color: 'text-warning',
    bgColor: 'bg-amber-50',
  },
};

// Available for Payout variant (Primary/Indigo)
export const AvailableForPayout = {
  args: {
    icon: Wallet,
    label: 'Available for Payout',
    value: 4435.50,
    color: 'text-primary',
    bgColor: 'bg-indigo-50',
  },
};

// Zero balance
export const ZeroBalance = {
  args: {
    icon: Wallet,
    label: 'Available Balance',
    value: 0,
    color: 'text-primary',
    bgColor: 'bg-indigo-50',
  },
};

// Large amount
export const LargeAmount = {
  args: {
    icon: TrendingUp,
    label: 'Total Earned',
    value: 123456.78,
    color: 'text-success',
    bgColor: 'bg-emerald-50',
  },
};

// Small decimal amount
export const SmallAmount = {
  args: {
    icon: DollarSign,
    label: 'Pending',
    value: 0.99,
    color: 'text-warning',
    bgColor: 'bg-amber-50',
  },
};

// All variants in a grid (for visual comparison)
export const AllVariants = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50">
      <WalletCard
        icon={CheckCircle}
        label="Total Earned"
        value={5327.80}
        color="text-success"
        bgColor="bg-emerald-50"
      />
      <WalletCard
        icon={Clock}
        label="Pending"
        value={892.30}
        color="text-warning"
        bgColor="bg-amber-50"
      />
      <WalletCard
        icon={Wallet}
        label="Available for Payout"
        value={4435.50}
        color="text-primary"
        bgColor="bg-indigo-50"
      />
    </div>
  ),
};
