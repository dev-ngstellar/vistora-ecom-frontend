declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export const loadRazorpaySdk = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayModal = async (options: RazorpayOptions): Promise<void> => {
  const loaded = await loadRazorpaySdk();
  if (!loaded || !window.Razorpay) {
    throw new Error('Razorpay SDK failed to load. Please check network connection.');
  }

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};
