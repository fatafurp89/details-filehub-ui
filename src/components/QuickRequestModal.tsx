import React, { useState } from 'react';
import { 
  FileUp, 
  Link2, 
  Clock, 
  ShieldCheck, 
  X, 
  Eye, 
  FileText, 
  Plus, 
  Trash2, 
  HelpCircle,
  Sparkles,
  Building2,
  HardDrive
} from 'lucide-react';
import type { EmployeeSession } from '@/lib/attachments-api';

interface QuickRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: EmployeeSession | null;
  onRequestCreated: (item: {
    reference: string;
    targetEntity: string;
    url: string;
    title: string;
    instructions: string;
    expiresDays: number;
    maxFiles: number;
    maxSizePerFileMb: number;
    allowedExt: string[];
    requiredItems: { name: string; isRequired: boolean; ext: string; tip?: string }[];
  }) => void;
  onPreviewRequested: (previewData: any) => void;
}

export const QuickRequestModal: React.FC<QuickRequestModalProps> = ({
  isOpen,
  onClose,
  session,
  onRequestCreated,
  onPreviewRequested
}) => {
  if (!isOpen) return null;

  const [targetEntity, setTargetEntity] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [expiresDays, setExpiresDays] = useState(7);
  const [maxFiles, setMaxFiles] = useState(10);
  const [maxSizePerFileMb, setMaxSizePerFileMb] = useState(50);
  const [allowedExtInput, setAllowedExtInput] = useState('pdf, dwg, xlsx, jpg, png');

  // Specific required items builder
  const [requiredItems, setRequiredItems] = useState<Array<{ id: string; name: string; isRequired: boolean; ext: string; tip?: string }>>([
    { id: '1', name: 'صورة الصك الإلكتروني المحدث للموقع', isRequired: true, ext: 'PDF, JPG', tip: 'صادر من البورصة العقارية' },
    { id: '2', name: 'كروكي الرفع المساحي المعتمد من المكتب الهندسي', isRequired: true, ext: 'PDF, DWG', tip: 'معتمد من منصة بلدي' },
    { id: '3', name: 'شهادة تنسيق عداد الكهرباء / المياه', isRequired: false, ext: 'PDF', tip: 'اختياري في حال توفرها' }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemRequired, setNewItemRequired] = useState(true);
  const [newItemExt, setNewItemExt] = useState('PDF');
  const [newItemTip, setNewItemTip] = useState('');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    setRequiredItems(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: newItemName.trim(),
        isRequired: newItemRequired,
        ext: newItemExt,
        tip: newItemTip.trim() || undefined
      }
    ]);
    setNewItemName('');
    setNewItemTip('');
  };

  const handleRemoveItem = (id: string) => {
    setRequiredItems(prev => prev.filter(it => it.id !== id));
  };

  const buildPreviewData = () => {
    const generatedRef = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      reference: generatedRef,
      targetEntity: targetEntity || 'السادة / العميل الكريم',
      transactionRef: transactionRef || 'TRX-2026-GENERAL',
      title: title || 'طلب إرفاق وثائق ومستندات هندسية',
      description: instructions || 'يرجى التكرم برفع المستندات المطلوبة لاستكمال إجراءات المعاملة الهندسية وتدقيقها.',
      expiresAt: `بعد ${expiresDays} أيام`,
      requiredItems: requiredItems.map(it => ({
        name: it.name,
        isRequired: it.isRequired,
        ext: it.ext,
        tip: it.tip
      }))
    };
  };

  const handleTriggerPreview = () => {
    const previewData = buildPreviewData();
    onPreviewRequested(previewData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const previewData = buildPreviewData();
    const allowed = allowedExtInput
      .split(/[,،\s]+/)
      .map(s => s.replace(/^\./, '').trim())
      .filter(Boolean);

    onRequestCreated({
      reference: previewData.reference,
      targetEntity: previewData.targetEntity,
      url: `https://files.details-wms.cloud/r/${previewData.reference}`,
      title: previewData.title,
      instructions: previewData.description,
      expiresDays,
      maxFiles,
      maxSizePerFileMb,
      allowedExt: allowed,
      requiredItems: previewData.requiredItems
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 font-sans select-none">
      <div 
        dir="rtl"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Dialog Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <FileUp className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>إنشاء رابط طلب وثائق خارجي (Branded File Request Link)</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-mono">
                  بوابة رفع مخصصة للعميل
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تحديد بنود الوثائق المطلوبة والامتدادات المسموحة والحجم مع توجيه الرفع المباشر لسحابة Hetzner
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* 1. Target Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">اسم العميل / الجهة المطلوب منها <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="مثال: شركة التطوير العقاري / م. راشد العتيبي"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">رقم المعاملة / المشروع المرتبط</label>
              <input
                type="text"
                placeholder="مثال: TRX-8821 / مجمع الياسمين"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">عنوان الطلب <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="مثال: طلب استكمال المستندات الفنية ورخص البناء لمشروع مجمع الياسمين"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">تعليمات وإرشادات الرفع للعميل</label>
            <textarea
              rows={2}
              placeholder="يرجى إرفاق المستندات واضحة وبصيغة PDF أو DWG المعتمدة..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
            />
          </div>

          {/* 2. Specific Required Items Builder */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="size-4 text-teal-700" />
                <span>قائمة المستندات المطلوبة بالتفصيل (تظهر بند بند في صفحة العميل):</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {requiredItems.length} بنود محددة
              </span>
            </div>

            <div className="space-y-2">
              {requiredItems.map((item, idx) => (
                <div key={item.id} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="size-5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.isRequired ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.isRequired ? 'إلزامي' : 'اختياري'}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      {item.tip && <span className="text-slate-400 text-[11px] mr-2">({item.tip})</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {item.ext}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add item inline form */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="اسم المستند المطلوب (مثال: محضر فحص التربة)..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 min-w-[200px] p-1.5 border border-slate-300 rounded-md text-xs bg-white"
              />
              <input
                type="text"
                placeholder="ملاحظة توضيحية للعميل..."
                value={newItemTip}
                onChange={(e) => setNewItemTip(e.target.value)}
                className="w-48 p-1.5 border border-slate-300 rounded-md text-xs bg-white"
              />
              <select
                value={newItemExt}
                onChange={(e) => setNewItemExt(e.target.value)}
                className="p-1.5 border border-slate-300 rounded-md text-xs bg-white"
              >
                <option value="PDF">PDF</option>
                <option value="DWG">DWG (CAD)</option>
                <option value="PDF, DWG">PDF, DWG</option>
                <option value="XLSX">Excel</option>
                <option value="JPG, PNG">صورة</option>
              </select>
              <label className="flex items-center gap-1 text-[11px] font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItemRequired}
                  onChange={(e) => setNewItemRequired(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>إلزامي</span>
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold cursor-pointer flex items-center gap-1"
              >
                <Plus className="size-3.5" />
                <span>إضافة بند</span>
              </button>
            </div>
          </div>

          {/* 3. Limits & Rules */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-2">
              ضوابط الرفع وتوجيه التخزين السحابي (Storage Limits & Policy)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">صلاحية الرابط:</label>
                <select
                  value={expiresDays}
                  onChange={(e) => setExpiresDays(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded-md text-xs bg-white"
                >
                  <option value={3}>3 أيام</option>
                  <option value={7}>7 أيام (افتراضي)</option>
                  <option value={14}>14 يوماً</option>
                  <option value={30}>30 يوماً</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">الحد الأقصى للملفات:</label>
                <select
                  value={maxFiles}
                  onChange={(e) => setMaxFiles(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded-md text-xs bg-white"
                >
                  <option value={5}>5 ملفات</option>
                  <option value={10}>10 ملفات</option>
                  <option value={20}>20 ملفاً</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">حجم الملف الأقصى:</label>
                <select
                  value={maxSizePerFileMb}
                  onChange={(e) => setMaxSizePerFileMb(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded-md text-xs bg-white"
                >
                  <option value={25}>25 ميجابايت</option>
                  <option value={50}>50 ميجابايت</option>
                  <option value={100}>100 ميجابايت (سحابة Hetzner)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">الصيغ المسموحة:</label>
                <input
                  type="text"
                  value={allowedExtInput}
                  onChange={(e) => setAllowedExtInput(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded-md text-xs bg-white font-mono"
                  placeholder="pdf, dwg, xlsx"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              * الملفات المرفوعة من العميل تخزن مباشرة في مستودع سحابة Hetzner المخصص لمركز الوثائق، وتخضع للفحص الآلي وتظهر في تبويب الوارد فور اكتمال الرفع.
            </p>
          </div>

          {/* Action buttons */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between -mx-5 -mb-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleTriggerPreview}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                <Eye className="size-4" />
                <span>معاينة صفحة العميل (بريفيو قبل الإنشاء)</span>
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              <Link2 className="size-4" />
              <span>إنشاء رابط الاستقبال وحفظ الطلب</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
