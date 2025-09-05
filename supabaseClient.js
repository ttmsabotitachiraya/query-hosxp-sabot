// supabaseClient.js

const SUPABASE_URL = 'https://sbozxgquwphmdtwquaru.supabase.co'; // แทนที่ด้วย URL ของคุณ
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNib3p4Z3F1d3BobWR0d3F1YXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjY2OTMsImV4cCI6MjA3MjY0MjY5M30.-ykBAifmqKVMUei72db5Y2KrNRfTMixiuH9Tw-Ijf5A'; // แทนที่ด้วย Anon Key ของคุณ

// --- จุดที่แก้ไข ---
// เราต้องระบุให้ชัดเจนว่าเราต้องการดึง createClient จาก object 'supabase'
// ที่อยู่บน window (ซึ่งมาจาก CDN script ที่เราโหลดใน HTML)
// เพื่อหลีกเลี่ยงการสับสนกับ constant 'supabase' ที่เรากำลังจะ export
const { createClient } = window.supabase;

// จากนั้นเราจึงสร้าง constant 'supabase' ของเราเองเพื่อ export
// ซึ่งตอนนี้จะไม่ขัดแย้งกันแล้ว
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);