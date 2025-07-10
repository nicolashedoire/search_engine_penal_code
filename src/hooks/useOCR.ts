// hooks/useOCR.ts
import Tesseract from 'tesseract.js';
import { useState } from 'react';

export function useOCR() {
  const [progress, setProgress] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string|null>(null);

  async function recognize(file: File) {
    setProgress(0);
    setText('');
    setError(null);
    try {
      const { data: { text: resultText } } = await Tesseract.recognize(
        file,
        'fra',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(m.progress);
            }
          }
        }
      );
      setText(resultText);
      return resultText;
    } catch (e: any) {
      setError(e.message);
      console.error(e);
      return '';
    }
  }

  return { recognize, progress, text, error };
}
