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
        populateGenres(books[0].subjects);
      } else {
        const response = await fetch(`${API_URL}?page=${page}`);
        const data = await response.json();
        books = data.results;
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
        renderPagination(books.length);
        populateGenres(books[0].subjects);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Render books to the DOM
  const renderBooks = () => {
    booksList.innerHTML = "";
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = books.slice(start, end);

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
      const imgSrc = wishlist.includes(book.id.toString()) // Ensure id comparison is correct
        ? "./assets/red-love.png"
        : "./assets/white-love.png";
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
          <span id="${book.id}">
            Wishlist
            <img
              class="wishlist-img"
              src="${imgSrc}"
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

    // Disable/enable prev/next buttons
    prevPageBtn.disabled = currentPage === 1;
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
    // Get books from localStorage
    const allBooks = JSON.parse(localStorage.getItem("books")) || [];

    const regex = new RegExp(searchTerm, "i");
    const filteredBooks = allBooks.filter((book) => {
      const matchesTitle = regex.test(book.title);
      const matchesAuthor = book.authors.some((author) =>
        regex.test(author.name)
      );
      const matchesSubject = book.subjects.some((subject) =>
        regex.test(subject)
      );

      return matchesTitle || matchesAuthor || matchesSubject;
    });

    console.log(filteredBooks);
    // Update book list
    books = filteredBooks;
    currentPage = 1;
    renderBooks();
    renderPagination(books.length);
  });

  // Handle wishlist toggle
  const toggleWishlist = (e) => {
    const bookId = e.target.closest("button").dataset.id;
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const imgElement = document.querySelector(`span[id="${bookId}"] img`);

    // Check if the book is already in the wishlist
    if (wishlist.includes(bookId)) {
      wishlist = wishlist.filter((id) => id !== bookId); // Remove from wishlist
      imgElement.src = "./assets/white-love.png"; // Change to white love
    } else {
      wishlist.push(bookId); // Add to wishlist
      imgElement.src = "./assets/red-love.png"; // Change to red love
    }

    // Update localStorage with new wishlist array
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Optionally, toggle a class for styling (if needed)
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

const populateGenres = (genres) => {
  const genreDropdown = document.getElementById("genre-dropdown");
  genreDropdown.innerHTML = ""; // Clear previous items

  // Create and append genre items to the dropdown
  genres.forEach((genre) => {
    const listItem = document.createElement("li");
    listItem.textContent = genre; // Set the genre text
    genreDropdown.appendChild(listItem);
  });
};
