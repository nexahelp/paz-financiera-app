
import emailjs from 'emailjs-com'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

export async function sendTaskEmail(toEmail: string, toName: string, title: string, due?: string) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: toEmail,
      to_name: toName || toEmail,
      task_title: title,
      due_date: due || ''
    }, PUBLIC_KEY)
  } catch (e) {
    console.warn('EmailJS error:', e)
  }
}
