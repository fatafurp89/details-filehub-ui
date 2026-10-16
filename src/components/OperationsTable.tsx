import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Inbox, 
  ShieldCheck, 
  ArrowRightLeft,
  Search,
  Filter,
  Eye,
  Download,
  Copy,
  ChevronLeft
} from 'lucide-react';
import type { OperationRecord, DeliveryMethod, ProcessStatus } from '@/lib/document-center-types';

interface OperationsTableProps {
  operations: OperationRecord[];
  onViewOperation: (op: OperationRecord) => void;
  onOpenLinkModal?: (op: OperationRecord) => void;
}

export const OperationsTable: React.FC<OperationsTableProps> = ({
  operations,
  onViewOperation,
  onOpenLinkModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = operations.filter((op) => {
    const matchesSearch = 
      op.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.sourceOrDestination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.linkedEntity.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDirection = directionFilter === 'all' || op.direction === directionFilter;
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;

    return matchesSearch && matchesDirection && matchesStatus;
  });

  const getMethodBadge = (method: DeliveryMethod) => {
    switch (method) {
      case 'link':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">رابط آمن</span>;
      case 'mail':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">البريد الرسمي</span>;
      case 'telegram':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">تيليجرام (Handoff)</span>;
      case 'whatsapp':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">واتساب (Handoff)</span>;
      case 'upload':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded">رفع خارجي</span>;
      case 'internal':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">رفع داخلي</span>;
    }
  };

  const getStatusBadge = (status: ProcessStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full"><CheckCircle2 className="size-3" /> تم التسليم المؤكد</span>;
      case 'handoff_manual':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full"><AlertCircle className="size-3" /> تسليم خارجي يدوي</span>;
      case 'awaiting_reply':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full"><Clock className="size-3" /> بانتظار رد</span>;
      case 'for_analysis':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">للتحليل بالذكاء</span>;
      case 'deposited':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full"><ShieldCheck className="size-3" /> مُودَع بالأرشيف</span>;
      case 'linked':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">تم الربط</span>;
      case 'draft':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full">مسودة</span>;
      case 'canceled':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">مُلغى</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-md border border-border overflow-hidden">
      {/* Filtering Toolbar */}
      <div className="p-3 border-b border-border bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative w-full max-w-sm">
            <Search className="size-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالمرجع، الجهة، المعاملة، أو نوع الوثيقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pr-9 pl-3 py-1.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-teal-600 font-sans"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-300 bg-white text-slate-700 font-medium"
          >
            <option value="all">جميع الاتجاهات</option>
            <option value="inbound">الوارد</option>
            <option value="outbound">الصادر</option>
            <option value="request">طلبات الوثائق</option>
            <option value="handoff">التسليم الرسمي</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-300 bg-white text-slate-700 font-medium"
          >
            <option value="all">جميع الحالات</option>
            <option value="delivered">تم التسليم</option>
            <option value="handoff_manual">تسليم خارجي يدوي</option>
            <option value="awaiting_reply">بانتظار رد</option>
            <option value="for_analysis">للفرز والتحليل</option>
            <option value="deposited">مُودَع بالأرشيف</option>
          </select>
        </div>
      </div>

      {/* Intensive Dense Table - 40px row height, 38px header */}
      <div className="overflow-x-auto flex-1 scrollbar-thin">
        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/90 border-b border-border text-slate-600 font-semibold h-[38px] select-none">
              <th className="px-3.5 whitespace-nowrap">المرجع</th>
              <th className="px-3 whitespace-nowrap">الاتجاه</th>
              <th className="px-3.5 whitespace-nowrap">الجهة / المصدر</th>
              <th className="px-3.5 whitespace-nowrap min-w-[200px]">الوثيقة / الموضوع</th>
              <th className="px-3 whitespace-nowrap">مرتبط بـ</th>
              <th className="px-3 whitespace-nowrap">وسيلة التسليم</th>
              <th className="px-3 whitespace-nowrap">الحالة الرسمية</th>
              <th className="px-3 whitespace-nowrap">الوقت والمنفذ</th>
              <th className="px-3 text-center sticky left-0 bg-slate-100/95 shadow-xs whitespace-nowrap">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((op) => (
              <tr 
                key={op.id} 
                className="hover:bg-teal-50/40 transition-colors h-[40px] group text-slate-800"
              >
                <td className="px-3.5 font-mono font-medium text-slate-900 whitespace-nowrap">
                  {op.reference}
                </td>
                <td className="px-3 whitespace-nowrap">
                  {op.direction === 'inbound' && <span className="inline-flex items-center gap-1 text-[11px] text-sky-800 font-medium"><Inbox className="size-3" /> وارد</span>}
                  {op.direction === 'outbound' && <span className="inline-flex items-center gap-1 text-[11px] text-teal-800 font-medium"><Send className="size-3" /> صادر</span>}
                  {op.direction === 'request' && <span className="inline-flex items-center gap-1 text-[11px] text-indigo-800 font-medium"><Clock className="size-3" /> طلب</span>}
                  {op.direction === 'handoff' && <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-medium"><ShieldCheck className="size-3" /> تسليم</span>}
                </td>
                <td className="px-3.5 font-medium whitespace-nowrap max-w-[180px] truncate" title={op.sourceOrDestination}>
                  {op.sourceOrDestination}
                </td>
                <td className="px-3.5 whitespace-nowrap max-w-[260px] truncate text-slate-700" title={op.documentTitle}>
                  {op.documentTitle}
                </td>
                <td className="px-3 whitespace-nowrap">
                  <span className="font-mono bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                    {op.linkedEntity.referenceNumber}
                  </span>
                </td>
                <td className="px-3 whitespace-nowrap">
                  {getMethodBadge(op.method)}
                </td>
                <td className="px-3 whitespace-nowrap">
                  {getStatusBadge(op.status)}
                </td>
                <td className="px-3 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                  {op.timestamp.split(' ')[1]} · {op.ownerName}
                </td>
                <td className="px-3 text-center sticky left-0 bg-white/95 group-hover:bg-teal-50/70 shadow-xs whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onViewOperation(op)}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                      title="عرض التفاصيل والاعتماد"
                    >
                      <Eye className="size-3.5" />
                    </button>
                    {op.linkToken && onOpenLinkModal && (
                      <button
                        onClick={() => onOpenLinkModal(op)}
                        className="p-1 rounded hover:bg-teal-100 text-teal-700 cursor-pointer"
                        title="فتح الرابط الخارجي الآمن"
                      >
                        <ExternalLink className="size-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Sticky Footer with Totals */}
      <div className="p-2.5 bg-slate-100 border-t border-border flex items-center justify-between text-xs text-slate-600 font-medium select-none">
        <div className="flex items-center gap-4">
          <span>إجمالي العمليات المعروضة: <strong className="font-mono text-slate-900">{filtered.length}</strong></span>
          <span className="text-slate-300">|</span>
          <span>تسليم خارجي يدوي: <strong className="font-mono text-amber-800">{filtered.filter(x => x.status === 'handoff_manual').length}</strong></span>
          <span className="text-slate-300">|</span>
          <span>بانتظار التحليل والاعتماد: <strong className="font-mono text-rose-800">{filtered.filter(x => x.status === 'for_analysis').length}</strong></span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Asia/Riyadh · تحديث فوري مباشر
        </div>
      </div>
    </div>
  );
};
