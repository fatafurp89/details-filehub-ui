import React from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Lock, 
  Clock, 
  HardDrive, 
  FileStack, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import type { DocumentTemplate } from '@/lib/document-center-types';
import { sampleTemplates } from '@/lib/document-center-mock';

export const CenterSettingsView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-card rounded-md border border-border p-5 space-y-6 overflow-y-auto text-xs font-sans">
      {/* Overview warning */}
      <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-teal-900 font-semibold">
          <ShieldCheck className="size-4 text-teal-700" />
          <span>إعدادات وقنوات مركز إرسال واستقبال الوثائق — منصة ديتيلز</span>
        </div>
        <span className="text-[11px] bg-teal-200 text-teal-900 px-2 py-0.5 rounded font-mono font-bold">
          DLP & Storage Policies
        </span>
      </div>

      {/* Hetzner Storage Dedicated Folder & Source Policy */}
      <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-4.5 space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <HardDrive className="size-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                المجلد المخصص لمركز الإرسال والاستقبال على سحابة Hetzner Storage Box
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تخصيص مجلد جذري موحد لكافة المرفقات الواردة والمستندات الصادرة مع توجيه مصادر الروابط مباشرة لهيتنزر
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hetzner Node: Connected (10.0 TB)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">مجلد مركز الإرسال المعتمد (Outbound Storage)</span>
            <div className="font-mono text-indigo-900 font-bold text-xs select-all bg-slate-50 p-1.5 rounded border border-slate-200" dir="ltr">
              /details-storage/document-center/outbound/
            </div>
            <p className="text-[10px] text-slate-500">تخزين الحزم ومخططات DWG وتقارير الصادر المعتمدة</p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">مجلد مركز الاستقبال والوارد (Inbound Storage)</span>
            <div className="font-mono text-emerald-900 font-bold text-xs select-all bg-slate-50 p-1.5 rounded border border-slate-200" dir="ltr">
              /details-storage/document-center/inbound/
            </div>
            <p className="text-[10px] text-slate-500">استقبال مرفقات العملاء من اللاندينج ورسائل واتساب ديتيلز</p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">مصدر روابط التنزيل والتسليم (Source Origin)</span>
            <div className="font-mono text-teal-900 font-bold text-xs select-all bg-slate-50 p-1.5 rounded border border-slate-200" dir="ltr">
              Hetzner S3 / Storage Gateway Direct
            </div>
            <p className="text-[10px] text-slate-500">الروابط تُنشأ وتُسحب بياناتها مباشرة عبر مسارات هيتنزر الآمنة</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Core Limits */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
          <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
            <Clock className="size-4 text-teal-600" />
            المدد والحدود الافتراضية للروابط والملفات
          </h4>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>صلاحية روابط التنزيل الافتراضية:</span>
              <strong className="font-mono text-slate-900">7 أيام</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>حد التنزيل الافتراضي للرابط:</span>
              <strong className="font-mono text-slate-900">5 مرات</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>الحد الأقصى لحجم الملف الواحد:</span>
              <strong className="font-mono text-slate-900">100 ميجابايت</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>مدة الاحتفاظ بالملفات المؤقتة (Retention):</span>
              <strong className="font-mono text-slate-900">90 يوماً</strong>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>التذكير التلقائي للطلبات:</span>
              <strong className="font-mono text-slate-900">قبل 48 ساعة ويوم الانتهاء</strong>
            </div>
          </div>
        </div>

        {/* Channels disclosure */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
          <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
            <Sliders className="size-4 text-teal-600" />
            القنوات المعتمدة وسياسة عدم الازدواجية
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            * <strong>البريد الرسمي للمنظومة:</strong> يُدار بالكامل عبر منظومة البريد الرسمية. لا توجد أي إعدادات بريد موازية أو مزودات خارجية داخل هذه الشاشة.
          </p>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">قناة البريد الرسمي (Details Mail):</span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">تسليم رسمي مؤكد</span>
            </div>
            <div className="flex items-center justify-between text-[11px] p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">الروابط الآمنة (Opaque Links):</span>
              <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-bold">تتبع فتح وتنزيل</span>
            </div>
            <div className="flex items-center justify-between text-[11px] p-2 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">واتساب / تيليجرام:</span>
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">تسليم خارجي يدوي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileStack className="size-4 text-teal-600" />
            نماذج القوالب المحفوظة في النظام (31 قالباً معتمداً)
          </h4>
          <span className="text-[11px] text-slate-500">
            * لا يمكن حذف أي قالب مستخدم بالنظام حفاظاً على سلامة السجلات
          </span>
        </div>

        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 h-[34px]">
              <th className="px-3">اسم القالب</th>
              <th className="px-3">التصنيف</th>
              <th className="px-3">الوحدة المرتبطة</th>
              <th className="px-3">مرات الاستخدام</th>
              <th className="px-3">آخر تحديث</th>
              <th className="px-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {sampleTemplates.map((t) => (
              <tr key={t.id} className="h-[38px] hover:bg-slate-50">
                <td className="px-3 font-semibold text-slate-800">{t.title}</td>
                <td className="px-3 text-slate-600">{t.category}</td>
                <td className="px-3 text-slate-600">{t.relatedUnit}</td>
                <td className="px-3 font-mono font-bold text-teal-700">{t.usageCount}</td>
                <td className="px-3 font-mono text-slate-500">{t.lastUpdated}</td>
                <td className="px-3">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    نشط ومتاح
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
