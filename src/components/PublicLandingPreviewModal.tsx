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
  HardDrive
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
    files?: { name: string; size: string; pages: number; verified: boolean }[];
    requiredItems?: { name: string; isRequired: boolean; ext: string }[];
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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleSimulatedUpload = (name: string) => {
    if (!uploadedFiles.includes(name)) {
      setUploadedFiles(prev => [...prev, name]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div 
        dir="rtl"
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden text-right font-sans animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Control Bar for Staff */}
        <div className="p-3 bg-slate-800 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              معاينة حية لصفحة اللاندينج المخصصة للعميل (Live External Preview)
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded font-mono">
                {type === 'upload_request' ? 'صفحة رفع مستندات (Upload Portal)' : 'صفحة تنزيل آمن (Download Portal)'}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-700/80 p-0.5 rounded-lg border border-slate-600 text-xs">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="size-3.5" />
                <span>شاشة كاملة</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>جوال العميل</span>
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Viewport Container */}
        <div className="flex-1 bg-slate-950 p-4 md:p-6 overflow-y-auto flex items-center justify-center">
          <div 
            className={`transition-all duration-200 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col ${
              deviceView === 'desktop' ? 'w-full max-w-4xl min-h-[580px]' : 'w-[390px] h-[720px] rounded-[36px] border-[6px] border-slate-800'
            }`}
          >
            {/* Header / Brand Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 border-b-4 border-teal-600">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-md">
                    <FolderDown className="size-6" />
                  </div>
                  <div>
                    <h1 className="text-base font-extrabold tracking-tight">
                      ديتيلز للاستشارات الهندسية
                    </h1>
                    <div className="text-[11px] text-teal-300 font-medium">
                      Details Engineering Consulting · البوابة الخارجية المعتمدة
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <ShieldCheck className="size-4 text-teal-400" />
                  <span>اتصال آمن وموثق (Hetzner Storage Cloud)</span>
                </div>
              </div>

              {/* Sub-header context */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">المرجع:</span>
                  <span className="font-mono font-bold text-amber-300">{data.reference}</span>
                  <span className="text-slate-400 mr-2">المعاملة:</span>
                  <span className="font-mono bg-teal-900/60 text-teal-200 px-2 py-0.5 rounded border border-teal-700/60">
                    {data.transactionRef}
                  </span>
                </div>
                <div className="text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="size-3 text-amber-400" />
                  <span>الصلاحية حتى: {data.expiresAt}</span>
                </div>
              </div>
            </div>

            {/* Landing Body */}
            <div className="p-5 md:p-6 flex-1 overflow-y-auto space-y-5 bg-slate-50/50 text-xs">
              {/* Target Entity Welcome */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      جهة التخاطب المرخص لها
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1.5">
                      {data.targetEntity}
                    </h2>
                    <p className="text-slate-600 mt-1 leading-relaxed text-xs">
                      {data.description || 'طلب رسمي لتسليم واستقبال الوثائق المعتمدة وفق اشتراطات الكود الهندسي وأنظمة التراخيص المعتمدة.'}
                    </p>
                  </div>
                  <Lock className="size-5 text-slate-400 shrink-0 mt-1" />
                </div>
              </div>

              {/* MODE 1: FILE DOWNLOAD LANDING */}
              {type === 'file_download' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <FileCheck2 className="size-4 text-teal-700" />
                      المستندات الجاهزة للتنزيل الفوري
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>حد التنزيل: {data.maxDownloads || 5} مرات</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold">متبقي: {data.remainingDownloads || 4}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(data.files || [
                      { name: 'مخطط_السلامة_المعتمد_نهائي.pdf', size: '8.4 MB', pages: 12, verified: true },
                      { name: 'تقرير_الجسات_واختبار_التربة.pdf', size: '3.1 MB', pages: 6, verified: true },
                      { name: 'خطاب_الإحالة_الرسمي_للأمانة.pdf', size: '640 KB', pages: 2, verified: true }
                    ]).map((f, i) => (
                      <div 
                        key={i}
                        className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between hover:border-teal-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                            PDF
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{f.name}</div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                              <span>{f.size}</span>
                              <span>·</span>
                              <span>{f.pages} صفحات</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="size-3" /> تم فحص الفيروسات والبصمة
                              </span>
                            </div>
                          </div>
                        </div>

                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md font-bold text-xs shadow-xs cursor-pointer">
                          <Download className="size-3.5" />
                          <span>تنزيل الملف</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0 text-amber-700" />
                    <span>
                      ملاحظة أمنية: الملفات محمية بعلامة مائية موجهة باسم الجهة ولا يُكشف مسار الخادم الداخلي.
                    </span>
                  </div>
                </div>
              )}

              {/* MODE 2: UPLOAD REQUEST LANDING */}
              {type === 'upload_request' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Upload className="size-4 text-teal-700" />
                    المستندات المطلوب رفعها من قبلكم:
                  </h3>

                  <div className="space-y-2">
                    {(data.requiredItems || [
                      { name: 'صورة الصك الإلكتروني المحدث للموقع', isRequired: true, ext: 'PDF, PNG' },
                      { name: 'موافقة الجيران المعتمدة أو محضر الحدود', isRequired: true, ext: 'PDF' },
                      { name: 'شهادة تنسيق عداد الكهرباء الصادرة حديثاً', isRequired: false, ext: 'PDF, JPG' }
                    ]).map((item, i) => {
                      const isUploaded = uploadedFiles.includes(item.name);
                      return (
                        <div 
                          key={i}
                          className={`p-3.5 rounded-lg border transition-all ${
                            isUploaded ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                item.isRequired ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {item.isRequired ? 'إلزامي' : 'اختياري'}
                              </span>
                              <span className="font-bold text-slate-900">{item.name}</span>
                            </div>

                            {isUploaded ? (
                              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="size-4" /> تم الإرفاق
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSimulatedUpload(item.name)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs border border-slate-300 cursor-pointer"
                              >
                                تحديد الملف
                              </button>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            الصيغ المقبولة: {item.ext} · الحد الأقصى: 50MB
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Drop zone */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); handleSimulatedUpload('ملف_مرفوع_إضافي.pdf'); }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                      dragActive ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-white hover:border-teal-500'
                    }`}
                  >
                    <Upload className="size-8 text-teal-600 mx-auto mb-2" />
                    <div className="font-bold text-slate-800 text-xs">اسحب وأفلت الملفات هنا أو اضغط للاختيار</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      يدعم الرفع المباشر من الجوال والكاميرا أو أجهزة سطح المكتب
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Legal Margin */}
            <div className="bg-white border-t border-slate-200">
              <LegalMarginBar 
                referenceNumber={data.reference}
                statusLabel="بوابة خارجية موثقة"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom confirmation */}
        <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
          <span>
            هذه هي الواجهة الحقيقية التي سيشاهدها العميل عند فتح الرابط دون الحاجة لتسجيل دخول.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-md shadow-xs cursor-pointer"
          >
            إغلاق المعاينة والعودة للمركز
          </button>
        </div>
      </div>
    </div>
  );
};
