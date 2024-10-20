document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://gutendex.com/books/";
  let books = [];
  let currentPage = 1;
  let booksPerPage = 10;

  const searchInput = document.getElementById("search-bar");
  const genreFilter = document.getElementById("genre-filter");
  const booksList = document.getElementById("books-list");
  const pagination = document.getElementById("pagination");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageNumbersContainer = document.getElementById("page-numbers");
  const loader = document.getElementById("loading");

  // Fetch and store books in localStorage
  const fetchBooks = async (page = 1) => {
    try {
      if (localStorage.getItem("books")) {
        books = JSON.parse(localStorage.getItem("books"));
        renderBooks();
        renderPagination(books.length);
      } else {
        const response = await fetch(`${API_URL}?page=${page}`);
        const data = await response.json();
        books = data.results;
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
        renderPagination(books.length);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Render books to the DOM
  const renderBooks = () => {
    console.log("called");
    booksList.innerHTML = "";
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    console.log(books);
    console.log(start, end);
    const paginatedBooks = books.slice(start, end);
    console.log(paginatedBooks);

    paginatedBooks.forEach((book) => {
      const bookCoverUrl =
        book.formats["image/jpeg"] || "./assets/book-cover.jpg";
      const bookTitle = book.title;
      const bookAuthors = book.authors.length
        ? book.authors.map((author) => author.name).join(", ")
        : "Unknown Author";
      const bookGenres = book.subjects.length
        ? book.subjects.join(", ")
        : "Unknown Genre";
      const bookElement = document.createElement("div");
      bookElement.classList.add("card-container");
      bookElement.innerHTML = `
            <div class="card">
      <div class="card-img-container">
        <img
          class="card-img"
          src="${bookCoverUrl}"
          alt="Book Cover of ${bookTitle}"
        />
      </div>
      <div class="card-content">
        <h5 class="card-title">${bookTitle}</h5> 
         
        <div class="author-container">
          <h5 class="card-text"><strong>Author(s):</strong> ${bookAuthors}</h5>
          <p class="card-text"><strong>ID:</strong> ${book.id}</p>
        </div>
    
        <p class="card-text">
       <strong>Genres:</strong> ${bookGenres}
        </p>
        <button class="cssbuttons-io wishlist-btn" data-id="${book.id}">
          <span>
            Wishlist
            <img
              class="wishlist-img"
              src="./assets/white-love.png"
              alt="Wishlist icon"
          /></span>
        </button>
      </div>
    </div>
      `;
      booksList.appendChild(bookElement);
    });
    attachWishlistEvents();
  };

  // Render pagination controls
  const renderPagination = (totalBooks) => {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    pageNumbersContainer.innerHTML = `Page ${currentPage} of ${totalPages}`;

    // Disable the previous button if on the first page
    prevPageBtn.disabled = currentPage === 1;

    // Disable the next button if on the last page
    nextPageBtn.disabled = currentPage === totalPages;

    // Reset button event listeners
    prevPageBtn.removeEventListener("click", handlePrevPage);
    nextPageBtn.removeEventListener("click", handleNextPage);

    // Add event listeners to handle page changes
    prevPageBtn.addEventListener("click", handlePrevPage);
    nextPageBtn.addEventListener("click", handleNextPage);
  };

  // Event handlers for pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      renderBooks();
      renderPagination(books.length);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(books.length / booksPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderBooks();
      renderPagination(books.length);
    }
  };

  // Handle search functionality (from localStorage)
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    // Filter books from localStorage
    const allBooks = JSON.parse(localStorage.getItem("books"));
    const filteredBooks = allBooks.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );

    // Update book list
    books = filteredBooks;
    currentPage = 1;
    renderBooks();
    renderPagination(books.length);
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

  // Attach event listeners to wishlist buttons
  const attachWishlistEvents = () => {
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", toggleWishlist);
    });
  };

  // Initial book fetch or load from localStorage
  fetchBooks(currentPage);
});

const dropdown = document.querySelectorAll(".dropdown-btn");

// Обработчик события клика на документе
document.addEventListener("click", (e) => {
  // Проверяем, было ли нажатие вне элемента выпадающего списка
  if (!e.target.closest(".dropdown-btn")) {
    // Закрываем все выпадающие списки
    dropdown.forEach((item) => {
      item.closest(".dropdown").classList.remove("active");
    });
  }
});

dropdown.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // Закрываем все другие выпадающие списки
    dropdown.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.closest(".dropdown").classList.remove("active");
      }
    });

    // Открываем/закрываем текущий выпадающий список
    item.closest(".dropdown").classList.toggle("active");
  });
});
