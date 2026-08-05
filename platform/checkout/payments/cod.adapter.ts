export const processCodPayment = async (): Promise<{ success: boolean; message: string }> => {
  // Cash on Delivery requires no online gateway verification
  return {
    success: true,
    message: 'Order confirmed with Cash on Delivery.',
  };
};
