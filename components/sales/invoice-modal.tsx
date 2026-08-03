import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import { Download, Printer, FileText } from 'lucide-react';
import { Order } from '@/types/sales.types';
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
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.invoice?.invoiceNumber || order.orderNumber}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; color: #0f172a; }
            .badge { display: inline-block; padding: 4px 12px; background: #e0e7ff; color: #3730a3; font-weight: 700; border-radius: 6px; font-size: 12px; }
            .section { margin-top: 24px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .totals { margin-left: auto; width: 300px; margin-top: 20px; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
            .totals-row.grand { font-size: 18px; font-weight: 900; border-top: 2px solid #0f172a; padding-top: 10px; margin-top: 6px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="print" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
          Print Invoice
        </Button>,
        <Button
          key="close"
          type="primary"
          onClick={onClose}
          className="bg-slate-900 font-bold"
        >
          Close
        </Button>,
      ]}
      width={780}
      title={
        <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>TAX INVOICE #{order.invoice?.invoiceNumber || order.orderNumber}</span>
        </div>
      }
    >
      <div ref={printRef} className="py-4 space-y-6 text-slate-800 text-sm">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">VISTORA COMMERCE</h2>
            <p className="text-xs text-slate-500 font-medium">Haute Couture & Luxury Fashion Platform</p>
            <p className="text-xs text-slate-500">GSTIN: 27AAAAA0000A1Z5 • PAN: AAAAA0000A</p>
          </div>

          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-lg uppercase">
              PAID INVOICE
            </div>
            <p className="text-xs font-bold text-slate-900 mt-2">
              Invoice Date: {dayjs(order.invoice?.generatedAt || order.createdAt).format('MMMM D, YYYY')}
            </p>
            <p className="text-xs text-slate-500">Order Reference: #{order.orderNumber}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="font-extrabold text-slate-900 uppercase block mb-1 text-[11px] tracking-wider">
              Billed & Shipped To:
            </span>
            <p className="font-bold text-slate-900">{order.address?.fullName || order.user?.fullName}</p>
            <p>{order.address?.addressLine1}</p>
            {order.address?.addressLine2 && <p>{order.address.addressLine2}</p>}
            <p>
              {order.address?.city}, {order.address?.state} - {order.address?.postalCode}
            </p>
            <p className="font-medium text-slate-600 mt-1">Phone: {order.address?.phone || order.user?.phone}</p>
            <p className="text-slate-600">Email: {order.user?.email}</p>
          </div>

          <div>
            <span className="font-extrabold text-slate-900 uppercase block mb-1 text-[11px] tracking-wider">
              Supplier / Dispatch Warehouse:
            </span>
            <p className="font-bold text-slate-900">Vistora Logistics Hub Mumbai</p>
            <p>Plot 48, Industrial Couture Zone</p>
            <p>Andheri East, Mumbai - 400093</p>
            <p className="font-medium text-slate-600 mt-1">Contact: billing@vistoracommerce.com</p>
          </div>
        </div>

        {/* Products Table */}
        <div>
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
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="p-2.5 font-semibold text-slate-900">
                    {item.productName}
                    {item.variant && (
                      <span className="block text-[11px] text-slate-500 font-normal">
                        Size: {item.variant.size || 'N/A'} | Color: {item.variant.color || 'N/A'}
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 font-mono text-slate-600 text-center">{item.sku}</td>
                  <td className="p-2.5 text-right font-medium">₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900">₹{Number(item.total).toLocaleString('en-IN')}</td>
                </tr>
              ))}
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
              <span>Estimated Tax (GST 18%):</span>
              <span className="font-semibold text-slate-900">₹{Number(order.tax).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Charge:</span>
              <span className="font-semibold text-slate-900">
                {Number(order.shipping) === 0 ? 'FREE' : `₹${Number(order.shipping).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2 mt-2">
              <span>Total Paid:</span>
              <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 text-center text-[11px] text-slate-400">
          This is a computer-generated tax invoice and requires no physical signature. Thank you for shopping with Vistora Commerce!
        </div>
      </div>
    </Modal>
  );
};
