import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Note: This viewer renders PDFs onto a canvas per page to avoid selectable text.
// It disables context menu and common keyboard shortcuts. Client-side measures
// cannot fully prevent screenshots; server disables download headers and uses inline disposition.

export default function BookViewer() {
  const { id } = useParams();
  const containerRef = useRef(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        // Get book metadata
        const list = await api.get('/books');
        const book = list.data.find((b) => String(b.id) === String(id));
        if (book) setTitle(book.title);

        GlobalWorkerOptions.workerSrc = workerSrc;
        setRendering(true);
        // Fetch as binary via our axios instance (adds Authorization automatically)
        const res = await api.get(`/books/${id}/stream`, { responseType: 'arraybuffer' });
        const data = new Uint8Array(res.data);
        // Quick sanity check: PDF files start with %PDF
        const header = new TextDecoder('ascii').decode(data.slice(0, 4));
        if (header !== '%PDF') {
          throw new Error('Stream is not a PDF');
        }
        const pdf = await getDocument({ data }).promise;
        console.log(`Loaded PDF with ${pdf.numPages} pages`);
        if (!isMounted) return;
        const container = containerRef.current;
        if (!container) return; // Component not mounted yet
        container.innerHTML = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.3 });
          const canvas = document.createElement('canvas');
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 16px auto';
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d', { alpha: false });
          await page.render({ canvasContext: ctx, viewport }).promise;
          container.appendChild(canvas);
        }
        setRendering(false);
      } catch (e) {
        console.error(e);
        setError('Failed to load book');
        setRendering(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id]);

  // Disable selection, copy, context menu, and common print shortcuts
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    const keyBlock = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (
        ctrl && (
          e.key.toLowerCase() === 'p' || // print
          e.key.toLowerCase() === 's' || // save
          e.key.toLowerCase() === 'c' || // copy
          e.key.toLowerCase() === 'u'    // view-source
        )
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('copy', prevent);
    document.addEventListener('selectstart', prevent);
    document.addEventListener('keydown', keyBlock);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('copy', prevent);
      document.removeEventListener('selectstart', prevent);
      document.removeEventListener('keydown', keyBlock);
    };
  }, []);

  if (loading) return <div className="p-6">Loading book...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 select-none" style={{ userSelect: 'none' }}>
      <h1 className="text-xl font-semibold mb-4">{title || 'Book'}</h1>
      {rendering && <div className="p-6 text-blue-600">Rendering pages...</div>}
      <div ref={containerRef} className="max-w-4xl mx-auto" />
      <p className="text-sm text-gray-500 mt-4">
        Viewing only. Downloading, copying, printing, and selection are disabled.
      </p>
    </div>
  );
}


