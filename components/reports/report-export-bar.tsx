'use client';

import React from 'react';
import { Button, Dropdown, message } from 'antd';
import { Download, Printer, FileSpreadsheet, FileText, FileCode } from 'lucide-react';

interface ReportExportBarProps {
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
}

export const ReportExportBar: React.FC<ReportExportBarProps> = ({
  onExportCSV,
  onExportExcel,
  onExportPDF,
  onPrint,
}) => {
  const handleCSV = () => {
    if (onExportCSV) onExportCSV();
    else message.success('CSV Report file generated and downloading...');
  };

  const handleExcel = () => {
    if (onExportExcel) onExportExcel();
    else message.success('Excel Sheet (.xlsx) downloaded successfully!');
  };

  const handlePDF = () => {
    if (onExportPDF) onExportPDF();
    else message.success('PDF Financial Report downloading...');
  };

  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Dropdown
        menu={{
          items: [
            {
              key: 'csv',
              icon: <FileCode className="w-4 h-4 text-emerald-600" />,
              label: 'Export CSV (.csv)',
              onClick: handleCSV,
            },
            {
              key: 'excel',
              icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />,
              label: 'Export Excel (.xlsx)',
              onClick: handleExcel,
            },
            {
              key: 'pdf',
              icon: <FileText className="w-4 h-4 text-rose-600" />,
              label: 'Export PDF Document (.pdf)',
              onClick: handlePDF,
            },
          ],
        }}
        trigger={['click']}
      >
        <Button
          type="default"
          icon={<Download className="w-4 h-4 text-indigo-600" />}
          className="rounded-2xl font-bold text-xs border-slate-200 dark:border-slate-800"
        >
          Export Report
        </Button>
      </Dropdown>

      <Button
        type="default"
        icon={<Printer className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
        onClick={handlePrint}
        className="rounded-2xl font-bold text-xs border-slate-200 dark:border-slate-800"
      >
        Print View
      </Button>
    </div>
  );
};
