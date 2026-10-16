import type { 
  CenterStatistics, 
  OperationRecord, 
  ExtractedField, 
  OutboundPackage, 
  ActiveRequest, 
  OfficialHandoff, 
  DocumentTemplate 
} from './document-center-types';

export const initialStats: CenterStatistics = {
  totalOutbound: 482,
  totalInbound: 664,
  activeRequests: 23,
  activeLinks: 12,
  filesForSorting: 17,
  operationsThisMonth: 1146,
  avgResponseDays: 3.4,
  onTimeResponseRate: 87,
  delayedRequests: 3,
  consumedLinks: 46
};

export const sampleOperations: OperationRecord[] = [
  {
    id: 'OP-2026-0891',
    reference: 'REQ-2026-0312',
    direction: 'inbound',
    sourceOrDestination: 'أمانة منطقة الرياض - إدارة الرخص',
    documentTitle: 'اعتماد المخطط التنفيذي وملاحظات الدفاع المدني',
    linkedEntity: {
      type: 'transaction',
      referenceNumber: 'TRX-8821',
      title: 'مشروع مجمع الياسمين التجاري'
    },
    method: 'mail',
    status: 'deposited',
    statusLabel: 'مُودَع بالأرشيف',
    timestamp: '2026-10-16 03:22',
    ownerName: 'م. راكان التميمي',
    sensitivity: 'internal',
    confidence: 0.98
  },
  {
    id: 'OP-2026-0890',
    reference: 'PKG-2026-0145',
    direction: 'outbound',
    sourceOrDestination: 'شركة تطوير المجمعات السكنية',
    documentTitle: 'حزمة عقود وتقارير الجسات المساحية المعتمدة',
    linkedEntity: {
      type: 'transaction',
      referenceNumber: 'TRX-8790',
      title: 'أبراج النرجس'
    },
    method: 'link',
    status: 'delivered',
    statusLabel: 'تم التسليم المؤكد',
    timestamp: '2026-10-15 14:10',
    ownerName: 'سارة الدوسري',
    sensitivity: 'restricted',
    hasWatermark: true,
    linkToken: 's_9f81a7'
  },
  {
    id: 'OP-2026-0889',
    reference: 'HND-2026-0044',
    direction: 'handoff',
    sourceOrDestination: 'بوابة بلدي - الأمانة',
    documentTitle: 'طلب رفع رخصة بناء وتسليم المخطط الإنشائي',
    linkedEntity: {
      type: 'transaction',
      referenceNumber: 'TRX-8765',
      title: 'فيلا حي حطين 14'
    },
    method: 'upload',
    status: 'handoff_manual',
    statusLabel: 'تسليم خارجي يدوي',
    timestamp: '2026-10-15 11:45',
    ownerName: 'م. فهد القحطاني',
    sensitivity: 'internal'
  },
  {
    id: 'OP-2026-0888',
    reference: 'REQ-2026-0310',
    direction: 'request',
    sourceOrDestination: 'شركة الاستثمارات الحديثة (عميل)',
    documentTitle: 'طلب صك إلكتروني محدث وشهادة تنسيق الكهرباء',
    linkedEntity: {
      type: 'archive',
      referenceNumber: 'ARC-4102',
      title: 'أرشيف صكوك الملاك - ملقا'
    },
    method: 'link',
    status: 'awaiting_reply',
    statusLabel: 'بانتظار رد العميل',
    timestamp: '2026-10-15 09:30',
    ownerName: 'خالد المطيري',
    sensitivity: 'restricted',
    linkToken: 'r_4c99e1'
  },
  {
    id: 'OP-2026-0887',
    reference: 'INB-2026-0511',
    direction: 'inbound',
    sourceOrDestination: 'رابط خارجي - رافع غير معرف',
    documentTitle: 'مسح ضوئي لتقرير مساحي بدون ترويسة',
    linkedEntity: {
      type: 'plot',
      referenceNumber: 'PLOT-771',
      title: 'قطعة 771 حي العارض'
    },
    method: 'upload',
    status: 'for_analysis',
    statusLabel: 'ملفات للفرز بالذكاء',
    timestamp: '2026-10-14 16:50',
    ownerName: 'النظام الآلي',
    sensitivity: 'public',
    confidence: 0.62
  },
  {
    id: 'OP-2026-0886',
    reference: 'PKG-2026-0144',
    direction: 'outbound',
    sourceOrDestination: 'مكتب المسح الهندسي المشترك',
    documentTitle: 'خطاب رسمي بتحديث إحداثيات الموقع',
    linkedEntity: {
      type: 'transaction',
      referenceNumber: 'TRX-8650',
      title: 'مشروع العليا بلازا'
    },
    method: 'telegram',
    status: 'handoff_manual',
    statusLabel: 'تسليم خارجي يدوي (تيليجرام)',
    timestamp: '2026-10-14 13:00',
    ownerName: 'م. راكان التميمي',
    sensitivity: 'public'
  }
];

export const sampleSortingFiles: ExtractedField[] = [
  {
    id: 'FLD-1',
    fieldName: 'نوع الوثيقة',
    extractedValue: 'تقرير مساحي ورفع كروكي تنفيذي',
    confidence: 0.94,
    pageNumber: 1,
    suggestedLink: 'أرشيف التقارير المساحية',
    decision: 'accepted',
    isMasked: false
  },
  {
    id: 'FLD-2',
    fieldName: 'رقم المعاملة / الرخصة',
    extractedValue: '1446/9821/بلدي',
    confidence: 0.89,
    pageNumber: 1,
    suggestedLink: 'معاملة TRX-8821',
    decision: 'needs_confirmation',
    isMasked: false
  },
  {
    id: 'FLD-3',
    fieldName: 'رقم القطعة والحي',
    extractedValue: 'قطعة 412 - مخطط 2291 - حي الياسمين',
    confidence: 0.96,
    pageNumber: 2,
    suggestedLink: 'أرض الياسمين - بلوك 5',
    decision: 'accepted',
    isMasked: false
  },
  {
    id: 'FLD-4',
    fieldName: 'اسم المالك المستخرج',
    extractedValue: 'مؤسسة ******** للتجارة',
    confidence: 0.91,
    pageNumber: 1,
    suggestedLink: 'ملف العميل CLI-109',
    decision: 'masked',
    isMasked: true
  },
  {
    id: 'FLD-5',
    fieldName: 'رقم الصك الإلكتروني',
    extractedValue: '310129009841',
    confidence: 0.85,
    pageNumber: 3,
    suggestedLink: 'مرشح: صك أرض النرجس أم الياسمين',
    decision: 'candidate',
    isMasked: false
  }
];

export const samplePackages: OutboundPackage[] = [
  {
    id: 'PKG-1',
    pkgReference: 'PKG-2026-0145',
    destination: 'شركة تطوير المجمعات السكنية',
    contentSummary: 'تقرير تربة + مخطط عام + اعتماد مساحي',
    filesCount: 4,
    pagesCount: 18,
    createdByName: 'سارة الدوسري',
    createdAt: '2026-10-15',
    requiredReplyBefore: '2026-10-25',
    status: 'ready',
    linkedTransactionRef: 'TRX-8790',
    items: [
      {
        id: 'ITM-1',
        title: 'خطاب الإرسال الرسمي',
        originalModule: 'العقود والخطابات',
        moduleReference: 'DOC-9011',
        sha256: '9f83a...3b',
        order: 1,
        pagesCount: 2,
        sizeBytes: 420000
      },
      {
        id: 'ITM-2',
        title: 'تقرير الجسات واختبار التربة',
        originalModule: 'التقارير الفنية',
        moduleReference: 'REP-4402',
        sha256: '88c12...f1',
        order: 2,
        pagesCount: 10,
        sizeBytes: 3100000
      },
      {
        id: 'ITM-3',
        title: 'كروكي الرفع المساحي المعتمد',
        originalModule: 'التقارير المساحية',
        moduleReference: 'SURV-1109',
        sha256: 'fa301...99',
        order: 3,
        pagesCount: 6,
        sizeBytes: 5400000
      }
    ]
  },
  {
    id: 'PKG-2',
    pkgReference: 'PKG-2026-0146',
    destination: 'أمانة منطقة الرياض - الإدارة العامة للتخطيط',
    contentSummary: 'مخطط السلامة والدفاع المدني لمشروع مجمع تجاري',
    filesCount: 2,
    pagesCount: 8,
    createdByName: 'م. راكان التميمي',
    createdAt: '2026-10-16',
    requiredReplyBefore: '2026-10-30',
    status: 'pending_signature',
    linkedTransactionRef: 'TRX-8821',
    items: [
      {
        id: 'ITM-4',
        title: 'مخطط شبكة الإطفاء ومخارج الطوارئ',
        originalModule: 'مركز المستندات',
        moduleReference: 'DWG-301',
        sha256: '4419e...ab',
        order: 1,
        pagesCount: 5,
        sizeBytes: 8200000
      }
    ]
  }
];

export const sampleActiveRequests: ActiveRequest[] = [
  {
    id: 'REQ-1',
    reference: 'REQ-2026-0310',
    destination: 'شركة الاستثمارات الحديثة',
    linkedEntityRef: 'TRX-8765',
    linkStatus: 'active',
    expiresAt: '2026-10-22',
    status: 'awaiting_reply',
    token: 'r_4c99e1',
    maxDownloads: 5,
    remainingDownloads: 4,
    requiredItems: [
      { id: 'R1', title: 'صورة الصك الإلكتروني المحدث', isRequired: true, isUploaded: true, uploadedFile: 'صك_الكتروني_محدث.pdf' },
      { id: 'R2', title: 'موافقة الجيران المعتمدة', isRequired: true, isUploaded: false },
      { id: 'R3', title: 'فاتورة تنسيق عداد الكهرباء', isRequired: false, isUploaded: false }
    ]
  },
  {
    id: 'REQ-2',
    reference: 'REQ-2026-0308',
    destination: 'مالك الأرض - فيلا حطين',
    linkedEntityRef: 'TRX-8711',
    linkStatus: 'active',
    expiresAt: '2026-10-19',
    status: 'partial',
    token: 'r_88ef22',
    maxDownloads: 3,
    remainingDownloads: 1,
    requiredItems: [
      { id: 'R4', title: 'بطاقة هوية المالك أو الوكيل', isRequired: true, isUploaded: true, uploadedFile: 'هوية_المفوض.pdf' },
      { id: 'R5', title: 'وكالة سارية المفعول من بوابة ناجز', isRequired: true, isUploaded: false }
    ]
  }
];

export const sampleHandoffs: OfficialHandoff[] = [
  {
    id: 'HND-1',
    reference: 'HND-2026-0044',
    platform: 'balady_amana',
    platformName: 'منصة بلدي - أمانة الرياض',
    entityName: 'إدارة رخص البناء والتشييد',
    actionRequired: 'إيداع المخطط الإنشائي واعتماد رخصة الحفر',
    assignedOfficer: 'م. فهد القحطاني',
    deadline: '2026-10-18',
    publicUrl: 'https://balady.gov.sa',
    status: 'ready_for_handoff',
    checklist: [
      { id: 'C1', text: 'تسجيل الدخول بالحساب الهندسي المعتمد', done: true },
      { id: 'C2', text: 'رفع حزمة المخططات بصيغة DWG المعتمدة وPDF', done: true },
      { id: 'C3', text: 'استخراج رقم المعاملة وإيصال السداد إن وجد', done: false },
      { id: 'C4', text: 'حفظ إثبات الإيداع وإرفاقه بالنظام', done: false }
    ]
  },
  {
    id: 'HND-2',
    reference: 'HND-2026-0041',
    platform: 'riyadh_portal',
    platformName: 'بوابة إمارة الرياض الإلكترونية',
    entityName: 'لجنة دراسة المواقع الخاصة',
    actionRequired: 'تسليم خطاب الرفع المساحي للمنطقة المحمية',
    assignedOfficer: 'أحمد السعدون',
    deadline: '2026-10-16',
    publicUrl: 'https://riyadh.gov.sa',
    status: 'completed',
    evidenceFile: 'إيصال_استلام_رقم_19842.pdf',
    evidenceExtractedRef: 'REQ-EMARA-19842',
    checklist: [
      { id: 'C5', text: 'رفع المعاملة مع شهادة السلامة', done: true },
      { id: 'C6', text: 'تأكيد رقم القيد الإلكتروني', done: true },
      { id: 'C7', text: 'حفظ إشعار الاستلام في سجل الوثائق', done: true }
    ]
  }
];

export const sampleTemplates: DocumentTemplate[] = [
  { id: 'TPL-01', title: 'خطاب تسليم مخططات رسمية للأمانة', category: 'خطابات خارجية', relatedUnit: 'المعاملات والتراخيص', usageCount: 248, lastUpdated: '2026-10-10', status: 'active' },
  { id: 'TPL-02', title: 'طلب نواقص مستندات وصكوك من عميل', category: 'طلبات وثائق', relatedUnit: 'مركز المرفقات', usageCount: 512, lastUpdated: '2026-10-12', status: 'active' },
  { id: 'TPL-03', title: 'إشعار تسليم حزمة تقارير فنية واستشارية', category: 'تسليم رسمي', relatedUnit: 'التقارير الفنية', usageCount: 184, lastUpdated: '2026-10-01', status: 'active' },
  { id: 'TPL-04', title: 'نموذج محضر استلام موقع مساحي', category: 'محاضر واستلام', relatedUnit: 'التقارير المساحية', usageCount: 96, lastUpdated: '2026-09-28', status: 'active' },
  { id: 'TPL-05', title: 'إشعار تذكير بانتهاء مهلة رابط الوثائق', category: 'تنبيهات وتذكير', relatedUnit: 'مركز المرفقات', usageCount: 310, lastUpdated: '2026-10-14', status: 'active' }
];
