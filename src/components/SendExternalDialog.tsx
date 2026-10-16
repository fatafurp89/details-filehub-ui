import React, { useState } from 'react';
import { 
  Send, 
  Link2, 
  Mail, 
  MessageSquare, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  X,
  FileCheck2
} from 'lucide-react';
import type { OutboundPackage, DeliveryMethod } from '@/lib/document-center-types';

interface SendExternalDialogProps {
  pkg: OutboundPackage;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend: (method: DeliveryMethod, notes: string) => void;
}

export const SendExternalDialog: React.FC<SendExternalDialogProps> = ({
  pkg,
  isOpen,
  onClose,
  onConfirmSend
}) => {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod>('link');
  const [subject, setSubject] = useState(`إرسال حزمة وثائق معتمدة: ${pkg.destination} (${pkg.pkgReference})`);
  const [messageBody, setMessageBody] = useState(`السادة المحترمين،\nتجدون برفقه رابط الوصول المؤقت للاطلاع وتنزيل المستندات والتقارير المعتمدة الخاصة بـ (${pkg.contentSummary}) والمرتبطة بالمعاملة ${pkg.linkedTransactionRef}.\n\nشاكرين ومقدرين حسن تعاونكم.`);
  const [applyWatermark, setApplyWatermark] = useState(true);

  const methods = [
    {
      id: 'link' as DeliveryMethod,
      name: 'رابط آمن (تنزيل قصير الأجل)',
      desc: 'صلاحية محددة، حد تنزيلات، إمكانية الإلغاء الفوري المركزي، تتبع مؤكد.',
      officialStatus: 'تم التسليم وتتبع الفتح والتنزيل',
      statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'mail' as DeliveryMethod,
      name: 'البريد الرسمي للمنظومة',
      desc: 'إرسال عبر خادم البريد المعتمد للمكتب، تسليم رسمي موثق.',
      officialStatus: 'تسليم رسمي مؤكد من المنظومة',
      statusClass: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
      id: 'telegram' as DeliveryMethod,
      name: 'تيليجرام (حساب المكتب الرسمي)',
      desc: 'إرسال مباشر للجهة. القناة لا تملك تتبع استلام مؤكد داخل النظام.',
      officialStatus: 'تسليم خارجي يدوي (External Handoff)',
      statusClass: 'text-amber-800 bg-amber-50 border-amber-200'
    },
    {
      id: 'whatsapp' as DeliveryMethod,
      name: 'واتساب أعمال ديتيلز',
      desc: 'فتح التطبيق وإرسال الرابط. لا يملك تأكيد تسليم داخلي مؤكد.',
      officialStatus: 'تسليم خارجي يدوي (External Handoff)',
      statusClass: 'text-amber-800 bg-amber-50 border-amber-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div 
        dir="rtl"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right font-sans animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="size-5 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              تجهيز الإرسال الخارجي المعتمد — {pkg.pkgReference}
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
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Method Selection with Honest Status Disclosure */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">
              اختر وسيلة التسليم (مع الالتزام بقاعدة عدم ادعاء التسليم التلقائي):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {methods.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMethod === m.id
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">{m.name}</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                  <div className={`mt-2 text-[10px] px-2 py-0.5 rounded border inline-block font-semibold ${m.statusClass}`}>
                    تسجيل الحالة: {m.officialStatus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Editing */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-700 block mb-1">موضوع الرسالة:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md text-xs font-sans focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">نص الرسالة المرفقة:</label>
              <textarea
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md text-xs font-sans focus:outline-none focus:border-teal-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Privacy & Safeguard Controls */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Lock className="size-4 text-amber-700" />
                <span>ضوابط الخصوصية والعلامة المائية (DLP Policy)</span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyWatermark}
                  onChange={(e) => setApplyWatermark(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700 font-medium">تطبيق علامة مائية باسم الجهة</span>
              </label>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              * يتم حجب المسارات الداخلية للخادم تلقائياً. لا يتم تضمين كلمات مرور أو مفاتيح سرية في الرسالة أو الرابط.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md cursor-pointer"
          >
            إلغاء التجهيز
          </button>

          <button
            onClick={() => onConfirmSend(selectedMethod, subject)}
            className="flex items-center gap-1.5 px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-bold shadow-xs cursor-pointer"
          >
            <FileCheck2 className="size-4" />
            تأكيد الإرسال وتسجيل العملية بالسجل
          </button>
        </div>
      </div>
    </div>
  );
};
