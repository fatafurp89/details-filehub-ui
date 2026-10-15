import { useEffect, useState } from 'react';
import { Check, Copy, FileUp, Link2, Loader2, Mail, MessageCircle, Send, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { api, fileSize, shareFormData, validateFiles, type EmployeeSession, type Received, type RequestItem, type ShareItem } from '@/lib/attachments-api';

export async function copyText(text: string, done: (message: string) => void) {
  try { await navigator.clipboard.writeText(text); done('تم النسخ'); } catch { done('تعذّر النسخ. حدد النص وانسخه يدويًا.'); }
}
export function SuccessDialog({ item, onClose, notify }: { item: RequestItem | ShareItem | null; onClose: () => void; notify: (s: string) => void }) {
  return <Dialog open={!!item} onOpenChange={open => { if (!open) onClose(); }}><DialogContent dir="rtl" className="max-w-lg rounded-xl text-right">
    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary"><Check /></div>
    <DialogTitle className="text-center">الرابط جاهز للمشاركة</DialogTitle><DialogDescription className="text-center">{item?.title}</DialogDescription>
    {item?.qr_svg && <div className="qr-code my-2" dangerouslySetInnerHTML={{ __html: item.qr_svg }} />}
    <div className="flex gap-2"><input readOnly dir="ltr" aria-label="رابط المشاركة" value={item?.url ?? ''} /><Button variant="outline" size="icon" title="نسخ الرابط" onClick={() => item && copyText(item.url, notify)}><Copy /></Button></div>
    <div className="grid grid-cols-2 gap-3"><Button variant="outline" disabled={!item?.messages} onClick={() => item?.messages && copyText(item.messages.whatsapp, notify)}><MessageCircle />نسخ نص واتساب</Button><Button variant="outline" disabled={!item?.messages} onClick={() => item?.messages && copyText(`${item.messages.email_subject}\n\n${item.messages.email}`, notify)}><Mail />نسخ نص البريد</Button></div>
    <Button onClick={onClose}>تم</Button>
  </DialogContent></Dialog>;
}
export function CreateDialog({ kind, session, initialIds, onClose, onCreated }: { kind: 'requests' | 'shares' | null; session: EmployeeSession; initialIds: string[]; onClose: () => void; onCreated: (item: RequestItem | ShareItem) => void }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [received, setReceived] = useState<Received[]>([]); const [receivedError, setReceivedError] = useState(''); const [loadingReceived, setLoadingReceived] = useState(false);
  const [ids, setIds] = useState<string[]>(initialIds); const [files, setFiles] = useState<File[]>([]); const [source, setSource] = useState<'upload' | 'received'>(initialIds.length ? 'received' : 'upload');
  const [search, setSearch] = useState('');
  async function loadReceived() { setLoadingReceived(true); setReceivedError(''); try { const result = await api<{ files: Received[] }>('/received'); setReceived(result.files); } catch (e) { setReceivedError(e instanceof Error ? e.message : 'تعذّر تحميل الملفات'); } finally { setLoadingReceived(false); } }
  useEffect(() => { if (kind === 'shares') void loadReceived(); }, [kind]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const data = new FormData(event.currentTarget); const title = String(data.get('title') ?? '').trim();
    if (!title) { setError('عنوان الطلب مطلوب.'); return; }
    const fields = Object.fromEntries(Array.from(data.entries()).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
    setBusy(true);
    try {
      if (kind === 'requests') {
        const allowed_ext = String(fields['allowed_ext'] ?? '').split(/[,،\s]+/).map(s => s.replace(/^\./, '').toLowerCase()).filter(Boolean);
        const body = { title, instructions: fields['instructions'], requested_from_name: fields['requested_from_name'], requested_from_email: fields['requested_from_email'], requested_from_phone: fields['requested_from_phone'], expires_days: Number(fields['expires_days']), max_files: Number(fields['max_files']), allowed_ext, notify_email: fields['notify_email'] };
        onCreated(await api<RequestItem>('/requests', { method: 'POST', body: JSON.stringify(body) }));
      } else {
        if (!files.length && !ids.length) throw new Error('اختر ملفًا واحدًا على الأقل للإرسال.');
        const invalid = validateFiles(files, session.limits, received.filter(f => ids.includes(f.id))); if (invalid) throw new Error(invalid);
        onCreated(await api<ShareItem>('/shares', { method: 'POST', body: shareFormData({ ...fields, title }, ids, files) }));
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذّر إنشاء الرابط'); } finally { setBusy(false); }
  }
  const isRequest = kind === 'requests';
  return <Dialog open={!!kind} onOpenChange={open => { if (!open && !busy) onClose(); }}><DialogContent dir="rtl" className="max-h-[90dvh] max-w-2xl overflow-y-auto rounded-xl text-right">
    <div className="flex items-center gap-3"><span className="stat-icon">{isRequest ? <FileUp /> : <Send />}</span><div><DialogTitle>{isRequest ? 'إنشاء طلب استقبال' : 'إنشاء رابط إرسال'}</DialogTitle><DialogDescription className="mt-2">{isRequest ? 'تفاصيل الطلب والجهة المطلوب منها الملفات' : 'ملفات الإرسال وبيانات المستلم'}</DialogDescription></div></div>
    <form onSubmit={submit} className="space-y-5">
      <label className="block">{isRequest ? 'عنوان الطلب' : 'عنوان رابط الإرسال'} <span className="text-destructive">*</span><input name="title" required placeholder={isRequest ? 'مثال: مخططات مشروع المبنى الإداري' : 'مثال: تسليم المخططات المعتمدة'} /></label>
      <label className="block">{isRequest ? 'تعليمات إرفاق الملفات' : 'ملاحظة للمستلم'}<textarea name={isRequest ? 'instructions' : 'note'} rows={2} placeholder="اكتب التفاصيل هنا…" /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label>اسم {isRequest ? 'الجهة / العميل' : 'المستلم'}<input name={isRequest ? 'requested_from_name' : 'recipient_name'} placeholder="اسم الجهة أو الشخص" /></label><label>صلاحية الرابط (بالأيام)<input name="expires_days" type="number" min={1} required defaultValue={isRequest ? session.limits.request_days : session.limits.share_days} /></label></div>
      {isRequest ? <>
        <div className="grid gap-4 sm:grid-cols-2"><label>بريد الجهة الإلكتروني<input name="requested_from_email" type="email" dir="ltr" placeholder="name@company.com" /></label><label>رقم الجوال<input name="requested_from_phone" type="tel" dir="ltr" placeholder="05xxxxxxxx" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label>الحد الأقصى للملفات<input name="max_files" type="number" min={1} max={session.limits.max_files} required defaultValue={session.limits.max_files} /></label><label>امتدادات الملفات المسموحة<input name="allowed_ext" dir="ltr" placeholder="pdf, dwg, xlsx" /></label></div>
        <label className="block">بريد إشعارات الاستقبال<input name="notify_email" type="email" dir="ltr" defaultValue={session.employee.email} /></label>
        <div className="flex flex-wrap gap-4 rounded-md bg-muted p-3 text-xs text-muted-foreground"><span>حجم الملف: <b dir="ltr">{fileSize(session.limits.max_file_bytes)}</b></span><span>إجمالي الطلب: <b dir="ltr">{fileSize(session.limits.max_request_bytes)}</b></span></div>
      </> : <>
        <div className="grid gap-4 sm:grid-cols-2"><label>حد التنزيلات<input name="download_limit" type="number" min={0} placeholder="اختياري" /></label><label>كلمة مرور الرابط<input name="password" type="password" autoComplete="new-password" placeholder="اختياري" /></label></div>
        <div><div className="mb-3 flex items-center justify-between"><label>الملفات <span className="text-destructive">*</span></label><span className="text-xs text-muted-foreground">{ids.length + files.length} ملف محدد</span></div>
          <div className="mb-3 flex gap-2"><Button type="button" variant={source === 'upload' ? 'secondary' : 'outline'} onClick={() => setSource('upload')}><UploadCloud />رفع ملفات</Button><Button type="button" variant={source === 'received' ? 'secondary' : 'outline'} onClick={() => setSource('received')}><FileUp />ملفات واردة {ids.length > 0 && `(${ids.length})`}</Button></div>
          {source === 'upload' ? <><label className="drop-zone block cursor-pointer" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}><UploadCloud className="mx-auto mb-2 size-7 text-primary" /><span className="block text-primary">اختر الملفات أو اسحبها هنا</span><span className="mt-2 block text-xs font-normal text-muted-foreground">حتى {session.limits.max_files} ملفًا · {fileSize(session.limits.max_file_bytes)} لكل ملف</span><input type="file" multiple className="sr-only" onChange={e => { setFiles(prev => [...prev, ...Array.from(e.target.files ?? [])]); e.target.value = ''; }} /></label>
            {files.map((file, i) => <div key={`${file.name}-${i}`} className="mt-2 flex items-center gap-2 text-sm"><FileUp className="size-4 text-primary" /><span className="min-w-0 flex-1 truncate" dir="auto">{file.name}</span><span dir="ltr" className="text-xs text-muted-foreground">{fileSize(file.size)}</span><Button variant="ghost" size="icon" type="button" title="إزالة الملف" onClick={() => setFiles(prev => prev.filter((_, index) => index !== i))}><X /></Button></div>)}
          </> : <div className="rounded-lg border p-3"><input aria-label="البحث في الملفات الواردة" placeholder="ابحث باسم الملف أو الطلب…" value={search} onChange={e => setSearch(e.target.value)} />
            {loadingReceived && <p className="py-4 text-center text-sm text-muted-foreground">جارٍ تحميل الملفات…</p>}
            {receivedError && <div className="py-3 text-sm text-destructive">{receivedError}<Button type="button" variant="link" onClick={loadReceived}>إعادة المحاولة</Button></div>}
            <div className="max-h-48 overflow-y-auto">{received.filter(f => `${f.original_name} ${f.request_title}`.includes(search)).map(file => <label key={file.id} className="flex cursor-pointer items-center gap-3 border-b py-3 last:border-0"><input type="checkbox" checked={ids.includes(file.id)} onChange={e => setIds(prev => e.target.checked ? [...prev, file.id] : prev.filter(id => id !== file.id))} /><div className="min-w-0 flex-1"><div className="truncate font-normal" dir="auto">{file.original_name}</div><div className="mt-1 text-xs font-normal text-muted-foreground">{file.request_title} · {file.uploader_name}</div></div><span className="text-xs font-normal text-muted-foreground" dir="ltr">{fileSize(file.size)}</span></label>)}</div>
            {!loadingReceived && !receivedError && !received.length && <p className="py-5 text-center text-sm text-muted-foreground">لا توجد ملفات واردة.</p>}
          </div>}
        </div>
      </>}
      {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-3 border-t pt-4"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>إلغاء</Button><Button type="submit" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <Link2 />}{busy ? 'جارٍ الإنشاء…' : isRequest ? 'إنشاء طلب الاستقبال' : 'إنشاء رابط الإرسال'}</Button></div>
    </form>
  </DialogContent></Dialog>;
}
