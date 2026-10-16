import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  FileCheck, 
  ArrowRight, 
  HelpCircle,
  Eye,
  Lock,
  RefreshCw
} from 'lucide-react';
import type { ExtractedField } from '@/lib/document-center-types';

interface AiSortingViewProps {
  fields: ExtractedField[];
  onConfirmField: (fieldId: string) => void;
  onDepositToArchive: () => void;
}

export const AiSortingView: React.FC<AiSortingViewProps> = ({
  fields,
  onConfirmField,
  onDepositToArchive
}) => {
  const [activeFields, setActiveFields] = useState<ExtractedField[]>(fields);
  const [selectedTargetArchive, setSelectedTargetArchive] = useState('archive_deeds');

  const handleToggleDecision = (id: string) => {
    setActiveFields(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          decision: f.decision === 'accepted' ? 'needs_confirmation' : 'accepted'
        };
      }
      return f;
    }));
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-md border border-border p-4 gap-4 overflow-y-auto">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/80 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              فرز وتحليل الوثيقة بالذكاء الاصطناعي — اعتماد بشري إلزامي
              <span className="text-[11px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-mono">
                REF: INB-2026-0511
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              لا يُعتمد أي استخراج تلقائياً. القيم المستخرجة أدناه مرشحة للاعتماد أو التدقيق قبل الإيداع بالأرشيف.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
            <RefreshCw className="size-3.5" />
            إعادة الاستخراج
          </button>
          <button 
            onClick={onDepositToArchive}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <FileCheck className="size-3.5" />
            اعتماد الحقول والإيداع في الأرشيف
          </button>
        </div>
      </div>

      {/* Extracted Fields Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="p-3 bg-slate-100/80 border-b border-border flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>الحقول المستخرجة ودرجة الثقة والمصدر</span>
          <span className="text-[11px] text-slate-500 font-normal">
            * يتم تقنيع البيانات الحساسة أو إخفاؤها وفق سياسة DLP
          </span>
        </div>

        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 h-[38px]">
              <th className="px-4">الحقل المستخرج</th>
              <th className="px-4">القيمة المستخرجة</th>
              <th className="px-4">درجة الثقة</th>
              <th className="px-4">الصفحة</th>
              <th className="px-4">الربط المقترح</th>
              <th className="px-4">القرار</th>
              <th className="px-4 text-center">إجراء الاعتماد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {activeFields.map((field) => (
              <tr key={field.id} className="h-[40px] hover:bg-slate-50">
                <td className="px-4 font-semibold text-slate-900">{field.fieldName}</td>
                <td className="px-4 font-mono">
                  {field.isMasked ? (
                    <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      <Lock className="size-3" />
                      {field.extractedValue}
                    </span>
                  ) : (
                    <span className="text-slate-800">{field.extractedValue}</span>
                  )}
                </td>
                <td className="px-4 font-mono">
                  <span className={`inline-flex items-center gap-1 font-bold ${
                    field.confidence >= 0.9 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {(field.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-4 font-mono text-slate-500">صفحة {field.pageNumber}</td>
                <td className="px-4 text-slate-700">
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[11px]">
                    {field.suggestedLink}
                  </span>
                </td>
                <td className="px-4">
                  {field.decision === 'accepted' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="size-3" /> مقبول
                    </span>
                  )}
                  {field.decision === 'needs_confirmation' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="size-3" /> يحتاج تأكيد
                    </span>
                  )}
                  {field.decision === 'candidate' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                      <HelpCircle className="size-3" /> مرشح للتحديد
                    </span>
                  )}
                  {field.decision === 'masked' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                      محجوب (DLP)
                    </span>
                  )}
                </td>
                <td className="px-4 text-center">
                  <button
                    onClick={() => handleToggleDecision(field.id)}
                    className="text-[11px] font-medium text-teal-700 hover:text-teal-900 underline cursor-pointer"
                  >
                    {field.decision === 'accepted' ? 'إعادة مراجعة' : 'اعتماد يدوي'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Target Archive Selection */}
      <div className="border border-border rounded-lg p-4 bg-slate-50/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800">توجيه الإيداع في وحدة الأرشيف المناسبة:</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            يتم إنشاء السجل برقم تسلسلي موحد وربطه بالمعاملة الأصلية فور الاعتماد.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTargetArchive}
            onChange={(e) => setSelectedTargetArchive(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-300 bg-white text-slate-800 font-medium"
          >
            <option value="archive_deeds">أرشيف الصكوك والملكيات العقارية</option>
            <option value="archive_licenses">أرشيف الرخص والمخططات البلدية</option>
            <option value="archive_survey">أرشيف التقارير المساحية والجسات</option>
            <option value="archive_projects">أرشيف المشاريع الهندسية والإشراف</option>
          </select>
        </div>
      </div>
    </div>
  );
};
