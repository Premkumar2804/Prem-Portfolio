/*=================== Toogle icon nav   =======================*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('fa-xmark');
  navbar.classList.toggle('active');
};

// Close navbar when a nav link is clicked (mobile)
navbar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');
  });
});


/*=================== Scroll sec active link=======================*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        const activeLink = document.querySelector('header nav a[href*=' + id + ']');
        if (activeLink) activeLink.classList.add('active');
      });
    }
  });

  /*=================== sticky navbar=======================*/
  let header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 100);

  /*=================== remove toggle icon and navbar=======================*/
  menuIcon.classList.remove('fa-xmark');
  navbar.classList.remove('active');
};

/* ================= Project Filtering & Search Logic ================= */
document.addEventListener("DOMContentLoaded", () => {
  const projectSearch = document.getElementById("projectSearch");
  const suggestionList = document.getElementById("suggestionList");
  const filterChips = document.querySelectorAll(".chip");
  const projectCards = document.querySelectorAll(".projects-grid .project-card");

  if (projectSearch) {
    projectSearch.addEventListener("input", () => {
      filterProjects();
      showSuggestions();
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!projectSearch.contains(e.target) && !suggestionList.contains(e.target)) {
        suggestionList.style.display = "none";
      }
    });

    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        filterProjects();
      });
    });

    function filterProjects() {
      const searchTerm = projectSearch.value.toLowerCase().trim();
      const activeFilter = document.querySelector(".chip.active")?.getAttribute("data-filter") || "all";

      projectCards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        const id = card.getAttribute("data-id")?.toLowerCase() || "";
        const categories = card.getAttribute("data-category")?.toLowerCase() || "";
        const tags = Array.from(card.querySelectorAll(".tag")).map(t => t.innerText.toLowerCase()).join(" ");
        const framework = card.querySelector(".framework-label")?.innerText.toLowerCase() || "";

        const matchesSearch = title.includes(searchTerm) ||
          id.includes(searchTerm) ||
          tags.includes(searchTerm) ||
          framework.includes(searchTerm);

        const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);

        if (matchesSearch && matchesFilter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    }

    function showSuggestions() {
      const searchTerm = projectSearch.value.toLowerCase().trim();
      if (!suggestionList) return;

      suggestionList.innerHTML = "";

      if (searchTerm.length < 1) {
        suggestionList.style.display = "none";
        return;
      }

      const suggestions = [];
      projectCards.forEach(card => {
        const title = card.querySelector("h3").innerText;
        const id = card.getAttribute("data-id");
        if (title.toLowerCase().includes(searchTerm) || id.toLowerCase().includes(searchTerm)) {
          suggestions.push({ title, id });
        }
      });

      if (suggestions.length > 0) {
        suggestions.forEach(item => {
          const div = document.createElement("div");
          div.className = "suggestion-item";
          div.innerHTML = `<span style="color: var(--main-color)">${item.id}</span> - ${item.title}`;
          div.onclick = () => {
            projectSearch.value = item.id;
            suggestionList.style.display = "none";
            filterProjects();
          };
          suggestionList.appendChild(div);
        });
        suggestionList.style.display = "block";
      } else {
        suggestionList.style.display = "none";
      }
    }
  }
});

/*=================== scrll reveal=======================*/
ScrollReveal({
  distance: '80px',
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal('.home-content , heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .technical-skills, .project-cointainer, .certificate-container, .contact form,  .feedback-form, .feedback-display', { origin: 'button' });
ScrollReveal().reveal('.home-contact h1, .about-img , .certificate-box', { origin: 'left' });
ScrollReveal().reveal('.home-contact p, .about-content', { origin: 'left' });

/*=================== scrll reveal=======================*/
const typed = new Typed('.multiple-text', {
  strings: ['.Net Full Stack Developer.', 'Application Developer', 'Youtuber'],
  typeSpeed: 70,
  backSpeed: 70,
  backDelay: 100,
  loop: true,
});

/*=================== scrll reveal=======================*/
window.onload = function () {
  const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  storedFeedbacks.forEach(addFeedbackCard);
};

document.getElementById("reviewForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const designation = document.getElementById("designation").value;
  const comments = document.getElementById("comments").value;
  const rating = document.getElementById("rating").value;

  const feedback = { name, designation, comments, rating };

  // Save to localStorage
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push(feedback);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  addFeedbackCard(feedback);

  document.getElementById("thankYouMessage").style.display = "block";
  setTimeout(() => {
    document.getElementById("thankYouMessage").style.display = "none";
  }, 3000);

  this.reset();
  document.querySelector(".feedback-display").scrollIntoView({ behavior: "smooth" });
});

function addFeedbackCard({ name, designation, comments, rating }) {
  const feedbackCard = document.createElement("div");
  feedbackCard.classList.add("feedback-card");
  feedbackCard.innerHTML = `
      <div class="avatar">
        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="Avatar">
      </div>
      <div class="client-info"><strong>${name}</strong></div>
      <div class="client-info">${designation}</div>
      <p>"${comments}"</p>
      <div class="stars">${rating}</div>
    `;
  document.getElementById("feedbackList").appendChild(feedbackCard);
}

/*Slide windo certificate*/
const track = document.querySelector('.carousel-track');
const boxes = Array.from(track.children);
const prev = document.querySelector('.prev-btn');
const next = document.querySelector('.next-btn');
let index = 0;

function updateCarousel() {
  const slideWidth = boxes[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

next.addEventListener('click', () => {
  index = (index + 1) % boxes.length;
  updateCarousel();
});

prev.addEventListener('click', () => {
  index = (index - 1 + boxes.length) % boxes.length;
  updateCarousel();
});

window.addEventListener('resize', updateCarousel);
window.addEventListener('load', updateCarousel);
