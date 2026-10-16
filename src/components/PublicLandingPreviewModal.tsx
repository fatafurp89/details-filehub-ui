import React, { useState } from 'react';
import { 
  FolderDown, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Barcode, 
  Smartphone, 
  Monitor, 
  X,
  FileCheck2,
  HardDrive,
  Eye,
  QrCode,
  Sparkles,
  Camera,
  Check,
  Share2,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { LegalMarginBar } from './LegalMarginBar';

interface PublicLandingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'upload_request' | 'file_download';
  data: {
    reference: string;
    targetEntity: string;
    transactionRef: string;
    title: string;
    description?: string;
    expiresAt: string;
    maxDownloads?: number;
    remainingDownloads?: number;
    files?: { name: string; size: string; pages: number; verified: boolean; previewUrl?: string }[];
    requiredItems?: { name: string; isRequired: boolean; ext: string; tip?: string }[];
  };
}

export const PublicLandingPreviewModal: React.FC<PublicLandingPreviewModalProps> = ({
  isOpen,
  onClose,
  type,
  data
}) => {
  if (!isOpen) return null;

  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { size: string; progress: number; ready: boolean }>>({});
  const [activePreviewDoc, setActivePreviewDoc] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSimulateFileUpload = (itemName: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [itemName]: { size: '2.4 MB', progress: 40, ready: false }
    }));

    setTimeout(() => {
      setUploadedFiles(prev => ({
        ...prev,
        [itemName]: { size: '2.4 MB', progress: 100, ready: true }
      }));
    }, 700);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://files.details-wms.cloud/${type === 'upload_request' ? 'r' : 's'}/${data.reference}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 md:p-6">
      <div 
        dir="rtl"
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden text-right font-sans animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Control Bar for Engineering Office Staff */}
        <div className="p-3.5 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <span>معاينة حية وتفاعلية لصفحة العميل (Client Interactive Portal)</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-mono">
                  {type === 'upload_request' ? 'بوابة رفع وثائق آمنة' : 'بوابة تنزيل مستندات معتمدة'}
                </span>
              </h3>
              <div className="text-[11px] text-slate-400 mt-0.5">
                تكامل مباشر مع Hetzner Storage Box · تشفير مسارات · فحص أمني فوري
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Device Switcher */}
            <div className="flex bg-slate-700/80 p-0.5 rounded-lg border border-slate-600 text-xs">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-teal-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="size-3.5" />
                <span>شاشة كمبيوتر</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-teal-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>هاتف جوال (Mobile View)</span>
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium cursor-pointer"
            >
              {copiedLink ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5" />}
              <span>{copiedLink ? 'تم نسخ الرابط' : 'مشاركة الرابط'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="flex-1 bg-slate-950 p-3 md:p-6 overflow-y-auto flex items-center justify-center">
          <div 
            className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col ${
              deviceView === 'desktop' 
                ? 'w-full max-w-4xl min-h-[620px]' 
                : 'w-[380px] h-[680px] rounded-[40px] border-[8px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]'
            }`}
          >
            {/* Header: Detail's Royal Navy & Emerald Branding */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 border-b-4 border-teal-600 relative overflow-hidden">
              {/* Subtle background geometry */}
              <div className="absolute left-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg border border-teal-400/30">
                    <FolderDown className="size-6" />
                  </div>
                  <div>
                    <h1 className="text-base md:text-lg font-black tracking-tight flex items-center gap-2">
                      ديتيلز للاستشارات الهندسية
                      <span className="text-[10px] font-mono font-normal bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full">
                        منصة الوثائق المعتمدة
                      </span>
                    </h1>
                    <div className="text-[11px] text-teal-300/90 font-medium mt-0.5">
                      Details Engineering Consulting · معتمدة من الهيئة السعودية للمهندسين
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-slate-400 font-mono">سيرفر التخزين السحابي</div>
                    <div className="text-[11px] font-bold text-teal-300 flex items-center gap-1 font-mono">
                      <HardDrive className="size-3" />
                      <span>Hetzner Storage Box (Protected)</span>
                    </div>
                  </div>
                  <div className="size-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 text-teal-400">
                    <QrCode className="size-5" />
                  </div>
                </div>
              </div>

              {/* Context bar with Transaction reference & Expiration */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">رمز الطلب:</span>
                  <span className="font-mono font-bold text-amber-300">{data.reference}</span>
                  <span className="text-slate-400 mr-2 text-[11px]">رقم المعاملة:</span>
                  <span className="font-mono bg-teal-900/80 text-teal-200 px-2.5 py-0.5 rounded border border-teal-700/80 font-bold">
                    {data.transactionRef}
                  </span>
                </div>
                <div className="text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="size-3.5 text-amber-400" />
                  <span>ينتهي الرابط في: <strong>{data.expiresAt}</strong></span>
                </div>
              </div>
            </div>

            {/* Landing Body Content */}
            <div className="p-5 md:p-6 flex-1 overflow-y-auto space-y-5 bg-slate-50/60 text-xs">
              {/* Target Entity Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      الجهة المصرح لها بالاطلاع والتنفيذ
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">تشفير 256-bit SSL</span>
                  </div>
                  <h2 className="text-sm md:text-base font-bold text-slate-900 pt-0.5">
                    {data.targetEntity}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {data.description || 'يسرنا تزويدكم بالوثائق والتقارير الهندسية المعتمدة للمشروع. يرجى التنزيل قبل انتهاء الصلاحية المحددة للرابط.'}
                  </p>
                </div>
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Lock className="size-5 text-teal-700" />
                </div>
              </div>

              {/* MODE 1: FILE DOWNLOAD LANDING */}
              {type === 'file_download' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <FileCheck2 className="size-4 text-teal-700" />
                      المستندات الهندسية المتاحة للتنزيل الفوري ({data.files?.length || 3})
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>حد التنزيل: {data.maxDownloads || 5}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        متبقي {data.remainingDownloads || 4} تنزيلات
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {(data.files || [
                      { name: 'مخطط_السلامة_والدفاع_المدني_المعتمد.dwg', size: '14.2 MB', pages: 1, verified: true },
                      { name: 'تقرير_الجسات_واختبار_التربة_الإنشائي.pdf', size: '4.8 MB', pages: 8, verified: true },
                      { name: 'خطاب_الإحالة_والتوجيه_الرسمي_للبلدية.pdf', size: '820 KB', pages: 2, verified: true }
                    ]).map((f, i) => (
                      <div 
                        key={i}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-teal-500 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`size-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            f.name.endsWith('.dwg') ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-700'
                          }`}>
                            {f.name.endsWith('.dwg') ? 'CAD' : 'PDF'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate" title={f.name}>
                              {f.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                              <span>{f.size}</span>
                              <span>·</span>
                              <span>{f.pages} صفحات</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-1 font-sans">
                                <CheckCircle2 className="size-3 text-emerald-600" /> مفحوص ومطابق
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => setActivePreviewDoc(f.name)}
                            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="معاينة سريعة"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer">
                            <Download className="size-3.5" />
                            <span>تنزيل</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Document preview lightbox if clicked */}
                  {activePreviewDoc && (
                    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-700 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                          <Eye className="size-4" />
                          <span>معاينة حية للوثيقة: {activePreviewDoc}</span>
                        </div>
                        <button onClick={() => setActivePreviewDoc(null)} className="text-slate-400 hover:text-white">
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="h-44 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
                        [معاينة A4 تفاعلية مع علامة مائية باسم {data.targetEntity}]
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0 text-amber-700" />
                    <span>
                      <strong>سياسة حماية المستندات:</strong> الوثائق المرفقة محمية بعلامة مائية رقمية وتتضمن بصمات SHA-256 للتحقق القانوني.
                    </span>
                  </div>
                </div>
              )}

              {/* MODE 2: UPLOAD REQUEST LANDING */}
              {type === 'upload_request' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <Upload className="size-4 text-teal-700" />
                      المستندات المطلوبة لاستكمال المعاملة:
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      * يرجى إرفاق الوثائق المطلوبة بصيغة واضحة
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {(data.requiredItems || [
                      { name: 'صورة الصك الإلكتروني المحدث للموقع', isRequired: true, ext: 'PDF, JPG', tip: 'يجب أن يكون الصك مفعلاً من البورصة العقارية' },
                      { name: 'موافقة الجيران أو محضر تحديد الارتدادات المعتمد', isRequired: true, ext: 'PDF', tip: 'موقع ومعتمد من المكتب المساحي' },
                      { name: 'شهادة تنسيق إطلاق التيار الكهربائي الحديثة', isRequired: false, ext: 'PDF, PNG', tip: 'اختياري في حال توفرها' }
                    ]).map((item, i) => {
                      const uploadState = uploadedFiles[item.name];
                      return (
                        <div 
                          key={i}
                          className={`p-3.5 rounded-xl border transition-all ${
                            uploadState?.ready 
                              ? 'bg-emerald-50/70 border-emerald-300' 
                              : 'bg-white border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  item.isRequired ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {item.isRequired ? 'إلزامي' : 'اختياري'}
                                </span>
                                <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                              </div>
                              {item.tip && (
                                <p className="text-[11px] text-slate-500">{item.tip}</p>
                              )}
                            </div>

                            {uploadState?.ready ? (
                              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs bg-emerald-100 px-3 py-1 rounded-lg">
                                <CheckCircle2 className="size-4 text-emerald-600" />
                                <span>جاهز للإرسال ({uploadState.size})</span>
                              </div>
                            ) : uploadState ? (
                              <div className="flex items-center gap-2 text-teal-700 text-xs font-mono">
                                <span>جارٍ الرفع {uploadState.progress}%...</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleSimulateFileUpload(item.name)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-800 rounded-lg font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
                              >
                                <Camera className="size-3.5" />
                                <span>اختيار أو تصوير</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Drop zone with mobile camera support notice */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); handleSimulateFileUpload('وثيقة_إضافية_مرفوعة.pdf'); }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                      dragActive ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-white hover:border-teal-500'
                    }`}
                  >
                    <Upload className="size-8 text-teal-600 mx-auto mb-2" />
                    <div className="font-bold text-slate-800 text-xs">اسحب وأفلت الملفات الإضافية هنا أو اضغط للاختيار</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      يدعم التخزين عبر سحابة Hetzner Storage · الحد الأقصى للملف الواحد: 100 ميجابايت
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Legal Margin Bar */}
            <div className="bg-white border-t border-slate-200">
              <LegalMarginBar 
                referenceNumber={data.reference}
                statusLabel="بوابة إلكترونية مشفرة"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3.5 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-400" />
            <span>يمكن للعميل فتح هذا الرابط من الجوال أو الكمبيوتر، ورفع الملفات دون حاجة لتسجيل حساب أو كلمة مرور.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
          >
            إغلاق المعاينة
          </button>
        </div>
      </div>
    </div>
  );
};
