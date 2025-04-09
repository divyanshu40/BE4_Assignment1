const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");
const { book } = require("./models/book.model");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log("The server is running");
});

// function to add new book
async function addNewBook(newBookData) {
    const addedBook = await new book(newBookData).save();
    return { newBook: addedBook };
}
// function to get all books from the database
async function getAllBooks() {
    const books = await book.find();
    return { books: books };
}
// function to books details by title
async function getBookByTitle(bookTitle) {
    const bookDetails = await book.findOne({ title: bookTitle });
    if (! bookDetails) {
        return null;
    }
    return { book: bookDetails };
}
// function to get all books by an author
async function getBooksByAuthor(authorName) {
    const books = await book.find({ author: authorName });
    return { books: books };
}
// function to get all books by genre
async function getAllBooksByGenre(bookGenre) {
    const books = await book.find({ genre: { $all: ["Business"] } });
    return { books: books };
}
// function to get all books by published year
async function getAllBooksByPublishedYear(year) {
    const books = await book.find({ publishedYear: year });
    return { books: books };
}
// function to update book rating by id
async function updateRatingById(bookId, updatedData) {
    const updatedBook = await book.findByIdAndUpdate(bookId, updatedData, { new: true });
    if (! updatedBook) {
        return null;
    }
    return { message: "Book updated successfully", updatedBook };
}
// function to update book data by title
async function updateBookDataByTitle(bookTitle, updatedData) {
    const updatedBook = await book.findOneAndUpdate({ title: bookTitle }, updatedData, { new: true });
    if (! updatedBook) {
        return null;
    }
    return { message: "Book updated successfully", updatedBook };
}
// function to delete book by id
async function deleteBookById(bookId) {
    const deletedBook = await book.findByIdAndDelete(bookId);
    if (! deletedBook) {
        return null;
    }
    return { message: "Book deleted successfully" };
}

// api to add new book
app.post("/books", async (req, res) => {
    const newBookData = req.body;
    try {
        const response = await addNewBook(newBookData);
        return res.status(201).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get all books from the database
app.get("/books", async (req, res) => {
    try {
        const response = await getAllBooks();
        if (response.books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get book by title
app.get("/books/title/:title", async (req, res) => {
    const bookTitle = req.params.title;
    try {
        const response = await getBookByTitle(bookTitle);
        if (response === null) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get books by author
app.get("/books/author/:author", async (req, res) => {
    const author = req.params.author;
    try {
        const response = await getBooksByAuthor(author);
        if (response.books.length === 0) {
            return res.status(500).json({ message: "Book not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get books by genre
app.get("/books/genre/:genre", async (req, res) => {
    const genre = req.params.genre;
    try {
        const response = await getAllBooksByGenre(genre);
        if (response.books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get all books by published year
app.get("/books/publishedYear/:year", async (req, res) => {
    const publishedYear = parseInt(req.params.year);
    try {
        const response = await getAllBooksByPublishedYear(publishedYear);
        if (response.books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to updated rating 
app.post("/books/update-rating/:id", async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const response = await updateRatingById(id, updatedData);
        if (response === null) {
            return res.status(404).json({ message: "Book does not exist" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to update book data by title
app.post("/books/update/:title", async (req, res) => {
    const bookTitle = req.params.title;
    const updatedData = req.body;
    try {
        const response = await updateBookDataByTitle(bookTitle, updatedData);
        if (response === null) {
            return res.status(404).json({ message: "Book does not exist" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to delete book by id
app.delete("/books/delete/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const response = await deleteBookById(bookId);
        if (response === null) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

initializeDatabase()