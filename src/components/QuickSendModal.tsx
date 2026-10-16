import React, { useState } from 'react';
import { 
  UploadCloud, 
  HardDrive, 
  FolderOpen, 
  FileUp, 
  Link2, 
  Check, 
  Eye, 
  X, 
  Lock, 
  Clock, 
  Copy, 
  Share2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Send,
  Sliders,
  Sparkles
} from 'lucide-react';
import type { EmployeeSession } from '@/lib/attachments-api';
import { fileSize } from '@/lib/attachments-api';

interface QuickSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: EmployeeSession | null;
  onLinkCreated: (item: {
    reference: string;
    targetEntity: string;
    url: string;
    title: string;
    files: { name: string; size: string; pages: number; verified: boolean }[];
    expiresDays: number;
    downloadLimit: number;
    hasOtp: boolean;
    hasWatermark: boolean;
    landingMode: 'direct_download' | 'branded_landing';
  }) => void;
  onPreviewRequested: (previewData: any) => void;
}

export const QuickSendModal: React.FC<QuickSendModalProps> = ({
  isOpen,
  onClose,
  session,
  onLinkCreated,
  onPreviewRequested
}) => {
  if (!isOpen) return null;

  const [activeSource, setActiveSource] = useState<'windows_upload' | 'hetzner_explorer'>('windows_upload');
  const [recipientName, setRecipientName] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [expiresDays, setExpiresDays] = useState(7);
  const [downloadLimit, setDownloadLimit] = useState(5);
  const [landingMode, setLandingMode] = useState<'branded_landing' | 'direct_download'>('branded_landing');
  const [enableOtp, setEnableOtp] = useState(false);
  const [enableWatermark, setEnableWatermark] = useState(true);

  // Files from Windows upload
  const [localFiles, setLocalFiles] = useState<{ name: string; size: number; ext: string }[]>([]);
  
  // Files from Hetzner Storage Explorer
  const hetznerStorageFiles = [
    { path: '/projects/2026/TRX-8821/dwg/مخطط_الإنشائي_المعتمد_A1.dwg', name: 'مخطط_الإنشائي_المعتمد_A1.dwg', size: 14889700, date: '2026-10-15', node: 'Hetzner-Box-01' },
    { path: '/projects/2026/TRX-8821/reports/تقرير_التربة_والجسات_المعتمد.pdf', name: 'تقرير_التربة_والجسات_المعتمد.pdf', size: 5242880, date: '2026-10-14', node: 'Hetzner-Box-01' },
    { path: '/projects/2026/TRX-8790/survey/كروكي_الرفع_المساحي_الرسمي.pdf', name: 'كروكي_الرفع_المساحي_الرسمي.pdf', size: 3145728, date: '2026-10-12', node: 'Hetzner-Box-01' },
    { path: '/archive/deeds/صك_إلكتروني_أرض_الياسمين.pdf', name: 'صك_إلكتروني_أرض_الياسمين.pdf', size: 943718, date: '2026-10-10', node: 'Hetzner-Box-01' },
    { path: '/contracts/2026/عقد_الإشراف_الهندسي_الموقع.pdf', name: 'عقد_الإشراف_الهندسي_الموقع.pdf', size: 1887436, date: '2026-10-08', node: 'Hetzner-Box-01' }
  ];

  const [selectedHetznerPaths, setSelectedHetznerPaths] = useState<string[]>([]);
  const [searchExplorer, setSearchExplorer] = useState('');

  const handleDropLocalFiles = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const added = Array.from(e.dataTransfer.files).map(f => ({
        name: f.name,
        size: f.size,
        ext: f.name.split('.').pop() || 'bin'
      }));
      setLocalFiles(prev => [...prev, ...added]);
    }
  };

  const handleSelectLocalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const added = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: f.size,
        ext: f.name.split('.').pop() || 'bin'
      }));
      setLocalFiles(prev => [...prev, ...added]);
    }
  };

  const allSelectedFiles = [
    ...localFiles.map(f => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
      pages: 1,
      verified: true
    })),
    ...hetznerStorageFiles
      .filter(h => selectedHetznerPaths.includes(h.path))
      .map(h => ({
        name: h.name,
        size: (h.size / (1024 * 1024)).toFixed(1) + ' MB',
        pages: 6,
        verified: true
      }))
  ];

  const buildPreviewData = () => {
    const generatedRef = `SHR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      reference: generatedRef,
      targetEntity: recipientName || 'السادة / العميل الكريم',
      transactionRef: transactionRef || 'TRX-2026-GENERAL',
      title: title || 'حزمة مستندات هندسية معتمدة',
      description: notes || 'رابط تنزيل المستندات الهندسية المعتمدة الصادرة من ديتيلز للاستشارات الهندسية.',
      expiresAt: `بعد ${expiresDays} أيام`,
      maxDownloads: downloadLimit,
      remainingDownloads: downloadLimit,
      files: allSelectedFiles.length > 0 ? allSelectedFiles : [
        { name: 'مستند_هندسي_معتمد.pdf', size: '3.2 MB', pages: 4, verified: true }
      ]
    };
  };

  const handleTriggerPreview = () => {
    const previewData = buildPreviewData();
    onPreviewRequested(previewData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (allSelectedFiles.length === 0) {
      alert('يرجى اختيار ملف واحد على الأقل سواء من فايل اكسبلورر أو رفع من جهازك.');
      return;
    }

    const previewData = buildPreviewData();
    onLinkCreated({
      reference: previewData.reference,
      targetEntity: previewData.targetEntity,
      url: `https://files.details-wms.cloud/s/${previewData.reference}`,
      title: previewData.title,
      files: allSelectedFiles,
      expiresDays,
      downloadLimit,
      hasOtp: enableOtp,
      hasWatermark: enableWatermark,
      landingMode
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
              <Send className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>إرسال سريع ومباشر لملفات النظام (Hetzner Storage & Windows Upload)</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-mono">
                  توليد رابط آمن فوري
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                اختر ملفات من مستكشف Hetzner أو ارفع من جهازك مباشرة مع تتبع الفتح والتنزيل
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
          {/* 1. File Source Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <FolderOpen className="size-4 text-teal-700" />
                <span>مصدر الملفات المراد إرسالها:</span>
              </label>
              <span className="text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-mono font-semibold">
                إجمالي الملفات المختارة: {allSelectedFiles.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveSource('windows_upload')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-right ${
                  activeSource === 'windows_upload'
                    ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="size-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <UploadCloud className="size-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">رفع مباشر من الويندوز / الجهاز</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">سحب وإفلات أو تصفح من الحاسب</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveSource('hetzner_explorer')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-right ${
                  activeSource === 'hetzner_explorer'
                    ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="size-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <HardDrive className="size-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">مستكشف سحابة Hetzner Storage</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">ربط فوري بملفات ومخططات المشاريع</div>
                </div>
              </button>
            </div>

            {/* Source Content: Windows Upload */}
            {activeSource === 'windows_upload' && (
              <div className="space-y-3 pt-2">
                <div 
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={handleDropLocalFiles}
                  className="border-2 border-dashed border-slate-300 hover:border-teal-600 bg-slate-50/60 rounded-xl p-5 text-center cursor-pointer transition-colors relative"
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleSelectLocalInput}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="size-8 text-teal-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-xs">اسحب وأفلت الملفات هنا أو اضغط للتصفح من الويندوز</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    مخططات DWG، ملفات PDF، تقارير فنية، ملفات Excel (حتى 100 ميجابايت للملف)
                  </p>
                </div>

                {localFiles.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-white">
                    {localFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 text-[11px]">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="size-4 text-teal-700 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                          <span className="text-slate-400 font-mono">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLocalFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Source Content: Hetzner File Explorer */}
            {activeSource === 'hetzner_explorer' && (
              <div className="space-y-2 pt-2 border border-slate-200 rounded-xl p-3 bg-white">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <HardDrive className="size-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">مستكشف الملفات (Storage Box Remote Node)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="تصفية الملفات بالاسم أو المعاملة..."
                    value={searchExplorer}
                    onChange={(e) => setSearchExplorer(e.target.value)}
                    className="text-[11px] p-1.5 border border-slate-300 rounded-md w-52"
                  />
                </div>

                <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 font-mono text-[11px]">
                  {hetznerStorageFiles
                    .filter(f => f.name.includes(searchExplorer) || f.path.includes(searchExplorer))
                    .map((item) => {
                      const isSelected = selectedHetznerPaths.includes(item.path);
                      return (
                        <div 
                          key={item.path}
                          onClick={() => {
                            setSelectedHetznerPaths(prev => 
                              isSelected ? prev.filter(p => p !== item.path) : [...prev, item.path]
                            );
                          }}
                          className={`p-2 flex items-center justify-between cursor-pointer rounded-md transition-colors ${
                            isSelected ? 'bg-indigo-50/80 font-bold text-indigo-950' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded text-indigo-600"
                            />
                            <span className="truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400 shrink-0">
                            <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.node}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Destination Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-700 block mb-1">اسم العميل / الجهة المستلمة <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="مثال: شركة التطوير الحديثة / م. أحمد السعدون"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">رقم المعاملة / المشروع المرتبط</label>
              <input
                type="text"
                placeholder="مثال: TRX-8821 / أبراج الياسمين"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">عنوان رسالة الإرسال <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="مثال: تسليم المخطط الإنشائي وكروكي المساحة المعتمد"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* 3. Link Settings & Security Controls */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-200 pb-2">
              <Sliders className="size-4 text-teal-700" />
              <span>إعدادات الصلاحية والأمان ونمط صفحة الرابط</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">صلاحية الرابط (أيام):</label>
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
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">حد التنزيلات المسموح:</label>
                <select
                  value={downloadLimit}
                  onChange={(e) => setDownloadLimit(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded-md text-xs bg-white"
                >
                  <option value={1}>تنزيل واحد فقط (حماية قصوى)</option>
                  <option value={3}>3 تنزيلات</option>
                  <option value={5}>5 تنزيلات (افتراضي)</option>
                  <option value={10}>10 تنزيلات</option>
                  <option value={0}>بلا حد</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">نمط توجيه الرابط:</label>
                <select
                  value={landingMode}
                  onChange={(e) => setLandingMode(e.target.value as any)}
                  className="w-full p-1.5 border border-slate-300 rounded-md text-xs bg-white font-semibold text-teal-800"
                >
                  <option value="branded_landing">صفحة لاندينج برانديد (موصى بها)</option>
                  <option value="direct_download">تنزيل مباشر فور فتح الرابط</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-slate-200/80">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enableWatermark}
                  onChange={(e) => setEnableWatermark(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>تطبيق العلامة المائية الرقمية باسم الجهة</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enableOtp}
                  onChange={(e) => setEnableOtp(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>حماية برمز تحقق ثنائي (2FA / OTP)</span>
              </label>

              <span className="text-[11px] text-slate-500 mr-auto font-mono">
                * مسارات التخزين في Hetzner مشفرة بالكامل ولا تظهر في الرابط
              </span>
            </div>
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
              <Send className="size-4" />
              <span>توليد رابط الإرسال وحفظ العملية</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
