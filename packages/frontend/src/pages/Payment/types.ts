export interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  country: string;
}

export interface OrderItem {
  name: string;
  size: string;
  color: string;
  duration: string;
  price: number;
  image: string;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping?: number;
  total: number;
  currency: string;
} 