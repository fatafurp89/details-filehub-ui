import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { 
  FolderDown, 
  ArrowUpRight, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Send, 
  Inbox, 
  Layers, 
  Check, 
  X,
  FileCheck2,
  LockKeyhole
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LegalMarginBar } from '@/components/LegalMarginBar';
import { DocumentCenterNav, type CenterTab } from '@/components/DocumentCenterNav';
import { CenterMetricsCards } from '@/components/CenterMetricsCards';
import { OperationsTable } from '@/components/OperationsTable';
import { AiSortingView } from '@/components/AiSortingView';
import { OutboundPackagesView } from '@/components/OutboundPackagesView';
import { OfficialHandoffView } from '@/components/OfficialHandoffView';
import { SendExternalDialog } from '@/components/SendExternalDialog';
import { ExternalLinkModal } from '@/components/ExternalLinkModal';
import { CenterSettingsView } from '@/components/CenterSettingsView';
import { PublicLandingPreviewModal } from '@/components/PublicLandingPreviewModal';
import { QuickSendModal } from '@/components/QuickSendModal';
import { QuickRequestModal } from '@/components/QuickRequestModal';

import { 
  initialStats, 
  sampleOperations, 
  sampleSortingFiles, 
  samplePackages, 
  sampleActiveRequests, 
  sampleHandoffs 
} from '@/lib/document-center-mock';
import type { 
  OperationRecord, 
  OutboundPackage, 
  DeliveryMethod, 
  CenterStatistics 
} from '@/lib/document-center-types';
import { api, type EmployeeSession } from '@/lib/attachments-api';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'مركز إرسال واستقبال الوثائق | ديتيلز للاستشارات الهندسية' },
      { name: 'description', content: 'المركز الموحد لإرسال واستقبال الوثائق والحزم الصادرة وفرز الملفات بالذكاء الاصطناعي — بوابة ديتيلز' }
    ]
  }),
  component: DocumentCenterMainPage
});

function DocumentCenterMainPage() {
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [booting, setBooting] = useState(false);
  const [activeTab, setActiveTab] = useState<CenterTab>('overview');
  const [stats, setStats] = useState<CenterStatistics>(initialStats);
  const [operations, setOperations] = useState<OperationRecord[]>(sampleOperations);
  const [packages, setPackages] = useState<OutboundPackage[]>(samplePackages);
  
  // Modals state
  const [selectedOpForLink, setSelectedOpForLink] = useState<OperationRecord | null>(null);
  const [selectedPkgForSend, setSelectedPkgForSend] = useState<OutboundPackage | null>(null);
  const [notice, setNotice] = useState<string>('');
  
  // Quick Send & Request Modals
  const [quickSendOpen, setQuickSendOpen] = useState(false);
  const [quickRequestOpen, setQuickRequestOpen] = useState(false);
  
  // Public landing preview state
  const [landingPreview, setLandingPreview] = useState<{
    isOpen: boolean;
    type: 'upload_request' | 'file_download';
    data: any;
  }>({
    isOpen: false,
    type: 'file_download',
    data: {}
  });

  useEffect(() => {
    (window as any).__openLandingPreview = (type: 'upload_request' | 'file_download', data: any) => {
      setLandingPreview({
        isOpen: true,
        type,
        data
      });
    };
  }, []);

  useEffect(() => {
    async function loadSession() {
      try {
        const me = await api<EmployeeSession>('/me');
        setSession(me);
      } catch (err) {
        // Fallback demo employee session if running offline/standalone
        setSession({
          employee: {
            employee_no: 'EMP-104',
            name: 'م. راكان التميمي',
            email: 'rakan@details-consults.sa',
            admin: true
          },
          perms: [
            'files.requests.view_own',
            'files.requests.view_all',
            'files.requests.create',
            'files.requests.close',
            'files.shares.create',
            'files.shares.view_all',
            'files.downloads.view_log',
            'files.settings'
          ],
          limits: {
            max_file_bytes: 104857600,
            max_request_bytes: 524288000,
            max_files: 20,
            request_days: 7,
            share_days: 7
          },
          portal: 'https://details-wms.cloud'
        });
      }
    }
    loadSession();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleConfirmSendPackage = (method: DeliveryMethod, notes: string) => {
    if (!selectedPkgForSend) return;
    
    // Add new operation record to table
    const newOp: OperationRecord = {
      id: `OP-${Date.now()}`,
      reference: selectedPkgForSend.pkgReference,
      direction: 'outbound',
      sourceOrDestination: selectedPkgForSend.destination,
      documentTitle: selectedPkgForSend.contentSummary,
      linkedEntity: {
        type: 'transaction',
        referenceNumber: selectedPkgForSend.linkedTransactionRef,
        title: selectedPkgForSend.destination
      },
      method: method,
      status: method === 'link' || method === 'mail' ? 'delivered' : 'handoff_manual',
      statusLabel: method === 'link' ? 'تم التسليم المؤكد' : 'تسليم خارجي يدوي',
      timestamp: '2026-10-16 04:35',
      ownerName: session?.employee.name || 'م. راكان التميمي',
      sensitivity: 'restricted',
      linkToken: 's_token_' + Math.random().toString(36).substring(7)
    };

    setOperations(prev => [newOp, ...prev]);
    setSelectedPkgForSend(null);
    setNotice(`تم إرسال الحزمة ${selectedPkgForSend.pkgReference} بنجاح وتسجيلها بالسجل.`);
  };

  const handleDepositToArchive = () => {
    setNotice('تم اعتماد الحقول وإيداع الوثيقة بالأرشيف وإنشاء سجل إيداع بكود مميز.');
    setActiveTab('inbox');
  };

  return (
    <div dir="rtl" className="h-screen flex flex-col bg-slate-100 font-sans text-slate-800 select-none overflow-hidden">
      {/* 1. Header with Company Branding & Session Profile */}
      <header className="bg-white border-b border-border shadow-xs shrink-0">
        <div className="mx-auto flex items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <FolderDown className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>ديتيلز للاستشارات الهندسية</span>
                <span className="text-[11px] font-normal text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.2 rounded-full">
                  مركز إرسال واستقبال الوثائق
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                details-wms.cloud · بوابة الدخول الموحد (SSO Protected)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {session && (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-left">
                  <div className="font-bold text-slate-900">{session.employee.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">الرقم: {session.employee.employee_no}</div>
                </div>
                <div className="size-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {session.employee.name.slice(0, 1)}
                </div>
              </div>
            )}
            <a 
              href={session?.portal || 'https://details-wms.cloud'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>العودة للبوابة</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. Unified Navigation Tabs with Live Counts */}
      <DocumentCenterNav 
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        stats={stats}
      />

      {/* 3. High-level Summary Indicators (Always Clickable) */}
      <CenterMetricsCards 
        stats={stats}
        onNavigateTab={setActiveTab}
      />

      {/* 4. Main Tab Content (No page scrolling - scrolling inside tables only) */}
      <main className="flex-1 p-3.5 overflow-hidden flex flex-col">
        {activeTab === 'overview' && (
          <OperationsTable 
            operations={operations}
            onViewOperation={(op) => {
              if (op.linkToken) setSelectedOpForLink(op);
              else setNotice(`عرض تفاصيل العملية: ${op.reference}`);
            }}
            onOpenLinkModal={(op) => setSelectedOpForLink(op)}
            onQuickSend={() => setQuickSendOpen(true)}
            onQuickRequest={() => setQuickRequestOpen(true)}
          />
        )}

        {activeTab === 'inbox' && (
          <OperationsTable 
            operations={operations.filter(x => x.direction === 'inbound')}
            onViewOperation={(op) => setSelectedOpForLink(op)}
            onOpenLinkModal={(op) => setSelectedOpForLink(op)}
            onQuickSend={() => setQuickSendOpen(true)}
            onQuickRequest={() => setQuickRequestOpen(true)}
          />
        )}

        {activeTab === 'outbound' && (
          <OperationsTable 
            operations={operations.filter(x => x.direction === 'outbound')}
            onViewOperation={(op) => setSelectedOpForLink(op)}
            onOpenLinkModal={(op) => setSelectedOpForLink(op)}
            onQuickSend={() => setQuickSendOpen(true)}
            onQuickRequest={() => setQuickRequestOpen(true)}
          />
        )}

        {activeTab === 'sorting' && (
          <AiSortingView 
            fields={sampleSortingFiles}
            onConfirmField={(id) => setNotice(`تم تأكيد الحقل ${id}`)}
            onDepositToArchive={handleDepositToArchive}
          />
        )}

        {activeTab === 'packages' && (
          <OutboundPackagesView 
            packages={packages}
            onCreatePackage={() => setNotice('تم فتح معالج تجهيز حزمة صادرة جديدة')}
            onSendPackage={(pkg) => setSelectedPkgForSend(pkg)}
          />
        )}

        {activeTab === 'handoff' && (
          <OfficialHandoffView 
            handoffs={sampleHandoffs}
            onUploadEvidence={(id) => setNotice(`تم فتح نافذة رفع إثبات المهمة ${id}`)}
          />
        )}

        {activeTab === 'requests' && (
          <OperationsTable 
            operations={operations.filter(x => x.direction === 'request')}
            onViewOperation={(op) => setSelectedOpForLink(op)}
            onOpenLinkModal={(op) => setSelectedOpForLink(op)}
          />
        )}

        {activeTab === 'links' && (
          <OperationsTable 
            operations={operations.filter(x => !!x.linkToken)}
            onViewOperation={(op) => setSelectedOpForLink(op)}
            onOpenLinkModal={(op) => setSelectedOpForLink(op)}
          />
        )}

        {activeTab === 'settings' && (
          <CenterSettingsView />
        )}

        {activeTab === 'templates' && (
          <CenterSettingsView />
        )}

        {activeTab === 'history' && (
          <OperationsTable 
            operations={operations}
            onViewOperation={(op) => setSelectedOpForLink(op)}
          />
        )}

        {activeTab === 'performance' && (
          <CenterSettingsView />
        )}
      </main>

      {/* 5. Persistent Legal Margin Bar at bottom of screen */}
      <footer className="shrink-0 bg-white border-t border-border">
        <LegalMarginBar 
          referenceNumber="SYS-DC-2026-LIVE"
          statusLabel="مركز إرسال واستقبال الوثائق المعتمد"
        />
      </footer>

      {/* Modals & Dialogs */}
      {selectedPkgForSend && (
        <SendExternalDialog 
          pkg={selectedPkgForSend}
          isOpen={!!selectedPkgForSend}
          onClose={() => setSelectedPkgForSend(null)}
          onConfirmSend={handleConfirmSendPackage}
        />
      )}

      {selectedOpForLink && (
        <ExternalLinkModal 
          operation={selectedOpForLink}
          isOpen={!!selectedOpForLink}
          onClose={() => setSelectedOpForLink(null)}
          onRevokeLink={(id) => {
            setNotice(`تم إلغاء الرابط للعملية ${id} فورياً ومركزياً.`);
            setSelectedOpForLink(null);
          }}
          onExtendLink={(id) => {
            setNotice(`تم تمديد صلاحية الرابط للعملية ${id} لمدة 7 أيام.`);
            setSelectedOpForLink(null);
          }}
        />
      )}

      {/* Quick Send Modal */}
      {quickSendOpen && (
        <QuickSendModal 
          isOpen={quickSendOpen}
          onClose={() => setQuickSendOpen(false)}
          session={session}
          onPreviewRequested={(previewData) => {
            setLandingPreview({
              isOpen: true,
              type: 'file_download',
              data: previewData
            });
          }}
          onLinkCreated={(item) => {
            const newOp: OperationRecord = {
              id: `OP-${Date.now()}`,
              reference: item.reference,
              direction: 'outbound',
              sourceOrDestination: item.targetEntity,
              documentTitle: item.title,
              linkedEntity: {
                type: 'transaction',
                referenceNumber: 'TRX-2026-HETZNER',
                title: item.title
              },
              method: 'link',
              status: 'delivered',
              statusLabel: 'تم توليد الرابط وتتبعه',
              timestamp: '2026-10-16 17:15',
              ownerName: session?.employee.name || 'م. راكان التميمي',
              sensitivity: 'restricted',
              linkToken: item.reference
            };
            setOperations(prev => [newOp, ...prev]);
            setQuickSendOpen(false);
            setNotice(`تم إنشاء الرابط بنجاح: ${item.url}`);
          }}
        />
      )}

      {/* Quick Request Modal */}
      {quickRequestOpen && (
        <QuickRequestModal 
          isOpen={quickRequestOpen}
          onClose={() => setQuickRequestOpen(false)}
          session={session}
          onPreviewRequested={(previewData) => {
            setLandingPreview({
              isOpen: true,
              type: 'upload_request',
              data: previewData
            });
          }}
          onRequestCreated={(item) => {
            const newOp: OperationRecord = {
              id: `OP-${Date.now()}`,
              reference: item.reference,
              direction: 'request',
              sourceOrDestination: item.targetEntity,
              documentTitle: item.title,
              linkedEntity: {
                type: 'transaction',
                referenceNumber: 'TRX-REQ-2026',
                title: item.title
              },
              method: 'link',
              status: 'awaiting_reply',
              statusLabel: 'بانتظار رفع العميل',
              timestamp: '2026-10-16 17:15',
              ownerName: session?.employee.name || 'م. راكان التميمي',
              sensitivity: 'restricted',
              linkToken: item.reference
            };
            setOperations(prev => [newOp, ...prev]);
            setQuickRequestOpen(false);
            setNotice(`تم إنشاء رابط طلب الوثائق بنجاح: ${item.url}`);
          }}
        />
      )}

      {/* Public Landing Preview Modal */}
      {landingPreview.isOpen && (
        <PublicLandingPreviewModal 
          isOpen={landingPreview.isOpen}
          onClose={() => setLandingPreview(prev => ({ ...prev, isOpen: false }))}
          type={landingPreview.type}
          data={landingPreview.data}
        />
      )}

      {/* Toast Notification */}
      {notice && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="size-4 text-teal-400" />
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="p-0.5 hover:bg-slate-800 rounded">
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
