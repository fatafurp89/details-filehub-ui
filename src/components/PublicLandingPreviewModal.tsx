import React, { useState, useEffect } from 'react';
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
  Image,
  FolderUp,
  Check, 
  Share2, 
  MessageSquare,
  HelpCircle,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  Archive,
  RefreshCw,
  Sun,
  Moon,
  Globe,
  SlidersHorizontal,
  KeyRound,
  FileCheck,
  Building2,
  CheckCheck,
  Send,
  Printer,
  ChevronRight,
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
    files?: { name: string; size: string; pages: number; verified: boolean; sha256?: string; type?: 'cad' | 'pdf' | 'doc' }[];
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
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { size: string; progress: number; ready: boolean; sha256?: string }>>({});
  const [activePreviewDoc, setActivePreviewDoc] = useState<{ name: string; type: string; sha256: string } | null>(null);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadAllProgress, setDownloadAllProgress] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [auditLogActive, setAuditLogActive] = useState(false);

  // New features state
  const [otpProtection, setOtpProtection] = useState(false);
  const [otpEntered, setOtpEntered] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionReceiptRef, setSubmissionReceiptRef] = useState('');

  const [inspectionModal, setInspectionModal] = useState(false);

  const defaultFiles = [
    { name: 'مخطط_السلامة_والدفاع_المدني_المعتمد.dwg', size: '14.2 MB', pages: 1, verified: true, type: 'cad' as const, sha256: '9a8b1...3f12' },
    { name: 'تقرير_الجسات_واختبار_التربة_الإنشائي.pdf', size: '4.8 MB', pages: 8, verified: true, type: 'pdf' as const, sha256: '7c4d2...8e90' },
    { name: 'خطاب_الإحالة_والتوجيه_الرسمي_للبلدية.pdf', size: '820 KB', pages: 2, verified: true, type: 'pdf' as const, sha256: '1e3f8...5b44' },
    { name: 'جدول_الكميات_والمواصفات_الهندسية.xlsx', size: '1.2 MB', pages: 4, verified: true, type: 'doc' as const, sha256: '5a2c9...6f11' }
  ];

  const filesList = data.files || defaultFiles;

  const simulatedAuditEvents = [
    { time: '04:52', event: 'تم إنشاء الرابط وتوقيعه رقمياً', actor: 'النظام (Hetzner Storage)' },
    { time: '04:55', event: 'فحص الحماية من الفيروسات والبرمجيات الخبيثة', actor: 'DLP Sentinel' },
    { time: '04:58', event: 'تطبيق العلامة المائية باسم ' + data.targetEntity, actor: 'خدمة توليد الوثائق' },
    { time: '05:01', event: 'محاكاة التحقق من هوية المستلم OTP', actor: 'بوابة التحقق الموحد' }
  ];

  const handleSimulateFileUpload = (itemName: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [itemName]: { size: '3.1 MB', progress: 35, ready: false }
    }));

    setTimeout(() => {
      setUploadedFiles(prev => ({
        ...prev,
        [itemName]: { size: '3.1 MB', progress: 100, ready: true, sha256: 'e89c...2041' }
      }));
    }, 600);
  };

  const handleFinalSubmit = () => {
    const ref = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmissionReceiptRef(ref);
    setSubmissionComplete(true);
  };

  const handleVerifyOtp = () => {
    if (otpEntered === '4892' || otpEntered === '1234' || otpEntered.length === 4) {
      setOtpVerified(true);
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const handleDownloadAllZip = () => {
    setDownloadAllProgress(true);
    setTimeout(() => {
      setDownloadAllProgress(false);
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://files.details-wms.cloud/${type === 'upload_request' ? 'r' : 's'}/${data.reference}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const t = {
    ar: {
      brandTitle: 'ديتيلز للاستشارات الهندسية',
      subTitle: 'منصة الوثائق الهندسية المعتمدة · كود البناء السعودي',
      entityTag: 'الجهة المصرح لها بالاطلاع والتنفيذ',
      reqId: 'رمز الطلب',
      trxId: 'رقم المعاملة',
      expiresIn: 'ينتهي الرابط في',
      readyDocs: 'المستندات الهندسية المتاحة للتنزيل الفوري',
      downloadZip: 'تنزيل الكل ZIP',
      downloadingZip: 'جارٍ تجهيز الحزمة...',
      remainingDownloads: 'متبقي تنزيلات',
      verified: 'مفحوص ومطابق',
      preview: 'معاينة',
      download: 'تنزيل',
      requiredUploads: 'المستندات المطلوبة لاستكمال المعاملة',
      mandatory: 'إلزامي',
      optional: 'اختياري',
      chooseOrSnap: 'اختيار أو تصوير',
      readyToSend: 'جاهز للإرسال',
      dragDropTitle: 'اسحب وأفلت الملفات الإضافية هنا أو اضغط للاختيار',
      dragDropSubtitle: 'يدعم التخزين عبر سحابة Hetzner Storage · الحد الأقصى للملف: 100MB',
      sslNotice: 'تشفير 256-bit SSL · Hetzner Storage Box',
      otpPrompt: 'الرابط محمي برمز تحقق أمني (OTP)',
      otpDesc: 'أدخل رمز التحقق المرسل لهاتفك المسجل لإتاحة التنزيل:',
      verifyBtn: 'تحقق والدخول للمستندات',
      receiptTitle: 'تم استلام المستندات بنجاح وجارٍ التحليل الآلي',
      receiptNotice: 'تم إصدار إشعار استلام رسمي برقم قيد معتمد وبصمة إيداع مشفرة.',
      receiptRef: 'رقم الإشعار المعتمد',
      printReceipt: 'طباعة إشعار الاستلام الرسمي'
    },
    en: {
      brandTitle: 'Details Engineering Consulting',
      subTitle: 'Official Certified Document Portal · Saudi Building Code',
      entityTag: 'Authorized Organization / Client',
      reqId: 'Request ID',
      trxId: 'Transaction Ref',
      expiresIn: 'Expires at',
      readyDocs: 'Approved Documents Available for Download',
      downloadZip: 'Download All ZIP',
      downloadingZip: 'Packaging ZIP...',
      remainingDownloads: 'Remaining Downloads',
      verified: 'Verified & Clean',
      preview: 'Preview',
      download: 'Download',
      requiredUploads: 'Required Documents to Complete Process',
      mandatory: 'Mandatory',
      optional: 'Optional',
      chooseOrSnap: 'Choose / Camera',
      readyToSend: 'Ready to submit',
      dragDropTitle: 'Drag & Drop additional files here or click to browse',
      dragDropSubtitle: 'Direct Hetzner Cloud Storage · Max file size: 100MB',
      sslNotice: '256-bit SSL Encryption · Hetzner Storage Box',
      otpPrompt: 'This link is secured by 2FA (OTP)',
      otpDesc: 'Enter the verification code sent to your registered phone number:',
      verifyBtn: 'Verify & Access Documents',
      receiptTitle: 'Documents Received Successfully & Under Analysis',
      receiptNotice: 'An official submission receipt has been generated with encrypted audit hash.',
      receiptRef: 'Official Receipt Reference',
      printReceipt: 'Print Official Submission Receipt'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 select-none font-sans">
      <div 
        dir="rtl"
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[96vh] flex flex-col overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Control Bar for Staff */}
        <div className="p-3 md:p-3.5 bg-slate-800/95 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="relative flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-3 bg-teal-500" />
            </span>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>معاينة حية ومباشرة لصفحة العميل (Hetzner Cloud Storage Portal)</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-mono">
                  {type === 'upload_request' ? 'بوابة استلام ملفات' : 'بوابة تنزيل مستندات معتمدة'}
                </span>
              </h3>
              <div className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                تأكد من هوية المستندات والعلامة المائية وقنوات الأمان قبل الإرسال الفعلي
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-2.5">
            {/* OTP Security Simulator toggle */}
            <button
              onClick={() => {
                setOtpProtection(!otpProtection);
                setOtpVerified(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                otpProtection ? 'bg-amber-900/60 border-amber-500 text-amber-200' : 'bg-slate-700 border-slate-600 text-slate-300'
              }`}
              title="محاكاة حماية الرابط برمز تحقق SMS/OTP"
            >
              <KeyRound className="size-3.5 text-amber-400" />
              <span className="hidden sm:inline">حماية OTP:</span>
              <span>{otpProtection ? 'مفعلة' : 'معطلة'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 cursor-pointer"
              title="تبديل لغة صفحة العميل"
            >
              <Globe className="size-3.5 text-teal-400" />
              <span className="font-mono">{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Dark/Light Client Preview Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 rounded-lg cursor-pointer"
              title={theme === 'light' ? 'تحويل صفحة العميل للوضع الليلي' : 'تحويل صفحة العميل للوضع الفاتح'}
            >
              {theme === 'light' ? <Moon className="size-4 text-amber-300" /> : <Sun className="size-4 text-amber-400" />}
            </button>

            {/* Watermark toggle */}
            <button
              onClick={() => setWatermarkEnabled(!watermarkEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                watermarkEnabled ? 'bg-teal-900/60 border-teal-500 text-teal-200' : 'bg-slate-700 border-slate-600 text-slate-300'
              }`}
            >
              <Shield className="size-3.5" />
              <span className="hidden sm:inline">العلامة المائية:</span>
              <span>{watermarkEnabled ? 'مفعلة' : 'معطلة'}</span>
            </button>

            {/* Audit Log Toggle */}
            <button
              onClick={() => setAuditLogActive(!auditLogActive)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                auditLogActive ? 'bg-amber-900/60 border-amber-500 text-amber-200' : 'bg-slate-700 border-slate-600 text-slate-300'
              }`}
              title="سجل العمليات الأمني المباشر"
            >
              <SlidersHorizontal className="size-3.5" />
              <span className="hidden md:inline">سجل الأمان</span>
            </button>

            {/* Device Switcher */}
            <div className="flex bg-slate-700/80 p-0.5 rounded-lg border border-slate-600 text-xs">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-teal-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="size-3.5" />
                <span className="hidden sm:inline">كمبيوتر</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-teal-600 text-white font-bold shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>جوال</span>
              </button>
            </div>

            {/* QR Code Trigger */}
            <button
              onClick={() => setShowQrModal(!showQrModal)}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 hover:text-white rounded-lg cursor-pointer"
              title="عرض باركود الجوال"
            >
              <QrCode className="size-4" />
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
        <div className="flex-1 bg-slate-950 p-2 md:p-6 overflow-y-auto flex items-center justify-center relative">
          {/* Simulated Mobile QR Modal overlay */}
          {showQrModal && (
            <div className="absolute z-40 bg-slate-900 border border-slate-700 p-5 rounded-2xl shadow-2xl text-center space-y-3 max-w-xs animate-in zoom-in-95">
              <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                <span>مسح الرابط بكاميرا الجوال</span>
                <button onClick={() => setShowQrModal(false)}><X className="size-4 text-slate-400" /></button>
              </div>
              <div className="bg-white p-3 rounded-xl mx-auto inline-block shadow-inner">
                <QrCode className="size-40 text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                افتح كاميرا الهاتف لمسح الرمز والانتقال المباشر لصفحة العميل
              </p>
            </div>
          )}

          {/* Side Drawer: Security Audit Trace */}
          {auditLogActive && (
            <div className="absolute left-4 top-4 bottom-4 w-72 bg-slate-900/95 border border-slate-700 rounded-xl p-4 z-30 shadow-2xl overflow-y-auto space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-teal-400" />
                  <span>سجل التدقيق والأمان</span>
                </span>
                <button onClick={() => setAuditLogActive(false)}><X className="size-3.5" /></button>
              </div>
              <div className="space-y-2 font-mono text-[11px]">
                {simulatedAuditEvents.map((evt, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-800/80 border border-slate-700/60 space-y-0.5">
                    <div className="flex justify-between text-teal-400">
                      <span>{evt.actor}</span>
                      <span>{evt.time}</span>
                    </div>
                    <div className="text-slate-300 font-sans">{evt.event}</div>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-teal-950/60 border border-teal-800/80 rounded text-[10px] text-teal-300 leading-normal">
                كل عملية فتح أو تنزيل تُسجل بعنوان IP وبصمة المتصفح دون كشف مسار السيرفر.
              </div>
            </div>
          )}

          {/* The Client Container */}
          <div 
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className={`transition-all duration-300 rounded-2xl shadow-2xl overflow-hidden border flex flex-col ${
              theme === 'dark' ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-800 border-slate-200'
            } ${
              deviceView === 'desktop' 
                ? 'w-full max-w-4xl min-h-[620px]' 
                : 'w-[380px] h-[700px] rounded-[44px] border-[10px] border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.85)]'
            }`}
          >
            {/* Header: Detail's Royal Navy & Emerald Branding */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 border-b-4 border-teal-600 relative overflow-hidden">
              <div className="absolute left-0 top-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg border border-teal-400/30">
                    <FolderDown className="size-6" />
                  </div>
                  <div>
                    <h1 className="text-base md:text-lg font-black tracking-tight flex items-center gap-2">
                      {t.brandTitle}
                      <span className="text-[10px] font-mono font-normal bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full">
                        {lang === 'ar' ? 'منصة الوثائق المعتمدة' : 'Official Portal'}
                      </span>
                    </h1>
                    <div className="text-[11px] text-teal-300/90 font-medium mt-0.5">
                      {t.subTitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-slate-400 font-mono">Storage Node</div>
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
                  <span className="text-slate-400 text-[11px]">{t.reqId}:</span>
                  <span className="font-mono font-bold text-amber-300">{data.reference}</span>
                  <span className="text-slate-400 mr-2 text-[11px]">{t.trxId}:</span>
                  <span className="font-mono bg-teal-900/80 text-teal-200 px-2.5 py-0.5 rounded border border-teal-700/80 font-bold">
                    {data.transactionRef}
                  </span>
                </div>
                <div className="text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="size-3.5 text-amber-400" />
                  <span>{t.expiresIn}: <strong>{data.expiresAt}</strong></span>
                </div>
              </div>
            </div>

            {/* Landing Body Content */}
            <div className={`p-4 md:p-6 flex-1 overflow-y-auto space-y-4 md:space-y-5 text-xs ${
              theme === 'dark' ? 'bg-slate-900/90' : 'bg-slate-50/70'
            }`}>
              {/* SUBMISSION RECEIPT VIEW (IF COMPLETE) */}
              {submissionComplete ? (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-teal-500/40 shadow-xl space-y-4 text-center animate-in zoom-in-95">
                  <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCheck className="size-8" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                    {t.receiptTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    {t.receiptNotice}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono">{t.receiptRef}</span>
                    <div className="text-base font-mono font-bold text-teal-700 dark:text-teal-400">
                      {submissionReceiptRef}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Printer className="size-4" />
                      <span>{t.printReceipt}</span>
                    </button>
                    <button
                      onClick={() => setSubmissionComplete(false)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      العودة للقائمة
                    </button>
                  </div>
                </div>
              ) : otpProtection && !otpVerified ? (
                /* OTP Verification Challenge View */
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md max-w-md mx-auto space-y-4 text-center animate-in zoom-in-95">
                  <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <KeyRound className="size-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.otpPrompt}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.otpDesc} (رمز تجريبي: <strong>4892</strong>)
                  </p>
                  <div>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpEntered}
                      onChange={(e) => setOtpEntered(e.target.value)}
                      placeholder="• • • •"
                      className="w-36 text-center text-xl font-mono tracking-widest p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                    />
                    {otpError && (
                      <p className="text-[11px] text-red-500 mt-1">رمز التحقق غير صحيح، حاول مجدداً</p>
                    )}
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                  >
                    {t.verifyBtn}
                  </button>
                </div>
              ) : (
                <>
                  {/* Target Entity Card */}
                  <div className={`p-4 rounded-xl border shadow-xs flex items-start justify-between gap-3 ${
                    theme === 'dark' ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200/80'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          {t.entityTag}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.sslNotice}</span>
                      </div>
                      <h2 className="text-sm md:text-base font-bold pt-0.5">
                        {data.targetEntity}
                      </h2>
                      <p className="text-slate-500 leading-relaxed text-xs">
                        {data.description || 'يسرنا تزويدكم بالوثائق والتقارير الهندسية المعتمدة للمشروع. يرجى التنزيل قبل انتهاء الصلاحية المحددة للرابط.'}
                      </p>
                    </div>
                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                      <Lock className="size-5 text-teal-700 dark:text-teal-400" />
                    </div>
                  </div>

                  {/* MODE 1: FILE DOWNLOAD LANDING */}
                  {type === 'file_download' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-bold text-xs flex items-center gap-2">
                          <FileCheck2 className="size-4 text-teal-700 dark:text-teal-400" />
                          {t.readyDocs} ({filesList.length})
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleDownloadAllZip}
                            disabled={downloadAllProgress}
                            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 dark:bg-teal-700 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs disabled:bg-slate-400"
                          >
                            <Archive className={`size-3.5 ${downloadAllProgress ? 'animate-spin' : ''}`} />
                            <span>{downloadAllProgress ? t.downloadingZip : t.downloadZip}</span>
                          </button>
                          
                          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                            {t.remainingDownloads} {data.remainingDownloads || 4}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {filesList.map((f, i) => (
                          <div 
                            key={i}
                            className={`p-3.5 rounded-xl border shadow-xs flex items-center justify-between transition-all group ${
                              theme === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:border-teal-500' : 'bg-white border-slate-200/80 hover:border-teal-500'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`size-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                f.type === 'cad' ? 'bg-amber-100 text-amber-800' : f.type === 'doc' ? 'bg-blue-100 text-blue-800' : 'bg-teal-50 text-teal-700'
                              }`}>
                                {f.type === 'cad' ? 'CAD' : f.type === 'doc' ? 'XLS' : 'PDF'}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs truncate" title={f.name}>
                                  {f.name}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono flex-wrap">
                                  <span>{f.size}</span>
                                  <span>·</span>
                                  <span>{f.pages} {lang === 'ar' ? 'صفحات' : 'pages'}</span>
                                  <span>·</span>
                                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 font-sans">
                                    <CheckCircle2 className="size-3" /> {t.verified}
                                  </span>
                                  <span>·</span>
                                  <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-sans font-medium flex items-center gap-1">
                                    <HardDrive className="size-3" />
                                    <span>Hetzner Box Direct</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => setActivePreviewDoc({ name: f.name, type: f.type || 'pdf', sha256: f.sha256 || '4f1a...9981' })}
                                className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg cursor-pointer text-[11px] font-medium transition-colors ${
                                  theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:text-teal-800 hover:bg-teal-50'
                                }`}
                              >
                                <Eye className="size-3.5 text-teal-600" />
                                <span>{t.preview}</span>
                              </button>
                              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer">
                                <Download className="size-3.5" />
                                <span>{t.download}</span>
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
                              <span>{t.preview}: {activePreviewDoc.name}</span>
                            </div>
                            <button onClick={() => setActivePreviewDoc(null)} className="text-slate-400 hover:text-white">
                              <X className="size-4" />
                            </button>
                          </div>
                          <div className="h-48 bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-slate-400 text-xs relative overflow-hidden p-4 text-center">
                            {watermarkEnabled && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 rotate-[-25deg] text-3xl font-black text-white">
                                {data.targetEntity} · {data.transactionRef}
                              </div>
                            )}
                            <FileText className="size-10 text-teal-500 mb-2 opacity-80" />
                            <span className="font-semibold text-slate-300">{t.brandTitle}</span>
                            <span className="text-[11px] text-slate-500 mt-1 font-mono">
                              SHA-256: {activePreviewDoc.sha256} · Hetzner Storage Verified
                            </span>
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
                        <h3 className="font-bold text-xs flex items-center gap-2">
                          <Upload className="size-4 text-teal-700 dark:text-teal-400" />
                          {t.requiredUploads}
                        </h3>
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
                                  ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800' 
                                  : theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200/80'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      item.isRequired ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                    }`}>
                                      {item.isRequired ? t.mandatory : t.optional}
                                    </span>
                                    <span className="font-bold text-xs">{item.name}</span>
                                  </div>
                                  {item.tip && (
                                    <p className="text-[11px] text-slate-500">{item.tip}</p>
                                  )}
                                </div>

                                {uploadState?.ready ? (
                                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-lg">
                                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                    <span>{t.readyToSend} ({uploadState.size})</span>
                                  </div>
                                ) : uploadState ? (
                                  <div className="flex items-center gap-2 text-teal-700 text-xs font-mono">
                                    <RefreshCw className="size-3.5 animate-spin" />
                                    <span>{uploadState.progress}%</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <button
                                      onClick={() => handleSimulateFileUpload(`${item.name}_كاميرا.jpg`)}
                                      title="التقاط فوري عبر كاميرا الجوال"
                                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-teal-50 hover:text-teal-800 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-[11px] border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer"
                                    >
                                      <Camera className="size-3.5 text-teal-600" />
                                      <span className="hidden sm:inline">الكاميرا</span>
                                    </button>
                                    <button
                                      onClick={() => handleSimulateFileUpload(`${item.name}_استديو.png`)}
                                      title="اختيار من ألبوم الصور / استديو الجوال"
                                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-teal-50 hover:text-teal-800 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-[11px] border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer"
                                    >
                                      <Image className="size-3.5 text-emerald-600" />
                                      <span>الاستديو</span>
                                    </button>
                                    <button
                                      onClick={() => handleSimulateFileUpload(`${item.name}.pdf`)}
                                      title="تصفح ملفات الجوال والـ PDF"
                                      className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 rounded-lg font-bold text-[11px] border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
                                    >
                                      <FolderUp className="size-3.5 text-teal-700" />
                                      <span>الملفات</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* WhatsApp Automatic Hook Notice for Clients */}
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
                          <div className="size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <MessageSquare className="size-4" />
                          </div>
                          <div>
                            <span className="font-bold">هل تفضل الإرسال عبر واتساب مباشرة؟</span>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                              يمكنك أيضاً الرد وإرفاق المستندات مباشرة في محادثة واتساب ديتيلز الرسمية، وسيتم تسجيلها فوراً بالمعاملة دون الحاجة لفتح هذا الرابط.
                            </p>
                          </div>
                        </div>
                        <span className="hidden md:inline-block text-[10px] font-mono bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-md font-bold whitespace-nowrap">
                          Webhook نشط ⚡
                        </span>
                      </div>

                      {/* Drop zone with mobile camera support notice */}
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleSimulateFileUpload('وثيقة_إضافية_مرفوعة.pdf'); }}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                          dragActive ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40' : theme === 'dark' ? 'border-slate-700 bg-slate-800/60' : 'border-slate-300 bg-white hover:border-teal-500'
                        }`}
                      >
                        <Upload className="size-8 text-teal-600 mx-auto mb-2" />
                        <div className="font-bold text-xs">{t.dragDropTitle}</div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {t.dragDropSubtitle}
                        </div>
                      </div>

                      {/* Final Submit Button */}
                      <div className="pt-2">
                        <button
                          onClick={handleFinalSubmit}
                          className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Send className="size-4" />
                          <span>إرسال المستندات وتأكيد الإيداع في مركز الوثائق</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer with Legal Margin Bar */}
            <div className={theme === 'dark' ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-slate-200'}>
              <LegalMarginBar 
                referenceNumber={data.reference}
                statusLabel="بوابة إلكترونية مشفرة"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3.5 bg-slate-800/95 border-t border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-400 shrink-0" />
            <span>
              يمكن للعميل فتح هذا الرابط المباشر من أي متصفح، وتنزيل أو رفع الوثائق مع التتبع الفوري في مركز الوثائق.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg cursor-pointer"
            >
              نسخ الرابط
            </button>
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
