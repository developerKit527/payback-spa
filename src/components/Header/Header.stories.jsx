import Header from './Header';

export default {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    isAuthenticated: false,
    wallet: null,
  },
};

export const Authenticated = {
  args: {
    isAuthenticated: true,
    wallet: {
      available: 500,
      totalEarned: 1000,
      pending: 200,
    },
  },
};

export const NotAuthenticated = {
  args: {
    isAuthenticated: false,
    wallet: null,
  },
};

export const WithWalletData = {
  args: {
    isAuthenticated: true,
    wallet: {
      available: 1250.50,
      totalEarned: 5000,
      pending: 750.25,
    },
  },
};
