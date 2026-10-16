import React from 'react';
import { ShieldCheck, Barcode, CheckCircle2 } from 'lucide-react';

interface LegalMarginProps {
  referenceNumber: string;
  sha256?: string;
  creatorName?: string;
  auditorName?: string;
  timestamp?: string;
  statusLabel?: string;
}

export const LegalMarginBar: React.FC<LegalMarginProps> = ({
  referenceNumber,
  sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  creatorName = 'النظام المركزي / بوابة ديتيلز',
  auditorName = 'معتمد إلكترونياً (DLP Verified)',
  timestamp = '2026-10-16 04:30 Asia/Riyadh',
  statusLabel = 'وثيقة نظامية مسجلة'
}) => {
  return (
    <div className="legal-margin-bar border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 py-2 px-4 rounded-b-md flex flex-wrap items-center justify-between gap-3 font-mono select-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 font-sans text-slate-700 font-bold">
          <ShieldCheck className="size-3.5 text-teal-600" />
          <span>ديتيلز للاستشارات الهندسية</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1">
          <Barcode className="size-3.5 text-slate-700" />
          <span className="font-semibold text-slate-800">{referenceNumber}</span>
        </div>
        <span className="text-slate-300">|</span>
        <span>المنشئ: {creatorName}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-teal-700 font-medium">
          <CheckCircle2 className="size-3" />
          {auditorName}
        </span>
        <span className="text-slate-300">|</span>
        <span title={`SHA-256: ${sha256}`}>
          بصمة SHA-256: {sha256.slice(0, 12)}...{sha256.slice(-8)}
        </span>
        <span className="text-slate-300">|</span>
        <span>{timestamp}</span>
        <span className="text-slate-300">|</span>
        <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-sans font-medium">
          {statusLabel}
        </span>
      </div>
    </div>
  );
};
