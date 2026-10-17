import React, { useState } from 'react';
import { 
  DownloadCloud, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertTriangle, 
  Trash2, 
  RefreshCw,
  X
} from 'lucide-react';
import type { OperationRecord } from '@/lib/document-center-types';

interface ExternalLinkModalProps {
  operation: OperationRecord;
  isOpen: boolean;
  onClose: () => void;
  onRevokeLink?: (opId: string) => void;
  onExtendLink?: (opId: string) => void;
}

export const ExternalLinkModal: React.FC<ExternalLinkModalProps> = ({
  operation,
  isOpen,
  onClose,
  onRevokeLink,
  onExtendLink
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const secureUrl = `https://files.details-wms.cloud/s/${operation.linkToken || 'opaque_token_demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(secureUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div 
        dir="rtl"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-right font-sans animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="size-5 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              ضوابط الرابط الخارجي الآمن — {operation.reference}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 block mb-1">الرابط المباشر للجهة الخارجية (Opaque Link):</label>
            <div className="flex items-center gap-2">
              <input
                dir="ltr"
                readOnly
                value={secureUrl}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs text-slate-800 select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md font-medium cursor-pointer shrink-0"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              * الرابط لا يكشف مسار الخادم أو بنية التخزين الداخلية بأي شكل.
            </p>
          </div>

          {/* Controls list */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">الجهة المرخص لها بالتنزيل:</span>
              <strong className="text-slate-900">{operation.sourceOrDestination}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">حالة الرابط الآن:</span>
              <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-[10px]">
                نشط وصالح للاستخدام
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">حد التنزيلات المسموح:</span>
              <span className="font-mono font-bold">5 تنزيلات (متبقي 3)</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">صلاحية الرابط تنتهي في:</span>
              <span className="font-mono text-slate-800">2026-10-22 (بعد 7 أيام)</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">العلامة المائية القانونية:</span>
              <span className="text-teal-800 font-semibold">مفعلة وتتضمن رقم المعاملة</span>
            </div>
            <div className="flex justify-between items-center text-slate-700 border-t border-slate-200/60 pt-2">
              <span className="text-slate-500">مصدر التخزين على سحابة هيتنزر:</span>
              <span className="font-mono text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200" dir="ltr">
                /details-storage/document-center/outbound/
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onRevokeLink && onRevokeLink(operation.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-xs font-semibold cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                إلغاء فوري للرابط
              </button>

              <button
                type="button"
                onClick={() => {
                  if ((window as any).__openLandingPreview) {
                    (window as any).__openLandingPreview(operation.direction === 'request' ? 'upload_request' : 'file_download', {
                      reference: operation.reference,
                      targetEntity: operation.sourceOrDestination,
                      transactionRef: operation.linkedEntity.referenceNumber,
                      title: operation.documentTitle,
                      description: 'بوابة إرسال واستقبال الوثائق المعتمدة الخاصة بشركة ديتيلز للاستشارات الهندسية.',
                      expiresAt: '2026-10-22',
                      maxDownloads: 5,
                      remainingDownloads: 3
                    });
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-md text-xs font-bold cursor-pointer"
              >
                <span>معاينة صفحة العميل</span>
              </button>
            </div>

            <button
              onClick={() => onExtendLink && onExtendLink(operation.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              تمديد المهلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
