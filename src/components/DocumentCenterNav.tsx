import React from 'react';
import { 
  Inbox, 
  Send, 
  Package, 
  Link2, 
  Sparkles, 
  FileStack, 
  History, 
  BarChart3, 
  Settings, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import type { CenterStatistics } from '@/lib/document-center-types';

export type CenterTab = 
  | 'overview'
  | 'inbox' 
  | 'outbound' 
  | 'packages' 
  | 'requests' 
  | 'links' 
  | 'sorting' 
  | 'handoff'
  | 'templates' 
  | 'history' 
  | 'performance' 
  | 'settings';

interface DocumentCenterNavProps {
  activeTab: CenterTab;
  onSelectTab: (tab: CenterTab) => void;
  stats: CenterStatistics;
}

export const DocumentCenterNav: React.FC<DocumentCenterNavProps> = ({
  activeTab,
  onSelectTab,
  stats
}) => {
  const tabs = [
    { id: 'overview' as CenterTab, label: 'لوحة المركز', icon: Layers, count: undefined },
    { id: 'inbox' as CenterTab, label: 'صندوق الوارد', icon: Inbox, count: stats.totalInbound },
    { id: 'outbound' as CenterTab, label: 'الصادر', icon: Send, count: stats.totalOutbound },
    { id: 'packages' as CenterTab, label: 'الحزم الصادرة', icon: Package, count: 2 },
    { id: 'requests' as CenterTab, label: 'الطلبات النشطة', icon: Link2, count: stats.activeRequests },
    { id: 'links' as CenterTab, label: 'الروابط النشطة', icon: ExternalLink, count: stats.activeLinks },
    { id: 'sorting' as CenterTab, label: 'ملفات للفرز بالذكاء', icon: Sparkles, count: stats.filesForSorting, highlight: true },
    { id: 'handoff' as CenterTab, label: 'التسليم الخارجي الرسمي', icon: Shield, count: 2 },
    { id: 'templates' as CenterTab, label: 'القوالب المحفوظة', icon: FileStack, count: 31 },
    { id: 'history' as CenterTab, label: 'سجل العمليات', icon: History, count: stats.operationsThisMonth },
    { id: 'performance' as CenterTab, label: 'تقارير الأداء', icon: BarChart3, count: undefined },
    { id: 'settings' as CenterTab, label: 'إعدادات المركز', icon: Settings, count: undefined },
  ];

  return (
    <div className="w-full bg-card border-b border-border sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-1 overflow-x-auto py-1 px-4 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
              }`}
            >
              <Icon className={`size-4 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    tab.highlight && !isActive
                      ? 'bg-amber-100 text-amber-800 font-bold animate-pulse'
                      : isActive
                      ? 'bg-teal-700 text-white font-bold'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
