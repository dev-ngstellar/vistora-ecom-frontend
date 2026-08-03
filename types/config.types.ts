// ==================== SHIPPING ====================
export type ShippingProviderStatus = 'CONNECTED' | 'DISCONNECTED' | 'TESTING' | 'ERROR';
export type Environment = 'SANDBOX' | 'PRODUCTION';

export interface ShippingProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  environment: Environment;
  status: ShippingProviderStatus;
  priority: number;
  trackingUrl?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  carrier: string;
  baseRate: number;
  freeThreshold: number | null;
  estimatedDays: string;
  enabled: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states: string[];
  methods: string[];
  enabled: boolean;
}

// ==================== PAYMENTS ====================
export type GatewayStatus = 'CONNECTED' | 'DISCONNECTED' | 'TESTING' | 'ERROR';

export interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  description: string;
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  environment: Environment;
  status: GatewayStatus;
  webhookUrl: string;
  supportedCurrencies: string[];
}

export interface RefundSettings {
  autoRefundEnabled: boolean;
  refundWindow: number; // days
  partialRefundEnabled: boolean;
  restockOnRefund: boolean;
  refundNotificationEmail: string;
}

// ==================== NOTIFICATIONS ====================
export type NotificationChannelType = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
export type NotificationChannelStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR';

export interface NotificationChannel {
  id: string;
  type: NotificationChannelType;
  provider: string;
  enabled: boolean;
  status: NotificationChannelStatus;
  apiKey: string;
  apiSecret: string;
  fromAddress?: string;
  fromName?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
}

export interface NotificationTemplate {
  id: string;
  event: string;
  channel: NotificationChannelType;
  subject: string;
  body: string;
  variables: string[];
  enabled: boolean;
}

// ==================== INTEGRATIONS ====================
export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING';

export interface Integration {
  id: string;
  name: string;
  category: 'AUTH' | 'MEDIA' | 'EMAIL' | 'ANALYTICS' | 'MARKETING' | 'SHIPPING' | 'PAYMENTS';
  logo: string;
  description: string;
  status: IntegrationStatus;
  enabled: boolean;
  config: Record<string, string>;
  docsUrl?: string;
}

// ==================== STORE SETTINGS ====================
export interface StoreSettings {
  // Store Info
  storeName: string;
  storeDescription: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCity: string;
  storeState: string;
  storeCountry: string;
  storePostalCode: string;
  logoUrl: string;
  faviconUrl: string;

  // Currency & Locale
  currencyCode: string;
  currencySymbol: string;
  dateFormat: string;
  timezone: string;
  language: string;

  // Tax & GST
  gstNumber: string;
  taxRate: number;
  taxInclusive: boolean;
  taxLabel: string;

  // Invoice
  orderPrefix: string;
  invoicePrefix: string;
  invoiceFooterText: string;
  termsUrl: string;

  // Security
  sessionTimeoutMinutes: number;
  twoFactorEnabled: boolean;
  passwordMinLength: number;
  requireSpecialChars: boolean;

  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;
}
