export type Direction = 'inbound' | 'outbound' | 'request' | 'handoff';
export type DeliveryMethod = 'link' | 'mail' | 'telegram' | 'whatsapp' | 'upload' | 'internal';
export type ProcessStatus = 
  | 'delivered' 
  | 'handoff_manual' 
  | 'awaiting_reply' 
  | 'for_analysis' 
  | 'linked' 
  | 'deposited' 
  | 'draft' 
  | 'canceled'
  | 'delayed';

export type SensitivityLevel = 'public' | 'internal' | 'restricted' | 'secret';

export interface OperationRecord {
  id: string;
  reference: string;
  direction: Direction;
  sourceOrDestination: string;
  documentTitle: string;
  linkedEntity: {
    type: 'transaction' | 'archive' | 'plot' | 'client';
    referenceNumber: string;
    title: string;
  };
  method: DeliveryMethod;
  status: ProcessStatus;
  statusLabel: string;
  timestamp: string;
  ownerName: string;
  hasWatermark?: boolean;
  notes?: string;
  confidence?: number;
  sensitivity: SensitivityLevel;
  linkToken?: string;
}

export interface ExtractedField {
  id: string;
  fieldName: string;
  extractedValue: string;
  confidence: number;
  pageNumber: number;
  suggestedLink: string;
  decision: 'accepted' | 'needs_confirmation' | 'candidate' | 'masked';
  isMasked: boolean;
}

export interface PackageItem {
  id: string;
  title: string;
  originalModule: string;
  moduleReference: string;
  sha256: string;
  order: number;
  pagesCount: number;
  sizeBytes: number;
  hasQualityIssue?: boolean;
  isDraft?: boolean;
}

export interface OutboundPackage {
  id: string;
  pkgReference: string; // PKG-YYYY-NNNN
  destination: string;
  contentSummary: string;
  filesCount: number;
  pagesCount: number;
  createdByName: string;
  createdAt: string;
  requiredReplyBefore?: string;
  status: 'draft' | 'pending_signature' | 'ready' | 'delivered' | 'handoff_manual' | 'canceled';
  items: PackageItem[];
  linkedTransactionRef: string;
}

export interface ActiveRequest {
  id: string;
  reference: string;
  destination: string;
  requiredItems: { id: string; title: string; isRequired: boolean; isUploaded: boolean; uploadedFile?: string }[];
  linkedEntityRef: string;
  linkStatus: 'active' | 'consumed' | 'expired';
  expiresAt: string;
  status: 'awaiting_reply' | 'partial' | 'replied' | 'no_reply';
  token: string;
  maxDownloads: number;
  remainingDownloads: number;
}

export interface OfficialHandoff {
  id: string;
  reference: string;
  platform: 'riyadh_portal' | 'balady_amana' | 'contractors_portal' | 'etimad' | 'other';
  platformName: string;
  entityName: string;
  actionRequired: string;
  assignedOfficer: string;
  deadline: string;
  checklist: { id: string; text: string; done: boolean }[];
  publicUrl: string;
  status: 'pending' | 'in_progress' | 'ready_for_handoff' | 'completed' | 'delayed';
  evidenceFile?: string;
  evidenceExtractedRef?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: string;
  relatedUnit: string;
  usageCount: number;
  lastUpdated: string;
  status: 'active' | 'disabled';
}

export interface CenterStatistics {
  totalOutbound: number;
  totalInbound: number;
  activeRequests: number;
  activeLinks: number;
  filesForSorting: number;
  operationsThisMonth: number;
  avgResponseDays: number;
  onTimeResponseRate: number;
  delayedRequests: number;
  consumedLinks: number;
}
