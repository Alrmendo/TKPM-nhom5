import React from 'react';
import { OrderSummary as OrderSummaryType, OrderItem } from '../types';
import { formatCurrency, formatDate, calculateDurationInDays } from '../utils/paymentUtils';

interface OrderSummaryProps {
  items: OrderItem[];
  startDate: Date;
  endDate: Date;
  summary: OrderSummaryType;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  startDate,
  endDate,
  summary
}) => {
  const rentalDuration = calculateDurationInDays(startDate, endDate);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-16 h-20 overflow-hidden rounded-md">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.size} · {item.color} · Qty: {item.quantity}
              </p>
              <p className="text-sm">
                {formatCurrency(item.pricePerDay)} per day
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(item.pricePerDay * rentalDuration * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Rental Period</span>
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Duration</span>
          <span>{rentalDuration} days</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatCurrency(summary.subtotal)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Tax</span>
          <span>{formatCurrency(summary.tax)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Shipping</span>
          <span>
            {summary.shipping === 0 
              ? 'Free' 
              : formatCurrency(summary.shipping)
            }
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-semibold text-[#c3937c]">
            {formatCurrency(summary.total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 