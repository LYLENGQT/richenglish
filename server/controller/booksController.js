const pool = require('../database/db')

const addBooks = async (req, res)=>{
try {
    const title = req.body.title || req.file.originalname.replace(/\.pdf$/i, '');
    const storedPath = path.relative(__dirname, req.file.path).replace(/\\/g, '/');
    const [result] = await pool.execute(
      'INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)',
      [title, req.file.filename, req.file.originalname, storedPath, req.user.id || null]
    );
    res.json({ id: result.insertId, title });
  } catch (error) {
    console.error('Book upload error:', error);
    res.status(500).json({ error: 'Failed to upload book' });
  }
}

const getBooks = async (req, res)=>{
 try {
    const [rows] = await pool.execute('SELECT id, title, created_at FROM books ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Books list error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}

const bookReindex = async (req,res)=>{
    try {
    const filesOnDisk = fs.readdirSync(uploadsDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
    const [rows] = await pool.execute('SELECT filename FROM books');
    const existing = new Set(rows.map((r) => r.filename));
    let created = 0;
    for (const fname of filesOnDisk) {
      if (!existing.has(fname)) {
        const title = fname.replace(/\.pdf$/i, '');
        const relPath = path.relative(__dirname, path.join(uploadsDir, fname)).replace(/\\/g, '/');
        await pool.execute(
          'INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)',
          [title, fname, fname, relPath, req.user.id || null]
        );
        created++;
      }
    }
    res.json({ created });
  } catch (error) {
    console.error('Books reindex error:', error);
    res.status(500).json({ error: 'Failed to reindex books' });
  }
}

const bookStream = async (req, res)=>{
try {
    const filesOnDisk = fs.readdirSync(uploadsDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
    const [rows] = await pool.execute('SELECT filename FROM books');
    const existing = new Set(rows.map((r) => r.filename));
    let created = 0;
    for (const fname of filesOnDisk) {
      if (!existing.has(fname)) {
        const title = fname.replace(/\.pdf$/i, '');
        const relPath = path.relative(__dirname, path.join(uploadsDir, fname)).replace(/\\/g, '/');
        await pool.execute(
          'INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)',
          [title, fname, fname, relPath, req.user.id || null]
        );
        created++;
      }
    }
    res.json({ created });
  } catch (error) {
    console.error('Books reindex error:', error);
    res.status(500).json({ error: 'Failed to reindex books' });
  }
}


module.exports = {bookStream, bookReindex, getBooks, addBooks}