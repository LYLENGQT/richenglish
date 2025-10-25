const Books = require("../models/Books");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");

// Directory for uploaded books
const uploadsDir = path.join(__dirname, "../uploads/books");
fs.mkdirSync(uploadsDir, { recursive: true });

const addBook = async (req, res) => {
  const id = uuidv4().slice(0, 10);
  const title = req.body.title || req.file.originalname.replace(/\.pdf$/i, "");
  const storedPath = path
    .relative(__dirname, req.file.path)
    .replace(/\\/g, "/");

  await Books.createBook({
    id,
    title,
    filename: req.file.filename,
    original_filename: req.file.originalname,
    path: storedPath,
    uploaded_by: req.user.id || null,
  });

  res.status(StatusCodes.CREATED).json({ id, title });
};

const getBooks = async (req, res) => {
  const books = await Books.findAll();
  res.json(books);
};

const getBook = async (req, res) => {
  const book = await Books.findById(req.params.id);
  if (!book)
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Book not found" });
  res.json(book);
};

const updateBook = async (req, res) => {
  const { title, filename, original_filename, path: filePath } = req.body;
  const result = await Books.updateBook(req.params.id, {
    title,
    filename,
    original_filename,
    path: filePath,
    uploaded_by: req.user.id || null,
  });

  if (result.affectedRows === 0)
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Book not found" });

  res.json({ message: "Book updated" });
};

const deleteBook = async (req, res) => {
  const result = await Books.deleteBook(req.params.id);
  if (result.affectedRows === 0)
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Book not found" });

  res.json({ message: "Book deleted" });
};

const streamBook = async (req, res) => {
  const { id } = req.params;
  const book = await Books.findById(id);

  if (!book)
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Book not found" });

  const filePath = path.join(__dirname, "..", book.path);
  if (!fs.existsSync(filePath))
    return res.status(StatusCodes.NOT_FOUND).json({ error: "File not found" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  // Optional: handle stream errors (can also let middleware catch them)
  stream.on("error", (err) => {
    console.error("Stream error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end("Failed to stream book");
  });
};

module.exports = {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  streamBook,
};
