import React, { useState } from 'react';
import { 
  Package, 
  FileText, 
  ArrowUpRight, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  CheckCircle,
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';
import type { OutboundPackage, PackageItem } from '@/lib/document-center-types';

interface OutboundPackagesViewProps {
  packages: OutboundPackage[];
  onCreatePackage: () => void;
  onSendPackage: (pkg: OutboundPackage) => void;
}

export const OutboundPackagesView: React.FC<OutboundPackagesViewProps> = ({
  packages,
  onCreatePackage,
  onSendPackage
}) => {
  const [selectedPkg, setSelectedPkg] = useState<OutboundPackage | null>(packages[0] || null);

  return (
    <div className="flex flex-col h-full bg-card rounded-md border border-border overflow-hidden">
      {/* Top action bar */}
      <div className="p-3.5 bg-slate-50 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package className="size-5 text-teal-700" />
          <h2 className="text-sm font-bold text-slate-900">إدارة الحزم الصادرة والربط مع وحدات النظام</h2>
        </div>
        <button
          onClick={onCreatePackage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="size-4" />
          تجهيز حزمة صادرة جديدة
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Packages List (Left in RTL, Right col) */}
        <div className="lg:col-span-5 border-l border-border overflow-y-auto p-3 space-y-2.5 bg-slate-50/40">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            الحزم الجاهزة والمسودات ({packages.length})
          </span>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedPkg?.id === pkg.id
                  ? 'border-teal-500 bg-teal-50/60 shadow-xs ring-1 ring-teal-400/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900">{pkg.pkgReference}</span>
                <span className="text-[11px] font-mono text-slate-500">{pkg.createdAt}</span>
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
                {pkg.destination}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {pkg.contentSummary}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-600 font-mono">
                  {pkg.filesCount} ملفات ({pkg.pagesCount} صفحة)
                </span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  pkg.status === 'ready' 
                    ? 'bg-emerald-100 text-emerald-800 font-bold' 
                    : 'bg-amber-100 text-amber-800 font-semibold'
                }`}>
                  {pkg.status === 'ready' ? 'جاهزة للإرسال' : 'بانتظار توقيع'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Package Details & Item Reordering */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-white">
          {selectedPkg ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-border bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono text-slate-900">{selectedPkg.pkgReference}</span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                      مرتبط بالمعاملة: {selectedPkg.linkedTransactionRef}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    الجهة المقصودة: <strong className="text-slate-800">{selectedPkg.destination}</strong>
                  </div>
                </div>

                <button
                  onClick={() => onSendPackage(selectedPkg)}
                  disabled={selectedPkg.status === 'draft'}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white rounded-md text-xs font-bold shadow-xs cursor-pointer"
                >
                  <ArrowUpRight className="size-4" />
                  بدء الإرسال الخارجي المعتمد
                </button>
              </div>

              {/* Items List (Zero download & re-upload rule) */}
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-teal-600" />
                    المرفقات المختارة من وحدات النظام (مربوطة بالمرجع لا بالنسخ)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    * حفظ الترتيب الفعلي في ملف الفهرس
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
                  {selectedPkg.items.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="size-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-[11px]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-mono">
                              {item.originalModule} · {item.moduleReference}
                            </span>
                            <span>{item.pagesCount} صفحات</span>
                            <span className="font-mono">SHA-256: {item.sha256}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                          <CheckCircle className="size-3" /> تم التحقق
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              اختر حزمة لعرض تفاصيلها ومحتوياتها
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
