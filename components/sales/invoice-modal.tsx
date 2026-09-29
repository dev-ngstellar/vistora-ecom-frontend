import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import { Download, Printer, FileText } from 'lucide-react';
import { Order } from '@/types/sales.types';
import { brandConfig } from '@/config';
import dayjs from 'dayjs';


interface InvoiceModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, open, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${order.orderNumber}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 20px; color: #111; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #E5E7EB; padding-bottom: 12px; margin-bottom: 20px; }
              .title { font-size: 20px; font-weight: bold; color: #A50025; }
              .meta { font-size: 12px; color: #64748B; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background: #F8FAFC; text-align: left; padding: 8px; font-size: 11px; border-bottom: 1px solid #E2E8F0; text-transform: uppercase; }
              td { padding: 8px; font-size: 12px; border-bottom: 1px solid #F1F5F9; }
              .totals { margin-top: 20px; float: right; width: 250px; }
              .totals-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
              .grand-total { font-size: 14px; font-weight: bold; border-top: 1px solid #E2E8F0; padding-top: 6px; }
              .footer { margin-top: 40px; font-size: 10px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 10px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
          className="bg-[#A50025] hover:bg-[#83001D] border-none"
        >
          Print Invoice
        </Button>,
      ]}
    >
      <div ref={printRef} className="p-4 sm:p-6 space-y-6 text-slate-800 bg-white">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#A50025] tracking-tight uppercase">{brandConfig.merchantLegalName}</h2>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">{brandConfig.officialAddress}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Support: {brandConfig.contactPhone} | {brandConfig.supportEmail}
            </p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
              Tax Invoice
            </span>
            <p className="text-sm font-black text-slate-900 mt-1">#{order.orderNumber}</p>
            <p className="text-xs text-slate-500 font-medium">Date: {dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
          </div>
        </div>


        {/* Bill To & Ship To */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/70">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Customer Details
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {order.user ? order.user.fullName || `${order.user.firstName} ${order.user.lastName}` : 'Guest Customer'}
            </p>
            <p className="text-slate-600 mt-0.5">{order.user?.email || 'N/A'}</p>
            <p className="text-slate-600">{order.user?.phone || order.address?.phone || 'N/A'}</p>
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Shipping Address
            </span>
            {order.address ? (
              <div className="text-slate-700 space-y-0.5">
                <p className="font-semibold text-slate-900">{order.address.fullName || 'Valued Customer'}</p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p>
                  {order.address.city}, {order.address.state} - {order.address.postalCode}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 italic">No delivery address provided</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-2.5 font-bold uppercase text-[11px]">Item Description</th>
                <th className="p-2.5 font-bold uppercase text-[11px] text-center">SKU</th>
                <th className="p-2.5 font-bold uppercase text-[11px] text-right">Price</th>
                <th className="p-2.5 font-bold uppercase text-[11px] text-center">Qty</th>
                <th className="p-2.5 font-bold uppercase text-[11px] text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(order.items || []).map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="p-2.5 font-semibold text-slate-900">
                      <div>{item.productName}</div>
                      {item.variant && (
                        <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                          Size: {item.variant.size || 'N/A'} | Color: {item.variant.color || 'N/A'}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-slate-600 text-center">{item.sku}</td>
                    <td className="p-2.5 text-right font-medium">₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{Number(item.total).toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount:</span>
                <span>- ₹{Number(order.discount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tax / GST:</span>
              <span className="font-semibold text-slate-900">₹{Number(order.tax).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-slate-900">
                {Number(order.shipping) === 0 ? 'FREE' : `₹${Number(order.shipping).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Amount:</span>
              <span className="text-[#A50025]">₹{Number(order.total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-4 space-y-0.5">
          <p>Thank you for choosing {brandConfig.merchantLegalName}. This is a computer-generated tax invoice.</p>
          <p>Direct fulfillment from our facility at {brandConfig.officialAddress}.</p>
          <p className="text-[9px] text-slate-400">Subject to the exclusive jurisdiction of the {brandConfig.governingJurisdiction}.</p>
        </div>
      </div>
    </Modal>
  );
};

