import React from 'react';
import { 
  Send, 
  DownloadCloud, 
  Clock, 
  Link2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import type { CenterStatistics } from '@/lib/document-center-types';
import type { CenterTab } from './DocumentCenterNav';

interface CenterMetricsProps {
  stats: CenterStatistics;
  onNavigateTab: (tab: CenterTab) => void;
}

export const CenterMetricsCards: React.FC<CenterMetricsProps> = ({
  stats,
  onNavigateTab
}) => {
  const cards = [
    {
      title: 'إجمالي الصادر',
      value: stats.totalOutbound,
      unit: 'معاملة / حزمة',
      icon: Send,
      tab: 'outbound' as CenterTab,
      bg: 'bg-teal-50/70',
      text: 'text-teal-900',
      iconColor: 'text-teal-600',
      border: 'border-teal-200/60'
    },
    {
      title: 'إجمالي المستلم (الوارد)',
      value: stats.totalInbound,
      unit: 'وثيقة رسمية',
      icon: DownloadCloud,
      tab: 'inbox' as CenterTab,
      bg: 'bg-sky-50/70',
      text: 'text-sky-900',
      iconColor: 'text-sky-600',
      border: 'border-sky-200/60'
    },
    {
      title: 'طلبات نشطة بانتظار الرد',
      value: stats.activeRequests,
      unit: 'طلب خارجي',
      icon: Clock,
      tab: 'requests' as CenterTab,
      bg: 'bg-amber-50/70',
      text: 'text-amber-900',
      iconColor: 'text-amber-600',
      border: 'border-amber-200/60'
    },
    {
      title: 'روابط نشطة وموقوتة',
      value: stats.activeLinks,
      unit: 'رابط آمن',
      icon: Link2,
      tab: 'links' as CenterTab,
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-900',
      iconColor: 'text-indigo-600',
      border: 'border-indigo-200/60'
    },
    {
      title: 'ملفات للفرز بالذكاء',
      value: stats.filesForSorting,
      unit: 'تحتاج اعتماد بشري',
      icon: Sparkles,
      tab: 'sorting' as CenterTab,
      bg: 'bg-rose-50/70',
      text: 'text-rose-900',
      iconColor: 'text-rose-600',
      border: 'border-rose-200/60'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-slate-50/60 border-b border-border">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            onClick={() => onNavigateTab(card.tab)}
            className={`cursor-pointer rounded-lg border ${card.border} ${card.bg} p-3.5 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-2">
              <span>{card.title}</span>
              <Icon className={`size-4 ${card.iconColor}`} />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className={`text-2xl font-bold font-mono ${card.text}`}>
                {card.value.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 font-sans">
                {card.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
