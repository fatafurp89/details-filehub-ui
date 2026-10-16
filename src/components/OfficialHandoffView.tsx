import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Printer, 
  Upload, 
  FileText, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import type { OfficialHandoff } from '@/lib/document-center-types';
import { LegalMarginBar } from './LegalMarginBar';

interface OfficialHandoffViewProps {
  handoffs: OfficialHandoff[];
  onUploadEvidence: (handoffId: string) => void;
}

export const OfficialHandoffView: React.FC<OfficialHandoffViewProps> = ({
  handoffs,
  onUploadEvidence
}) => {
  const [items, setItems] = useState<OfficialHandoff[]>(handoffs);
  const [selectedTask, setSelectedTask] = useState<OfficialHandoff | null>(handoffs[0] || null);

  const toggleChecklist = (taskId: string, checkId: string) => {
    setItems(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          checklist: t.checklist.map(c => c.id === checkId ? { ...c, done: !c.done } : c)
        };
      }
      return t;
    }));

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        checklist: prev.checklist.map(c => c.id === checkId ? { ...c, done: !c.done } : c)
      } : null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-md border border-border overflow-hidden">
      {/* Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              التسليم الخارجي الرسمي (Official External Action Handoff)
              <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                المنصات الرسمية الحكومية
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              لا يُعتبر أي إجراء مكتملاً بمجرد اعتماده داخلياً. تنتهي المعاملة فقط بإتمام التسليم على المنصة الخارجية ورفع الإثبات.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-300">
            قاعدة: لا كلمات مرور ولا بيانات دخول مسجلة
          </span>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Tasks list */}
        <div className="lg:col-span-5 border-l border-border overflow-y-auto p-3 space-y-2.5 bg-slate-50/40">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            مهام التسليم على البوابات الرسمية ({items.length})
          </span>
          {items.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedTask?.id === task.id
                  ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-400/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900">{task.reference}</span>
                <span className="text-[11px] font-mono text-slate-500">الموعد: {task.deadline}</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                {task.platformName}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                {task.actionRequired}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">
                  المسؤول: <strong>{task.assignedOfficer}</strong>
                </span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  task.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-800 font-bold' 
                    : 'bg-amber-100 text-amber-800 font-semibold'
                }`}>
                  {task.status === 'completed' ? 'تم الإيداع والإثبات' : 'بانتظار التنفيذ'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Task details & Official A4 Report View */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-white">
          {selectedTask ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-border bg-slate-50/40 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedTask.actionRequired}</h4>
                  <p className="text-xs text-slate-500">
                    الجهة: {selectedTask.entityName} · المنصة: {selectedTask.platformName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    طباعة تقرير الإجراء A4
                  </button>
                  <button
                    onClick={() => onUploadEvidence(selectedTask.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Upload className="size-3.5" />
                    رفع إثبات التنفيذ
                  </button>
                </div>
              </div>

              {/* Checklist */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
                <div>
                  <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-teal-600" />
                    قائمة التحقق الإلزامية قبل اعتماد الإجراء:
                  </h5>
                  <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    {selectedTask.checklist.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => toggleChecklist(selectedTask.id, c.id)}
                        className="flex items-center gap-2 text-slate-800 cursor-pointer select-none"
                      >
                        {c.done ? (
                          <CheckSquare className="size-4 text-teal-600 shrink-0" />
                        ) : (
                          <Square className="size-4 text-slate-400 shrink-0" />
                        )}
                        <span className={c.done ? 'line-through text-slate-400' : 'font-medium'}>
                          {c.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Card */}
                {selectedTask.evidenceFile ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-emerald-700" />
                      <div>
                        <p className="font-bold text-emerald-900">إثبات التنفيذ مرفق ومعتمد:</p>
                        <p className="text-[11px] text-emerald-700 font-mono">
                          {selectedTask.evidenceFile} · المرجع المستخرج: {selectedTask.evidenceExtractedRef}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                      مكتمل
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600">
                    <AlertCircle className="size-4 text-amber-600" />
                    <span>بانتظار رفع إيصال المنصة لتأكيد اكتمال التسليم الرسمي.</span>
                  </div>
                )}
              </div>

              {/* Legal Margin Bar on bottom */}
              <LegalMarginBar 
                referenceNumber={selectedTask.reference}
                statusLabel="مهمة تسليم خارجي رسمية"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              اختر مهمة تسليم للاطلاع على قائمة التحقق والتقرير
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
