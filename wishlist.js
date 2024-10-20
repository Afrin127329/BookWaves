// Function to render wishlisted books
const renderWishlistBooks = () => {
  const wishlistContainer = document.getElementById("wishlist-books");
  wishlistContainer.innerHTML = "";

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const allBooks = JSON.parse(localStorage.getItem("books"));
  const wishlistedBooks = allBooks.filter((book) =>
    wishlist.includes(book.id.toString())
  );

  // Render each book in the wishlist
  wishlistedBooks.forEach((book) => {
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
            <span id="${book.id}">
              Remove from Wishlist
              <img
                class="wishlist-img"
                src="./assets/red-love.png"
                alt="Wishlist icon"
              />
            </span>
          </button>
        </div>
      </div>
    `;

    wishlistContainer.appendChild(bookElement);
  });

  // Attach event to remove from wishlist
  removeWishlistEvents();
};

// Function to handle wishlist events (removal in this case)
const removeWishlistEvents = () => {
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const bookId = e.target.closest("button").getAttribute("data-id");

      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist = wishlist.filter((id) => id !== bookId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      renderWishlistBooks();
    });
  });
};

// Render the wishlist on page load
document.addEventListener("DOMContentLoaded", renderWishlistBooks);
