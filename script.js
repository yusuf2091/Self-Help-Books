
  document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    // Toggle menu visibility when button is clicked
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent click from closing the menu immediately
      mobileMenu.classList.toggle("hidden");
    });

    // Hide menu when clicking outside of it
    document.addEventListener("click", (event) => {
      if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        mobileMenu.classList.add("hidden");
      }
    });
  });

// book search functionality


  document.addEventListener("DOMContentLoaded", () => {
    const categories = document.querySelectorAll(".category-card");
    const booksContainer = document.getElementById("books-container");
    const loadMoreBtn = document.getElementById("load-more");

    let currentCategory = "productivity"; // Default category
    let startIndex = 0; // Pagination index

    async function fetchBooks(category, append = false) {
        if (!append) {
            booksContainer.innerHTML = "<p class='text-center w-full text-gray-500'>Loading books...</p>";
            startIndex = 0; // Reset index when switching categories
        }

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${category}+self-help&maxResults=10&startIndex=${startIndex}`);
            const data = await response.json();
            
            if (!append) booksContainer.innerHTML = ""; // Clear books only if not appending

            data.items.forEach(item => {
                const book = item.volumeInfo;
                const bookElement = document.createElement("div");
                bookElement.classList.add("book-card", "bg-white", "p-4", "shadow-md", "rounded-lg", "text-center", "cursor-pointer", "hover:shadow-lg", "transition");

                bookElement.innerHTML = `
                    <img src="${book.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.title}" class="mx-auto mb-3 rounded">
                    <h3 class="text-lg font-semibold">${book.title}</h3>
                    <p class="text-sm text-gray-600">${book.authors ? book.authors.join(", ") : "Unknown Author"}</p>
                    <p class="text-xs text-gray-500 mt-2">📄 ${book.pageCount ? book.pageCount : "N/A"} Pages</p>
                    <p class="text-xs text-gray-500 mt-1">📦 Size: ${book.fileSize ? book.fileSize + "MB" : "Unknown"}</p>
                    <div class="mt-3">
                        ${book.previewLink ? `<a href="${book.previewLink}" target="_blank" class="bg-blue-500 text-white py-1 px-3 rounded-lg text-xs hover:bg-blue-700 transition">📖 Preview</a>` : ""}
                        ${book.accessInfo?.pdf?.downloadLink ? `<a href="${book.accessInfo.pdf.downloadLink}" target="_blank" class="bg-green-500 text-white py-1 px-3 rounded-lg text-xs hover:bg-green-700 transition">⬇ Download</a>` : ""}
                    </div>
                `;

                booksContainer.appendChild(bookElement);
            });

            startIndex += 10; // Increment index for next fetch

        } catch (error) {
            booksContainer.innerHTML = "<p class='text-center w-full text-red-500'>Failed to load books.</p>";
            console.error("Error fetching books:", error);
        }
    }

    categories.forEach(category => {
        category.addEventListener("click", () => {
            currentCategory = category.getAttribute("data-category");
            fetchBooks(currentCategory);
        });
    });

    loadMoreBtn.addEventListener("click", () => {
        fetchBooks(currentCategory, true); // Append books instead of replacing them
    });

    // Fetch default category (Productivity) on page load
    fetchBooks("productivity");
});

// Daily Quotes Section
document.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const newQuoteBtn = document.getElementById("new-quote");

  async function fetchQuote() {
    try {
      const response = await fetch("https://api.kanye.rest");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      quoteText.textContent = `"${data.quote}"`;
      quoteAuthor.textContent = `— Kanye West`; // All quotes are from Kanye
    } catch (error) {
      console.error("Error fetching quote:", error);
      quoteText.textContent = "⚠️ Unable to load a quote. Please try again.";
      quoteAuthor.textContent = "";
    }
  }

  // Fetch quote when the page loads
  fetchQuote();

  // Fetch a new quote on button click
  newQuoteBtn.addEventListener("click", fetchQuote);
});

//best selling books
document.addEventListener("DOMContentLoaded", async () => {
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  async function fetchBestSellingBooks() {
    try {
      const response = await fetch("https://openlibrary.org/subjects/self-help.json?limit=10");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const books = data.works.slice(0, 10); // Get the first 10 books

      books.forEach(book => {
        const coverId = book.cover_id;
        const imageUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'default-image.jpg';
        const bookCard = `
          <div class="flex-none w-40 sm:w-48 md:w-56 lg:w-64 bg-gray-100 p-4 shadow-md rounded-lg text-center transition-transform transform hover:scale-105">
            <img src="${imageUrl}" alt="${book.title}" class="mx-auto mb-4 h-40 w-full object-cover rounded-lg shadow-lg">
            <h3 class="text-sm font-semibold">${book.title}</h3>
            <p class="text-gray-600 text-xs">By ${book.authors ? book.authors[0].name : 'Unknown Author'}</p>
            <a href="https://openlibrary.org${book.key}" target="_blank" class="mt-2 inline-block bg-blue-600 text-white py-1 px-3 rounded-lg text-xs hover:bg-blue-700 transition">
              View Details 📖
            </a>
          </div>`;
        carousel.innerHTML += bookCard;
      });
    } catch (error) {
      console.error("Error fetching best-selling books:", error);
      carousel.innerHTML = "<p class='text-center text-red-500'>⚠️ Failed to load books. Please try again later.</p>";
    }
  }

  // Fetch books when the page loads
  fetchBestSellingBooks();

  // Carousel scrolling function
  function scrollCarousel(direction) {
    const scrollAmount = 300; // Adjust as needed
    carousel.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  }

  // Event listeners for navigation buttons
  prevBtn.addEventListener("click", () => scrollCarousel(-1));
  nextBtn.addEventListener("click", () => scrollCarousel(1));
});

//testimonial
document.addEventListener("DOMContentLoaded", () => {
  const reviewsCarousel = document.getElementById("reviews-carousel");
  const prevReviewBtn = document.getElementById("prevReviewBtn");
  const nextReviewBtn = document.getElementById("nextReviewBtn");

  // Sample User Reviews Data
  const reviews = [
    {
      name: "John Doe",
      review: "This book collection has completely transformed my mindset! Highly recommended. 📚",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Jane Smith",
      review: "A fantastic selection of books that changed my perspective on personal growth. 👏",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      name: "Michael Lee",
      review: "Absolutely love these books! They offer so much wisdom and insight. ⭐⭐⭐⭐⭐",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      name: "Emily Johnson",
      review: "These books helped me take control of my finances. Life-changing! 💰",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/4.jpg"
    }
  ];

  // Function to generate star ratings
  function generateStars(rating) {
    return "⭐".repeat(rating);
  }

  // Load reviews dynamically
  reviews.forEach(user => {
    const reviewCard = `
      <div class="flex-none w-72 bg-white p-6 shadow-md rounded-lg text-center transition-transform transform hover:scale-105">
        <img src="${user.image}" alt="${user.name}" class="mx-auto mb-4 w-16 h-16 rounded-full shadow-lg">
        <h3 class="text-lg font-semibold">${user.name}</h3>
        <p class="text-gray-600 text-sm italic">"${user.review}"</p>
        <p class="star-rating text-lg mt-2">${generateStars(user.rating)}</p>
      </div>`;
    reviewsCarousel.innerHTML += reviewCard;
  });

  // Carousel scrolling function
  function scrollReviews(direction) {
    const scrollAmount = 250; // Adjust as needed
    reviewsCarousel.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  }

  // Event listeners for navigation buttons
  prevReviewBtn.addEventListener("click", () => scrollReviews(-1));
  nextReviewBtn.addEventListener("click", () => scrollReviews(1));
});

// upcoming events
document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("events-container");

  // Sample Events Data (Replace with API later)
  const events = [
    {
      title: "📖 Book Club: 'Atomic Habits' Discussion",
      date: "March 15, 2025",
      time: "6:00 PM - 7:30 PM",
      description: "Join us for an in-depth discussion on 'Atomic Habits' by James Clear.",
      link: "https://example.com/event1"
    },
    {
      title: "🎤 Webinar: 'Financial Freedom with Self-Help Books'",
      date: "March 22, 2025",
      time: "5:00 PM - 6:30 PM",
      description: "A live session on how personal finance books can change your life.",
      link: "https://example.com/event2"
    },
    {
      title: "💡 Workshop: 'Boost Your Productivity in 2025'",
      date: "March 29, 2025",
      time: "4:00 PM - 5:30 PM",
      description: "A hands-on workshop on implementing productivity strategies from top books.",
      link: "https://example.com/event3"
    }
  ];

  // Load events dynamically
  events.forEach(event => {
    const eventCard = `
      <div class="event-card bg-gray-100 p-6 shadow-md rounded-lg text-center">
        <h3 class="text-xl font-semibold mb-2">${event.title}</h3>
        <p class="text-gray-600 text-sm"><strong>📅 ${event.date}</strong> | ⏰ ${event.time}</p>
        <p class="text-gray-500 text-sm mt-2">${event.description}</p>
        <a href="${event.link}" target="_blank" class="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          Register Now 🚀
        </a>
      </div>`;
    eventsContainer.innerHTML += eventCard;
  });
});

// contact
document.getElementById("contact-form").addEventListener("submit", function(event) {
  event.preventDefault();
  alert("📩 Your message has been sent successfully! We will get back to you soon.");
  this.reset();
});
