const Book = require("../model/Book");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, "../uploads/books");
fs.mkdirSync(uploadsDir, { recursive: true });

const addBook = async (req, res) => {
  if (!req.file) throw new BadRequestError("No file uploaded");

  const id = uuidv4().slice(0, 10);
  const title = req.body.title || req.file.originalname.replace(/\.pdf$/i, "");
  const storedPath = path
    .relative(__dirname, req.file.path)
    .replace(/\\/g, "/");

  const book = await Book.create({
    id,
    title,
    filename: req.file.filename,
    original_filename: req.file.originalname,
    path: storedPath,
    uploaded_by: req.user?.id || null,
  });

  res.status(StatusCodes.CREATED).json({ id: book.id, title: book.title });
};

const getBooks = async (req, res) => {
  const query = {};
  const allowedFilters = ["title", "filename", "uploaded_by"];

  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      if (field === "title") {
        query[field] = { $regex: req.query[field], $options: "i" };
      } else {
        query[field] = req.query[field];
      }
    }
  });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const books = await Book.find(query).skip(skip).limit(limit).lean();
  const total = await Book.countDocuments(query);

  return res.status(StatusCodes.OK).json({
    books,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const getBook = async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id }).lean();
  if (!book) throw new NotFoundError("Book not found");

  res.status(StatusCodes.OK).json(book);
};

const updateBook = async (req, res) => {
  const { title, filename, original_filename, path: filePath } = req.body;

  const book = await Book.findOneAndUpdate(
    { id: req.params.id },
    {
      title,
      filename,
      original_filename,
      path: filePath,
      uploaded_by: req.user?.id || null,
    },
    { new: true }
  );

  if (!book) throw new NotFoundError("Book not found");

  res.status(StatusCodes.OK).json({ message: "Book updated", book });
};

const deleteBook = async (req, res) => {
  const book = await Book.findOneAndDelete({ id: req.params.id });
  if (!book) throw new NotFoundError("Book not found");

  const filePath = path.join(__dirname, "..", book.path);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  res.status(StatusCodes.OK).json({ message: "Book deleted" });
};

const streamBook = async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id });
  if (!book) throw new NotFoundError("Book not found");

  const filePath = path.join(__dirname, "..", book.path);
  if (!fs.existsSync(filePath)) throw new NotFoundError("File not found");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
};

module.exports = {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  streamBook,
};
