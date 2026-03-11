import MerchantCard from './MerchantCard';

export default {
  title: 'Components/MerchantCard',
  component: MerchantCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    merchant: {
      control: 'object',
      description: 'Merchant data object',
    },
    onActivate: {
      action: 'activated',
      description: 'Callback when Shop & Earn is clicked',
    },
  },
};

// Default story
export const Default = {
  args: {
    merchant: {
      id: 1,
      name: 'Amazon',
      logoUrl: 'https://logo.clearbit.com/amazon.com',
      cashbackPercentage: 10,
      manualTrackingUrl: 'https://example.com/track/amazon',
    },
  },
};

// Low cashback rate
export const LowCashback = {
  args: {
    merchant: {
      id: 2,
      name: 'Flipkart',
      logoUrl: 'https://logo.clearbit.com/flipkart.com',
      cashbackPercentage: 5,
      manualTrackingUrl: 'https://example.com/track/flipkart',
    },
  },
};

// Medium cashback rate
export const MediumCashback = {
  args: {
    merchant: {
      id: 3,
      name: 'Myntra',
      logoUrl: 'https://logo.clearbit.com/myntra.com',
      cashbackPercentage: 12,
      manualTrackingUrl: 'https://example.com/track/myntra',
    },
  },
};

// High cashback rate
export const HighCashback = {
  args: {
    merchant: {
      id: 4,
      name: 'Ajio',
      logoUrl: 'https://logo.clearbit.com/ajio.com',
      cashbackPercentage: 20,
      manualTrackingUrl: 'https://example.com/track/ajio',
    },
  },
};

// Decimal cashback rate
export const DecimalCashback = {
  args: {
    merchant: {
      id: 5,
      name: 'Swiggy',
      logoUrl: 'https://logo.clearbit.com/swiggy.com',
      cashbackPercentage: 7.5,
      manualTrackingUrl: 'https://example.com/track/swiggy',
    },
  },
};

// Long merchant name
export const LongName = {
  args: {
    merchant: {
      id: 6,
      name: 'Big Basket Online Grocery Store',
      logoUrl: 'https://logo.clearbit.com/bigbasket.com',
      cashbackPercentage: 8,
      manualTrackingUrl: 'https://example.com/track/bigbasket',
    },
  },
};

// All variants in a grid
export const AllVariants = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-gray-50">
      <MerchantCard
        merchant={{
          id: 1,
          name: 'Amazon',
          logoUrl: 'https://logo.clearbit.com/amazon.com',
          cashbackPercentage: 10,
          manualTrackingUrl: 'https://example.com/track/amazon',
        }}
        onActivate={() => console.log('Amazon activated')}
      />
      <MerchantCard
        merchant={{
          id: 2,
          name: 'Flipkart',
          logoUrl: 'https://logo.clearbit.com/flipkart.com',
          cashbackPercentage: 5,
          manualTrackingUrl: 'https://example.com/track/flipkart',
        }}
        onActivate={() => console.log('Flipkart activated')}
      />
      <MerchantCard
        merchant={{
          id: 3,
          name: 'Myntra',
          logoUrl: 'https://logo.clearbit.com/myntra.com',
          cashbackPercentage: 12,
          manualTrackingUrl: 'https://example.com/track/myntra',
        }}
        onActivate={() => console.log('Myntra activated')}
      />
      <MerchantCard
        merchant={{
          id: 4,
          name: 'Ajio',
          logoUrl: 'https://logo.clearbit.com/ajio.com',
          cashbackPercentage: 20,
          manualTrackingUrl: 'https://example.com/track/ajio',
        }}
        onActivate={() => console.log('Ajio activated')}
      />
      <MerchantCard
        merchant={{
          id: 5,
          name: 'Swiggy',
          logoUrl: 'https://logo.clearbit.com/swiggy.com',
          cashbackPercentage: 7.5,
          manualTrackingUrl: 'https://example.com/track/swiggy',
        }}
        onActivate={() => console.log('Swiggy activated')}
      />
      <MerchantCard
        merchant={{
          id: 6,
          name: 'Zomato',
          logoUrl: 'https://logo.clearbit.com/zomato.com',
          cashbackPercentage: 15,
          manualTrackingUrl: 'https://example.com/track/zomato',
        }}
        onActivate={() => console.log('Zomato activated')}
      />
    </div>
  ),
};
