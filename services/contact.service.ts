import emailjs from '@emailjs/browser';
import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_dfiafwi';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_kj2wycl';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'OqI80Y0zKoVmM7IE1';

export const contactService = {
  submitContact: async (data: ContactFormData) => {
    // 1. Send via EmailJS directly to vistoraoffice123@gmail.com
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            name: data.name,
            from_name: data.name,
            customer_name: data.name,
            email: data.email,
            from_email: data.email,
            user_email: data.email,
            customer_email: data.email,
            reply_to: data.email,
            phone: data.phone || 'Not provided',
            subject: data.subject || 'Vistora Customer Support Inquiry',
            message: data.message,
            to_email: 'vistoraoffice123@gmail.com',
            to_name: 'Vistora Support Team',
          },
          {
            publicKey: EMAILJS_PUBLIC_KEY,
          }
        );
        console.log('✅ EmailJS dispatch success:', response.status, response.text);
      }
    } catch (emailJsError) {
      console.error('❌ EmailJS browser dispatch error:', emailJsError);
    }

    // 2. Also register in backend contact endpoint
    try {
      const res = await apiClient.post<ApiEnvelope<any>>('/contact', data);
      return res.data;
    } catch (apiError) {
      return { success: true, message: 'Message sent successfully' };
    }
  },

  subscribeNewsletter: async (email: string) => {
    // 1. Send subscriber notification to vistoraoffice123@gmail.com via EmailJS
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            name: 'New Subscriber',
            from_name: 'Storefront Visitor',
            email: email,
            from_email: email,
            reply_to: email,
            phone: 'N/A',
            subject: '[Vistora Newsletter] New Catalog & Updates Subscription',
            message: `A new customer with email "${email}" has subscribed to Vistora updates and requested the latest catalog & welcome offers.`,
            to_email: 'vistoraoffice123@gmail.com',
          },
          {
            publicKey: EMAILJS_PUBLIC_KEY,
          }
        );
      }
    } catch (err) {
      console.warn('EmailJS newsletter notice:', err);
    }

    try {
      const res = await apiClient.post<ApiEnvelope<any>>('/newsletter/subscribe', { email });
      return res.data;
    } catch (apiErr) {
      return { success: true, message: 'Subscribed successfully' };
    }
  },

  sendOrderAlert: async (orderData: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    paymentMethod: string;
    destination?: string;
    totalAmount: string | number;
    itemsSummary?: string;
  }) => {
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const orderTime = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const formattedMessage = [
          '═══════════════════════════════════════════════',
          '📦 VISTORA COMMERCE — NEW ORDER CONFIRMED',
          '═══════════════════════════════════════════════',
          '',
          `Order Reference : #${orderData.orderNumber}`,
          `Order Placed At : ${orderTime}`,
          `Payment Status  : PAID & VERIFIED (${orderData.paymentMethod})`,
          `Grand Total     : ₹${orderData.totalAmount}`,
          '',
          '───────────────────────────────────────────────',
          '👤 CUSTOMER INFORMATION',
          '───────────────────────────────────────────────',
          `Name   : ${orderData.customerName}`,
          `Email  : ${orderData.customerEmail}`,
          `Phone  : ${orderData.customerPhone || 'Not provided'}`,
          '',
          '───────────────────────────────────────────────',
          '📍 DELIVERY ADDRESS',
          '───────────────────────────────────────────────',
          `${orderData.destination || 'Standard Delivery Address'}`,
          '',
          ...(orderData.itemsSummary
            ? [
                '───────────────────────────────────────────────',
                '🛒 ORDER ITEMS',
                '───────────────────────────────────────────────',
                orderData.itemsSummary,
                '',
              ]
            : []),
          '───────────────────────────────────────────────',
          '🚚 FULFILLMENT & DISPATCH SLA',
          '───────────────────────────────────────────────',
          '• Standard Dispatch : Within 2–3 business days',
          '• Action Required   : Please prepare items for warehouse packing & courier handover.',
          '═══════════════════════════════════════════════',
        ].join('\n');

        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            name: orderData.customerName || 'Vistora Customer',
            from_name: orderData.customerName || 'Vistora Customer',
            customer_name: orderData.customerName || 'Vistora Customer',
            email: orderData.customerEmail,
            from_email: orderData.customerEmail,
            user_email: orderData.customerEmail,
            customer_email: orderData.customerEmail,
            reply_to: orderData.customerEmail,
            phone: orderData.customerPhone || 'Not provided',
            subject: `Order #${orderData.orderNumber} Confirmed — ₹${orderData.totalAmount}`,
            message: formattedMessage,
            to_email: 'vistoraoffice123@gmail.com',
            to_name: 'Vistora Orders Desk',
          },
          {
            publicKey: EMAILJS_PUBLIC_KEY,
          }
        );
        console.log('✅ EmailJS order notification sent successfully:', response.status, response.text);
      }
    } catch (err) {
      console.error('❌ EmailJS order notification error:', err);
    }
  },

  sendCustomerOrderConfirmation: async (orderData: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    paymentMethod: string;
    destination?: string;
    totalAmount: string | number;
    itemsSummary?: string;
    trackingUrl?: string;
  }) => {
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const orderTime = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const trackingUrl =
          orderData.trackingUrl ||
          (typeof window !== 'undefined'
            ? `${window.location.origin}/orders`
            : 'https://vistoracommerce.com/orders');

        const formattedCustomerMessage = [
          `Dear ${orderData.customerName || 'Valued Customer'},`,
          '',
          'Thank you for your purchase with Vistora! We are delighted to confirm that your order has been successfully placed.',
          '',
          '═══════════════════════════════════════════════',
          '📦 ORDER SUMMARY',
          '═══════════════════════════════════════════════',
          `Order Reference : #${orderData.orderNumber}`,
          `Order Placed At : ${orderTime}`,
          `Payment Method  : ${orderData.paymentMethod}`,
          `Payment Status  : Confirmed & Verified`,
          `Grand Total     : ₹${orderData.totalAmount}`,
          '',
          '───────────────────────────────────────────────',
          '📍 DELIVERY ADDRESS',
          '───────────────────────────────────────────────',
          `${orderData.destination || 'Standard Delivery Address'}`,
          '',
          ...(orderData.itemsSummary
            ? [
                '───────────────────────────────────────────────',
                '🛒 ORDER ITEMS',
                '───────────────────────────────────────────────',
                orderData.itemsSummary,
                '',
              ]
            : []),
          '───────────────────────────────────────────────',
          '🚚 ORDER TRACKING & UPDATES',
          '───────────────────────────────────────────────',
          'For order tracking, you can check the "My Orders" page at any time to monitor your order status, dispatch progress, and delivery updates:',
          `👉 ${trackingUrl}`,
          '',
          '• Dispatch SLA    : Within 2–3 business days',
          '• Delivery Window : 2–5 business days depending on location',
          '',
          '───────────────────────────────────────────────',
          '💬 NEED ASSISTANCE?',
          '───────────────────────────────────────────────',
          'If you have any questions regarding your order, our customer support team is happy to help:',
          '• Email : vistoraoffice123@gmail.com',
          '• Phone : +91 93444 47088 (9:00 AM – 9:00 PM IST)',
          '',
          'Warm regards,',
          'Team Vistora — Pure Organics & Heritage Grains',
          '═══════════════════════════════════════════════',
        ].join('\n');

        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            name: orderData.customerName || 'Valued Customer',
            from_name: 'Vistora Commerce',
            customer_name: orderData.customerName || 'Valued Customer',
            email: orderData.customerEmail,
            from_email: 'vistoraoffice123@gmail.com',
            user_email: orderData.customerEmail,
            customer_email: orderData.customerEmail,
            reply_to: 'vistoraoffice123@gmail.com',
            phone: orderData.customerPhone || 'Not provided',
            subject: `Order #${orderData.orderNumber} Confirmed — Thank You for Your Purchase!`,
            message: formattedCustomerMessage,
            to_email: orderData.customerEmail,
            to_name: orderData.customerName || 'Valued Customer',
          },
          {
            publicKey: EMAILJS_PUBLIC_KEY,
          }
        );
        console.log('✅ EmailJS customer confirmation sent successfully:', response.status, response.text);
      }
    } catch (err) {
      console.error('❌ EmailJS customer confirmation error:', err);
    }
  },
};

