import { toast } from 'react-toastify';

export default function copyText(text: string) {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard API not available');
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  } catch (error: any) {
    console.error(error);
    toast.error(error.message);
  }
}
