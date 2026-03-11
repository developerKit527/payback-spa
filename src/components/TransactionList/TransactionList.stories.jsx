import TransactionList from './TransactionList';

export default {
  title: 'Components/TransactionList',
  component: TransactionList,
  parameters: {
    layout: 'padded',
  },
};

const mockTransactions = [
  {
    id: 1,
    merchantName: 'Amazon',
    orderAmount: 1500,
    cashbackAmount: 75,
    status: 'CONFIRMED',
    createdAt: '2024-03-10T10:30:00'
  },
  {
    id: 2,
    merchantName: 'Flipkart',
    orderAmount: 2000,
    cashbackAmount: 100,
    status: 'PENDING',
    createdAt: '2024-03-09T14:20:00'
  },
  {
    id: 3,
    merchantName: 'Myntra',
    orderAmount: 800,
    cashbackAmount: 40,
    status: 'REJECTED',
    createdAt: '2024-03-08T09:15:00'
  },
  {
    id: 4,
    merchantName: 'Swiggy',
    orderAmount: 450,
    cashbackAmount: 22.5,
    status: 'CONFIRMED',
    createdAt: '2024-03-07T19:45:00'
  },
  {
    id: 5,
    merchantName: 'Zomato',
    orderAmount: 350,
    cashbackAmount: 17.5,
    status: 'CONFIRMED',
    createdAt: '2024-03-06T20:15:00'
  }
];

export const Default = {
  args: {
    transactions: mockTransactions,
    loading: false
  }
};

export const Loading = {
  args: {
    transactions: [],
    loading: true
  }
};

export const Empty = {
  args: {
    transactions: [],
    loading: false
  }
};

export const SingleTransaction = {
  args: {
    transactions: [mockTransactions[0]],
    loading: false
  }
};

export const AllConfirmed = {
  args: {
    transactions: mockTransactions.map(t => ({ ...t, status: 'CONFIRMED' })),
    loading: false
  }
};

export const AllPending = {
  args: {
    transactions: mockTransactions.map(t => ({ ...t, status: 'PENDING' })),
    loading: false
  }
};

export const AllRejected = {
  args: {
    transactions: mockTransactions.map(t => ({ ...t, status: 'REJECTED' })),
    loading: false
  }
};

export const LargeAmounts = {
  args: {
    transactions: [
      {
        id: 1,
        merchantName: 'Premium Store',
        orderAmount: 99999.99,
        cashbackAmount: 5000,
        status: 'CONFIRMED',
        createdAt: '2024-03-10T10:00:00'
      },
      {
        id: 2,
        merchantName: 'Luxury Brand',
        orderAmount: 50000,
        cashbackAmount: 2500,
        status: 'PENDING',
        createdAt: '2024-03-09T15:00:00'
      }
    ],
    loading: false
  }
};
