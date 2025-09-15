import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../App';

const Books = () => {
  const { state } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookFile, setBookFile] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data);
      } catch (e) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Books</h1>

      {state.teacher?.role === 'admin' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">Upload Book (PDF)</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!bookFile) return;
                setUploading(true);
                try {
                  const form = new FormData();
                  if (bookTitle) form.append('title', bookTitle);
                  form.append('file', bookFile);
                  await api.post('/books', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                  setBookTitle('');
                  setBookFile(null);
                  const res = await api.get('/books');
                  setBooks(res.data);
                } catch (e) {
                  alert('Upload failed');
                } finally {
                  setUploading(false);
                }
              }}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Title (optional)"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                className="border p-2 rounded w-full"
              />
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ul className="divide-y divide-gray-200">
            {books.map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between">
                <span className="text-gray-800">{b.title}</span>
                {b.original_filename && (
                  <span className="text-xs text-gray-500 ml-2">({b.original_filename})</span>
                )}
                <Link to={`/portal/books/${b.id}`} className="text-blue-600 hover:underline">View</Link>
              </li>
            ))}
            {books.length === 0 && (
              <li className="py-3 text-gray-500">No books available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Books;


