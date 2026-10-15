export type State = 'open' | 'closed' | 'expired' | 'purged';
export type Messages = { whatsapp: string; email_subject: string; email: string };
export type EmployeeSession = {
  employee: { employee_no: string; name: string; email: string; admin: boolean };
  perms: string[];
  limits: { max_file_bytes: number; max_request_bytes: number; max_files: number; request_days: number; share_days: number };
  portal: string;
};
export type Upload = { id: string; original_name: string; size: number; sha256: string; mime: string; uploaded_at: string; uploader_ip?: string; uploader_name: string; deleted_at: string | null; previewable: boolean };
export type RequestItem = {
  id: string; token: string; url: string; title: string; instructions: string;
  requested_from_name: string; requested_from_email: string; requested_from_phone: string;
  created_by_employee_no: string; created_by_name: string; created_at: string; expires_at: string;
  max_files: number; allowed_ext: string[]; status: string; closed_at: string | null;
  notify_email: string; state: State; files: number; bytes: number; last_upload_at: string | null;
  qr_svg?: string; messages?: Messages; can_close?: boolean; can_share?: boolean; uploads?: Upload[];
};
export type Download = { downloaded_at: string; ip: string; user_agent: string; kind: string; original_name: string; share_title?: string; share_id?: string };
export type ShareItem = {
  id: string; token: string; url: string; title: string; note: string; recipient_name: string;
  created_by_employee_no: string; created_by_name: string; created_at: string; expires_at: string;
  download_limit: number; has_password: boolean; status: string; closed_at: string | null;
  state: State; files: number; bytes: number; downloads: number; qr_svg?: string; messages?: Messages;
  items?: { id: string; original_name: string; size: number; mime: string; added_at: string; downloads: number; deleted_at: string | null }[];
  can_log?: boolean; log?: Download[];
};
export type Received = { id: string; original_name: string; size: number; mime: string; uploaded_at: string; uploader_name: string; request_title: string; request_id: string };
export type Settings = {
  storage: { used_h: string; quota_h: string; pct: number };
  limits: { max_file: string; max_request: string; max_files: number; retention_days: number; request_days: number; share_days: number };
  counts: { requests: number; uploads: number; shares: number; items: number };
  audit: { at: string; actor_no: string; action: string; target_type: string; target_id: string; ip: string; meta: unknown }[];
};
export function hasPermission(session: EmployeeSession | null, key: string) { return session?.perms.includes(key) ?? false; }
export function canViewRequests(session: EmployeeSession | null) { return hasPermission(session, 'files.requests.view_own') || hasPermission(session, 'files.requests.view_all'); }
export function canViewShares(session: EmployeeSession | null) { return hasPermission(session, 'files.shares.create') || hasPermission(session, 'files.shares.view_all'); }
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/app${path}`, { ...init, credentials: 'same-origin', headers: init?.body instanceof FormData ? (init.headers ?? {}) : { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers } });
  if (response.status === 401) throw new Error('تعذّر التحقق من جلسة الموظف. افتح التطبيق من بوابة الشركة.');
  if (response.status === 403) throw new Error('ليست لديك صلاحية لتنفيذ هذا الإجراء.');
  if (!response.ok) {
    let message = `تعذّر إتمام العملية (${response.status}). حاول مرة أخرى.`;
    try { const data = await response.json(); if (typeof data.message === 'string') message = data.message; else if (typeof data.error === 'string') message = data.error; } catch { /* Non-JSON gateway response. */ }
    throw new Error(message);
  }
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('خدمة المرفقات غير متاحة على هذا العنوان. افتح التطبيق من بوابة الشركة أو أعد المحاولة.');
  return response.json();
}
export const itemPath = (kind: 'requests' | 'shares', id: string) => `/${kind}/${encodeURIComponent(id)}`;
export const uploadUrl = (rid: string, uid: string, inline = false) => `/api/app/requests/${encodeURIComponent(rid)}/uploads/${encodeURIComponent(uid)}/file${inline ? '?inline=1' : ''}`;
export function shareFormData(fields: Record<string, string>, ids: string[], files: File[]) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  body.append('from_uploads', JSON.stringify(ids));
  files.forEach(file => body.append('file', file));
  return body;
}
export function validateFiles(files: File[], limits: EmployeeSession['limits'], received: Received[] = []) {
  if (files.length + received.length > limits.max_files) return `الحد الأقصى هو ${limits.max_files} ملفًا.`;
  if (files.some(file => file.size > limits.max_file_bytes)) return 'أحد الملفات يتجاوز الحد الأقصى لحجم الملف.';
  if ([...files, ...received].reduce((sum, file) => sum + file.size, 0) > limits.max_request_bytes) return 'الحجم الإجمالي يتجاوز الحد المسموح.';
  return null;
}
export function fileSize(bytes: number) { if (!bytes) return '0 B'; const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3); return `${(bytes / 1024 ** i).toLocaleString('en', { maximumFractionDigits: 1 })} ${['B', 'KB', 'MB', 'GB'][i]}`; }
export function dateLabel(value?: string | null) { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric', calendar: 'gregory' }); }
