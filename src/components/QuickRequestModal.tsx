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
  HardDrive,
  MessageCircle,
  Smartphone,
  CheckCircle2,
  Send,
  Sliders,
  Copy,
  ExternalLink,
  Bot
} from 'lucide-react';
import type { EmployeeSession } from '@/lib/attachments-api';

interface QuickRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: EmployeeSession | null;
  onRequestCreated: (item: {
    reference: string;
    targetEntity: string;
    targetPhone?: string;
    url: string;
    title: string;
    instructions: string;
    channel: 'whatsapp' | 'sms' | 'link_only';
    autoWhatsAppSync: boolean;
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

  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'link_only'>('whatsapp');
  const [targetEntity, setTargetEntity] = useState('');
  const [targetPhone, setTargetPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [expiresDays, setExpiresDays] = useState(7);
  const [maxFiles, setMaxFiles] = useState(10);
  const [maxSizePerFileMb, setMaxSizePerFileMb] = useState(50);
  const [allowedExtInput, setAllowedExtInput] = useState('pdf, dwg, xlsx, jpg, png');
  const [autoWhatsAppSync, setAutoWhatsAppSync] = useState(true);

  // Specific required items builder
  const [requiredItems, setRequiredItems] = useState<Array<{ id: string; name: string; isRequired: boolean; ext: string; tip?: string }>>([
    { id: '1', name: 'صورة الصك الإلكتروني المحدث للموقع', isRequired: true, ext: 'PDF, JPG', tip: 'صادر من البورصة العقارية أو ناجز' },
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
      description: instructions || 'يرجى التكرم برفع المستندات المطلوبة عبر هذا الرابط أو إرفاقها مباشرة بالرد على محادثة الواتساب المعتمدة.',
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
      targetPhone: targetPhone || undefined,
      url: `https://files.details-wms.cloud/r/${previewData.reference}`,
      title: previewData.title,
      instructions: previewData.description,
      channel,
      autoWhatsAppSync,
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
                <span>طلب وثائق ومرفقات (واتساب ديتيلز · رسائل نصية SMS · رابط لاندينج)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  تسجيل تلقائي للمرفقات المستلمة
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                إرسال رسالة مع رابط لاندينج قصير، وعندما يرد العميل بمرفقات في الواتساب تتسجل تلقائياً في صندوق الوارد
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
          {/* 1. Delivery Channel Mode Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs block">طريقة الإرسال وقناة التواصل مع العميل:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div 
                onClick={() => setChannel('whatsapp')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  channel === 'whatsapp' 
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' 
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">محادثة واتساب ديتيلز الرسمية</div>
                    <div className="text-[10px] text-emerald-800 font-medium">مربوطة بباك إند Meta API</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  يصل العميل إشعار بالطلب مع رابط قصير، وأي ملف أو صورة يرسلها في الشات تُسجل فوراً كمستند مستلم بالصندوق.
                </p>
              </div>

              <div 
                onClick={() => setChannel('sms')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  channel === 'sms' 
                    ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20' 
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                    <Smartphone className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">رسالة نصية قصيرة (SMS)</div>
                    <div className="text-[10px] text-teal-800 font-medium">رابط لاندينج قصير ومباشر</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  رسالة SMS موجهة للهاتف مع رابط يفتح صفحة لاندينج برانديد متوافقة مع الجوال تتيح التصوير والرفع.
                </p>
              </div>

              <div 
                onClick={() => setChannel('link_only')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  channel === 'link_only' 
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0">
                    <Link2 className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">توليد الرابط الآمن فقط</div>
                    <div className="text-[10px] text-indigo-800 font-medium">نسخ يدوي أو مشاركة خارجية</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  توليد رابط صفحة الاستقبال ونسخه لمشاركته بأي وسيلة يدوية مع العميل أو وضعه في خطاب رسمي.
                </p>
              </div>
            </div>

            {/* WhatsApp Integration Feature Notice */}
            {channel === 'whatsapp' && (
              <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-[11px] text-emerald-900">
                <div className="flex items-center gap-2">
                  <Bot className="size-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>المزامنة التلقائية مع واتساب ديتيلز مفعّلة:</strong> عند رد العميل في الشات بملف PDF أو صورة صك، سيقوم النظام تلقائياً بربط الملف بهذه المعاملة وإدراجه في صندوق الوارد وقسم "ملفات للفرز بالذكاء".
                  </span>
                </div>
                <label className="flex items-center gap-1.5 shrink-0 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={autoWhatsAppSync}
                    onChange={(e) => setAutoWhatsAppSync(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>تفعيل الاستلام الآلي</span>
                </label>
              </div>
            )}
          </div>

          {/* 2. Target Client & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">اسم العميل / الجهة <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="مثال: م. راشد العتيبي / شركة التطوير"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                رقم جوال العميل (لواتساب أو SMS) {channel !== 'link_only' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                dir="ltr"
                required={channel !== 'link_only'}
                placeholder="9665xxxxxxxx"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
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
              placeholder="مثال: طلب صك الملكية وكروكي المساحة المعتمد لمشروع مجمع الياسمين"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">تعليمات ونص الرسالة المرسلة للعميل</label>
            <textarea
              rows={2}
              placeholder="مرحباً بكم، نرجو التكرم برفع المستندات المطلوبة عبر هذا الرابط أو إرسالها مباشرة في هذه المحادثة لاستكمال المعاملة..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
            />
          </div>

          {/* 3. Specific Required Items Builder */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="size-4 text-teal-700" />
                <span>قائمة المستندات المطلوبة بالتفصيل (تظهر بنداً بنداً في صفحة العميل):</span>
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
                <option value="JPG, PNG">صورة (ألبوم/كاميرا)</option>
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

          {/* 4. Limits & Rules */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-2">
              ضوابط الرفع ودعم الاستديو والملفات (Mobile & Storage Rules)
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
                  placeholder="pdf, dwg, xlsx, jpg, png"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              * صفحة اللاندينج تتيح للعميل عند فتحها على الجوال اختيار الملفات من مدير الملفات أو التقاط الصور مباشرة بالكاميرا أو اختيارها من ألبوم الصور (استديو الجوال).
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
                <span>معاينة صفحة العميل (بريفيو قبل الإرسال)</span>
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              {channel === 'whatsapp' ? <MessageCircle className="size-4" /> : <Send className="size-4" />}
              <span>{channel === 'whatsapp' ? 'إرسال عبر واتساب ديتيلز وتفعيل المراقبة' : 'إنشاء الطلب وإرسال الرسالة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
