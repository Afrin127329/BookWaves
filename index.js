document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://gutendex.com/books/";
  let books = [];
  let currentPage = 1;
  let booksPerPage = 10;

  const searchInput = document.getElementById("search-bar");
  const genreFilter = document.getElementById("genre-filter");
  const booksList = document.getElementById("books-list");
  const pagination = document.getElementById("pagination");

  // Fetch and display books
  const fetchBooks = async (page = 1) => {
    try {
      const response = await fetch(`${API_URL}?page=${page}`);
      const data = await response.json();
      books = data.results;
      renderBooks(books);
      renderPagination(data.count);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Render books to the DOM
  const renderBooks = (books) => {
    booksList.innerHTML = "";
    books.forEach((book) => {
      const bookCoverUrl =
        book.formats["image/jpeg"] || "./assets/book-cover.jpg"; // Use a default cover if not available
      const bookTitle = book.title;
      const bookAuthors = book.authors.length
        ? book.authors.map((author) => author.name).join(", ")
        : "Unknown Author";
      const bookGenres = book.subjects.length
        ? book.subjects.join(", ")
        : "Unknown Genre";
      const bookElement = document.createElement("div");
      bookElement.classList.add("book");
      bookElement.innerHTML = `
     <img src="${bookCoverUrl}" alt="Book Cover of ${bookTitle}">
      <h3>${bookTitle}</h3>
      <p><strong>Author(s):</strong> ${bookAuthors}</p>
      <p><strong>Genres:</strong> ${bookGenres}</p>
      <p><strong>ID:</strong> ${book.id}</p>
        <button class="wishlist-btn" data-id="${book.id}">♡ Wishlist</button>
      `;
      booksList.appendChild(bookElement);
    });
    // Attach event listeners to wishlist buttons
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", toggleWishlist);
    });
  };

  // Handle pagination rendering
  const renderPagination = (totalBooks) => {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
  };

  // Handle search functionality
  searchInput.addEventListener("input", (e) => {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    renderBooks(filteredBooks);
  });

  // Handle genre filtering
  genreFilter.addEventListener("change", (e) => {
    const filteredBooks = books.filter(
      (book) =>
        book.genre && book.genre.toLowerCase() === e.target.value.toLowerCase()
    );
    renderBooks(filteredBooks);
  });

  // Handle wishlist toggle
  const toggleWishlist = (e) => {
    const bookId = e.target.dataset.id;
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(bookId)) {
      wishlist = wishlist.filter((id) => id !== bookId);
    } else {
      wishlist.push(bookId);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    e.target.classList.toggle("wishlisted");
  };

  // Initial book fetch
  fetchBooks(currentPage);
});
