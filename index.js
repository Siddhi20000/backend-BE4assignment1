// 1. Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. Test your API with Postman. Add the following book:
const express= require("express");
const app= express();
const cors = require("cors");

const {initializeDatabase}= require("./db/db.connect");
const Book= require("./models/book.models");

app.use(cors());
app.use(express.json());

initializeDatabase();

async function createBook(newBook) {
    try{
        const book= new Book(newBook);
        const saveBook= await book.save();
        //console.log(saveBook);
        return saveBook;
    }
    catch(error){
        throw error;
    }
}
//createBook(newBook);
app.post("/books", async(req,res)=>{
    try{
        const savedBook= await createBook(req.body);
        res.status(201).json({message: "Book added successfully", book: savedBook});
    }
    catch(error){
        //console.error(error);
        res.status(500).json({error: "Failed to add book"});
    }
});

// 2. Run your API and create another book data in the db.


// 3. Create an API to get all the books in the database as response. Make sure to do error handling.

async function readAllBooks(){
    try{
        const allBooks= await Book.find();
        return allBooks
    }
    catch(error){
        throw error;
    }
}

app.get("/books", async(req,res)=>{
    try{
        const books= await readAllBooks();
        if(books.length!=0){
            res.json(books);
        }
        else{
            res.status(500).json({error: "no books found"});
        }
    }
    catch(error){
        res.status(500).json({error: "failed to fetch book data"});
    }
});

// 4. Create an API to get a book's detail by its title. Make sure to do error handling.
async function readBookByTitle(bookTitle){
    try{
        const book= await Book.findOne({title: bookTitle});
        return book;
    }
    catch(error){
        throw error;
    }
}

app.get("/books/:title", async(req,res)=>{
    try{
        const bookWithTitle= await readBookByTitle(req.params.title);
        if(bookWithTitle){
            res.send(bookWithTitle);
        }
        else{
            res.status(404).json({error: "book not found"})
        }
    }
    catch(error){
        res.status(500).json({error: "failed to fetch book data"});
    }
});

// 5. Create an API to get details of all the books by an author. Make sure to do error handling.
async function findBookByAuthor(bookAuthor){
    try{
        const bookData= await Book.findOne({author: bookAuthor});
        return bookData;
    }
    catch(error){
        throw error;
    }
}
app.get("/books/author/:bookAuthor", async(req,res)=>{
    try{
        const bookWithAuthor= await findBookByAuthor(req.params.bookAuthor);
        if(bookWithAuthor){
            res.send(bookWithAuthor);
        }
        else{
            res.status(404).json({error: "book not found"});
        }
    }
    catch(error){
        res.status(500).json({error: "failed to fetch book data"});
    }
});

// 6. Create an API to get all the books which are of "Business" genre.
async function getAllBooksByGenre(bookGenre){
    try{
        const bookDataWithGenre= await Book.find({genre: bookGenre});
        return bookDataWithGenre;
    }
    catch(error){
        throw error;
    }
}
app.get("/books/genre/:bookGenre", async(req,res)=>{
    try{
        const bookData= await getAllBooksByGenre(req.params.bookGenre);
        if(bookData){
            res.send(bookData);
        }
        else{
            res.status(404).json({error: "book not found"});
        }
    }
    catch(error){
        res.status(500).json({error: "failed to fetch book data"});
    }
});

// 7. Create an API to get all the books which was released in the year 2012.

async function getBooksByYear(year) {
    try{
        const bookWithThatYear= await Book.find({publishedYear: year});
        return bookWithThatYear;
    }
    catch(error){
        throw error;
    }
}

app.get("/books/year/:publishedYear", async(req,res)=>{
    try{
        const bookData= await getBooksByYear(req.params.publishedYear);
        if(bookData){
            res.send(bookData);
        }
        else{
            res.status(404).json({error: "book not found"});
        }
    }
    catch(error){
        res.status(500).json({error: "failed to fetch book data"});
    }
})

// 8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

async function toUpdateById(id, dataToUpdate) {
    try{
        const updatedBook= await Book.findByIdAndUpdate(id, dataToUpdate, {new: true});
        return updatedBook;
    }
    catch(error){
        throw error;
    }
}

app.post("/books/bookId/:id", async(req,res)=>{
    try{
        const updatedBookData= await toUpdateById(req.params.id, req.body);
        if(updatedBookData){
            res.status(200).json({message: "Book updated successfully", updatedBookData: updatedBookData});
        }
        else{
            res.status(404).json({error: "Book not found"});
        }
    }
    catch(error){
        res.status(500).json({error: "book does not exist"});
    }
})

// Updated book rating: { "rating": 4.5 }

// 9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

async function updateBookByTitle(title,dataToUpdate) {
    try{
        const bookToUpdate= await Book.findOneAndUpdate({title: title}, dataToUpdate, {new: true});
        return bookToUpdate;
    }
    catch(error){
        throw error;
    }
}

app.post("/books/bookTitle/:title", async(req,res)=>{
    try{
        const updatedData= await updateBookByTitle(req.params.title, req.body);
        if(updatedData){
            res.status(200).json({message: "Book updated successfully", updatedData: updatedData});
        }
        else{
            res.status(404).json({error: "book not found"});
        }
    }
    catch(error){
        res.status(500).json({error: "book does not exist"});
    }
});

// Updated book data: { "publishedYear": 2017, "rating": 4.2 }

// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.
async function deleteBookById(id){
    try{
        const deleteBook= await Book.findByIdAndDelete(id);
        return deleteBook;
    }
    catch(error){
        throw error;
    }
}

app.delete("/books/deleteId/:id", async(req,res)=>{
    try{
        const deleteBookData= await deleteBookById(req.params.id);
        if(deleteBookData){
            res.status(200).json({message: "deleted successfully"});
        }
        else{
            res.status(400).json({error: "book not found"});
        }
    }
    catch(error){
        res.status(500).json({error: "book does not exist"});
    }
})


const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});


//BE4_Assignment1 -- completed

// createBook(newBook) - the function is the logic for creating and saving a new Book document into MongoDB.
// A new Book instance is created from the newBook object.
// The instance is saved to MongoDB using .save().
// The saved book document (with _id) is returned.

// POST req /movies
// a POST request sent with book details in the body using postman.
// Server calls createBook(req.body) to save the book.
// If successful, responds with 201 Created and saved book data.
// If failure, responds with 500 Internal Server Error.

// readAllBooks() - this function gives the database logic for fetching all book documents.
// Book.find() → fetches all documents from the books collection.
// Returns the array of books

// GET /books
// request sent to retrieve all books from the database via postman
// Returns a list of all books in the database.
// Returns 404 if no books found.

// Get Book by Title
// GET /books/:title
// Fetch a single book by its title.
// Returns 404 if the book is not found.

// Get Book by author
// GET /books/author/:bookAuthor
// Fetch a book by a given author.
// Returns 404 if no books found.

// Get Books by Genre
// GET /books/genre/:bookGenre
// Fetch all books that belong to a given genre.
// Returns 404 if no books found.

// Get Books by Year
// GET /books/year/:publishedYear
// Fetch all books that belong to a given year.
// Returns 404 if no books found.


// UPDATE /books/bookId/:id
// book id (mongoDB id of that book) is passed as url parameter and raw data typed in body with json format.
// server receieves the book id from request params and raw data from req body.
// calls Book.findByIdAndUpdate(id, dataToUpdate, {new:true}) to update book rating of that book id in database.
// returns success response if updated.

// UPDATE /books/bookTitle/:title
// book title (mongoDB title of that book) is passed as url parameter and raw data typed in body with json format.
// server receieves the book title from request params and raw data from req body.
// calls Book.findOneAndUpdate({title: title}, dataToUpdate, {new: true}); to update book rating of that book id in database.
// returns success response if updated.


// DELETE /books/deleteId/:id
// book id (mongoDB id of that book) is passed as url parameter.
// server receieves the book id from request params.
// calls Book.findByIdAndDelete(id) to delete book data of given book id from database.
// returns success response if deleted.



