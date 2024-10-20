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
      console.log(data.results);
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
        <button class="cssbuttons-io" data-id="${book.id}">
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

// search btn logic
