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
const { uploadFile } = require("../lib/googleapi");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const uploadsDir = path.join(__dirname, "../uploads/books");
fs.mkdirSync(uploadsDir, { recursive: true });

const addBook = async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  const title = req.body.title || req.file.originalname.replace(/\.pdf$/i, "");
  const storedPath = path
    .relative(__dirname, req.file.path)
    .replace(/\\/g, "/");

  const drive = await uploadFile(req.file.path, "books", title + ".pdf");

  const book = await Book.create({
    title,
    filename: req.file.filename,
    original_filename: req.file.originalname,
    path: storedPath,
    uploaded_by: req.user?.id || null,
    drive: {
      id: drive.id,
      webViewLink: drive.webViewLink,
      src: drive.src,
    },
  });

  await clearCache("books:");

  res.status(StatusCodes.CREATED).json({ id: book.id, title: book.title });
};

const getBooks = async (req, res) => {
  const cacheKey = "books:" + JSON.stringify(req.query);

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Redis Cache Hit:", cacheKey);
      return res.status(StatusCodes.OK).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

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

  const result = {
    books,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  return res.status(StatusCodes.OK).json(result);
};

const getBook = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `book:${id}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Redis Cache Hit:", cacheKey);
      return res.status(StatusCodes.OK).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const book = await Book.findOne({ _id: id }).lean();

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(book));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(book);
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, filename, original_filename, path: filePath } = req.body;

  const book = await Book.findOneAndUpdate(
    { _id: id },
    {
      title,
      filename,
      original_filename,
      path: filePath,
      uploaded_by: req.user?.id || null,
    },
    { new: true }
  );

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  await clearCache("books:");
  await clearCache(`book:${id}`);

  res.status(StatusCodes.OK).json({ message: "Book updated", book });
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  const book = await Book.findOneAndDelete({ _id: id });

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  const filePath = path.join(__dirname, "..", book.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await clearCache("books:");
  await clearCache(`book:${id}`);

  res.status(StatusCodes.OK).json({ message: "Book deleted" });
};

const streamBook = async (req, res) => {
  const { id } = req.params;

  const book = await Book.findOne({ _id: id });

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  const filePath = path.join(__dirname, "..", book.path);

  if (!fs.existsSync(filePath)) {
    throw new NotFoundError("File not found");
  }

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
