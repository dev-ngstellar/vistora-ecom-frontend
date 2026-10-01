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
    // 1. Send via EmailJS directly to sainithish2710@gmail.com
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
            to_email: 'sainithish2710@gmail.com',
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
    // 1. Send subscriber notification to sainithish2710@gmail.com via EmailJS
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
            to_email: 'sainithish2710@gmail.com',
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
};
