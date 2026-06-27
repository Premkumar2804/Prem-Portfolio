/* ================= PRELOADER / WELCOME SCREEN ================= */
(function () {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Prevent scrolling during preloader animation
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
      // Wait for the fillProgress CSS animation to complete (2.2s) + short reveal transition
      setTimeout(() => {
        preloader.classList.add('fade-out');
        // Restore page scrolling
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }, 2400);
    });
  }
})();

/* ================= THEME TOGGLE ================= */
(function () {
  const btn = document.getElementById('themeToggle');
  const body = document.body;

  // Apply saved theme on page load (default: dark)
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
  }

  if (btn) {
    btn.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      const isLight = body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
})();

/* ================= TOOGLE ICON NAVBAR ================= */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
  menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
  };

  // Close navbar when a nav link is clicked (mobile)
  navbar.querySelectorAll('a').forEach(link => {
    if (link.classList.contains('dropdown-trigger')) {
      return; // Skip closing when dropdown is clicked
    }
    link.addEventListener('click', () => {
      menuIcon.classList.remove('fa-xmark');
      navbar.classList.remove('active');
    });
  });
}

/* ================= SCROLL SECTION ACTIVE LINK & STICKY NAVBAR ================= */
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

  /* sticky navbar */
  let header = document.querySelector('header');
  if (header) {
    header.classList.toggle('sticky', window.scrollY > 100);
  }

  /* scroll to top button visibility */
  let scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }
};

/* ================= PERFORMANCE-OPTIMISED MOUSE EFFECTS (Single RAF Loop) ================= */
document.addEventListener("DOMContentLoaded", () => {

  // Background HTML5 Canvas Particles (Dots + Lines constellation)
  const container = document.getElementById('particles-container');
  let canvas, ctx;
  let particles = [];
  const particleCount = 80;
  const connectionDistance = 110;

  if (container) {
    container.innerHTML = '';
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1
      });
    }
  }

  // --- Shared mouse state ---
  let rawX = 0.5, rawY = 0.5;     // normalised 0–1
  let lerpX = 0.5, lerpY = 0.5;   // smoothed values
  const LERP = 0.07;               // smoothing factor (lower = smoother)

  window.addEventListener('mousemove', (e) => {
    rawX = e.clientX / window.innerWidth;
    rawY = e.clientY / window.innerHeight;
  }, { passive: true });

  // --- Elements to drive ---
  const glow       = document.createElement('div');
  glow.className   = 'cursor-glow';
  document.body.appendChild(glow);

  const gridPlane  = document.getElementById('heroGridPlane');
  const orb1       = document.querySelector('.hero-glow-orb.orb-1');
  const orb2       = document.querySelector('.hero-glow-orb.orb-2');

  // --- Single RAF loop —no per-element listeners ---
  function tick() {
    // Lerp towards raw mouse
    lerpX += (rawX - lerpX) * LERP;
    lerpY += (rawY - lerpY) * LERP;

    // 1. Cursor glow follows mouse (GPU transform only)
    glow.style.transform = `translate3d(${lerpX * window.innerWidth - 175}px, ${lerpY * window.innerHeight - 175}px, 0)`;

    // 2. Hero 3D grid plane tilts (CSS custom props → no layout)
    if (gridPlane) {
      const tiltX = 25 + (lerpY - 0.5) * -18;   // 16–34deg range
      const tiltY = (lerpX - 0.5) * 14;          // ±7deg
      gridPlane.style.setProperty('--grid-x', `${tiltX}deg`);
      gridPlane.style.setProperty('--grid-y', `${tiltY}deg`);
      gridPlane.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    // 3. Floating orbs drift slowly (parallax layers)
    if (orb1) {
      orb1.style.transform = `translate(${(lerpX - 0.5) * -40}px, ${(lerpY - 0.5) * -30}px)`;
    }
    if (orb2) {
      orb2.style.transform = `translate(${(lerpX - 0.5) * 25}px, ${(lerpY - 0.5) * 20}px)`;
    }

    // 4. Canvas Particle System rendering (Dots + Lines)
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isLightTheme = document.body.classList.contains('light-theme');
      
      // Dynamic colors based on active theme
      const dotColor = isLightTheme ? 'rgba(123, 97, 255, 0.4)' : 'rgba(0, 245, 255, 0.4)';
      ctx.fillStyle = dotColor;

      const mousePX = rawX * window.innerWidth;
      const mousePY = rawY * window.innerHeight;

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction: push away particles when close
        const dx = mousePX - p.x;
        const dy = mousePY - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 120) {
          const force = (120 - distToMouse) / 120;
          p.x -= (dx / distToMouse) * force * 1.5;
          p.y -= (dy / distToMouse) * force * 1.5;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2dx = p.x - p2.x;
          const p2dy = p.y - p2.y;
          const p2dist = Math.sqrt(p2dx * p2dx + p2dy * p2dy);

          if (p2dist < connectionDistance) {
            const alpha = (1 - (p2dist / connectionDistance)) * (isLightTheme ? 0.08 : 0.13);
            ctx.strokeStyle = isLightTheme ? `rgba(123, 97, 255, ${alpha})` : `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // --- Click ripple ---
  document.addEventListener('click', (e) => {
    const r = document.createElement('span');
    r.className = 'click-ripple';
    r.style.left = `${e.clientX}px`;
    r.style.top  = `${e.clientY}px`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });

  // --- Lightweight card tilt (no per-pixel RAF, just CSS transition) ---
  document.querySelectorAll('.project-box, .project-card, .certificate-box, .details_container, .stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const ax = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
      const ay = ((e.clientX - rect.left) / rect.width  - 0.5) *  14;
      card.style.transform = `perspective(900px) rotateX(${ax}deg) rotateY(${ay}deg) translateY(-5px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
});

/* ================= INTERSECTION OBSERVER FOR SKILLS & STATS ================= */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Skill Progress Bars Animation
  const skillBars = document.querySelectorAll('.progress-line-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-target');
        bar.style.width = targetWidth;
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // 2. Skill Radial Progress Bars Animation
  const radialPaths = document.querySelectorAll('.progress-bar-path');
  const radialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const path = entry.target;
        const maxOffset = parseFloat(path.getAttribute('data-target'));
        const percent = parseFloat(path.getAttribute('data-percent'));
        const offset = maxOffset - (maxOffset * percent) / 100;
        path.style.strokeDashoffset = offset;
        radialObserver.unobserve(path);
      }
    });
  }, { threshold: 0.2 });

  radialPaths.forEach(path => radialObserver.observe(path));

  // 3. Stats Counter Animation
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const duration = 2000; // ms
        const increment = target / (duration / 16); // ~60fps

        const updateCount = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.floor(current) + "+";
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target + "+";
          }
        };

        updateCount();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => counterObserver.observe(counter));
});

/* ================= CERTIFICATE MODAL GALLERY ================= */
function viewCertificate(imgSrc) {
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  if (modal && modalImg) {
    modal.style.display = "block";
    modalImg.src = imgSrc;
  }
}

function closeCertModal() {
  const modal = document.getElementById("certModal");
  if (modal) {
    modal.style.display = "none";
  }
}

/* ================= PROJECT FILTERING & SEARCH LOGIC ================= */
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

    // Parse URL filter parameter on load
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      const activeChip = document.querySelector(`.chip[data-filter="${filterParam}"]`);
      if (activeChip) {
        filterChips.forEach(c => c.classList.remove("active"));
        activeChip.classList.add("active");
        setTimeout(filterProjects, 50); // slight delay to ensure render
      }
    }

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

/* ================= SCROLL REVEAL INITIALIZATION ================= */
if (typeof ScrollReveal !== 'undefined') {
  ScrollReveal({
    distance: '60px',
    duration: 1800,
    delay: 150,
    reset: false
  });

  ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
  ScrollReveal().reveal('.home-img, .skills-bento-grid, .project-cointainer, .certificate-container, .contact form, .feedback-form, .feedback-display', { origin: 'bottom' });
  ScrollReveal().reveal('.about-img, .timeline-item:nth-child(odd)', { origin: 'left' });
  ScrollReveal().reveal('.about-content, .timeline-item:nth-child(even)', { origin: 'right' });
}

/* ================= TYPED JS INITIALIZATION ================= */
if (typeof Typed !== 'undefined') {
  const typed = new Typed('.multiple-text', {
    strings: ['Software Engineer.', '.NET Full Stack Developer.', 'Backend Developer.', 'Open Source Enthusiast.'],
    typeSpeed: 70,
    backSpeed: 60,
    backDelay: 1200,
    loop: true,
  });
}

/* ================= FEEDBACK LOCAL STORAGE SYNC ================= */
window.onload = function () {
  const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  storedFeedbacks.forEach(addFeedbackCard);

  // Set Auto copyright current year
  const yearContainer = document.getElementById("currentYear");
  if (yearContainer) {
    yearContainer.innerText = new Date().getFullYear();
  }
};

const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
  reviewForm.addEventListener("submit", function (e) {
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

    const thankYouMessage = document.getElementById("thankYouMessage");
    if (thankYouMessage) {
      thankYouMessage.style.display = "block";
      setTimeout(() => {
        thankYouMessage.style.display = "none";
      }, 3000);
    }

    this.reset();
    document.querySelector(".feedback-display").scrollIntoView({ behavior: "smooth" });
  });
}

function addFeedbackCard({ name, designation, comments, rating }) {
  const feedbackList = document.getElementById("feedbackList");
  if (feedbackList) {
    const feedbackCard = document.createElement("div");
    feedbackCard.classList.add("feedback-card", "glass-panel");
    feedbackCard.innerHTML = `
        <div class="avatar">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Avatar">
        </div>
        <div class="client-info"><strong>${name}</strong></div>
        <div class="client-location">${designation}</div>
        <p>"${comments}"</p>
        <div class="stars">${rating}</div>
      `;
    feedbackList.appendChild(feedbackCard);
  }
}

/* ================= DROPDOWN MENU CLICK TOGGLE & SKELETON REMOVER ================= */
(function () {
  // Services dropdown click toggle
  const trigger = document.querySelector('.dropdown-trigger');
  const content = document.querySelector('.nav-dropdown-content');
  if (trigger && content) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      content.classList.toggle('show-dropdown');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !content.contains(e.target)) {
        content.classList.remove('show-dropdown');
      }
    });
  }

  // Remove skeleton placeholders after page load
  window.addEventListener('load', () => {
    // Give a short delay after load for smoother transition
    setTimeout(() => {
      document.querySelectorAll('.skeleton').forEach(el => {
        el.classList.remove('skeleton');
      });
    }, 1200);
  });

  // Certificate Modal functions
  window.viewCertificate = function (imgSrc) {
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("certModalImg");
    if (modal && modalImg) {
      modalImg.src = imgSrc;
      modal.style.display = "flex";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
  };

  window.closeCertModal = function () {
    const modal = document.getElementById("certModal");
    if (modal) {
      modal.style.display = "none";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  };

  // Stop click on certificate modal image from closing it (so only clicking background closes it)
  const modalImg = document.getElementById("certModalImg");
  if (modalImg) {
    modalImg.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Bind click event to each certificate box container
  document.querySelectorAll(".certificate-box").forEach(box => {
    const img = box.querySelector("img");
    if (img) {
      box.style.cursor = "pointer";
      box.addEventListener("click", (e) => {
        // Prevent double triggers if clicking on the zoom icon itself
        if (e.target.classList.contains("fa-up-right-from-square")) {
          return;
        }
        const imgSrc = img.getAttribute("src");
        if (imgSrc) {
          window.viewCertificate(imgSrc);
        }
      });
    }
  });

  // Scroll to Top click event
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ================= DAILY PROGRAMMING QUOTE ================= */
  const fallbackQuotes = [
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler"
    },
    {
      text: "First, solve the problem. Then, write the code.",
      author: "John Johnson"
    },
    {
      text: "Experience is the name everyone gives to their mistakes.",
      author: "Oscar Wilde"
    },
    {
      text: "Java is to JavaScript what car is to Carpet.",
      author: "Chris Heilmann"
    },
    {
      text: "Code is like humor. When you have to explain it, it’s bad.",
      author: "Cory House"
    },
    {
      text: "Simplicity is the soul of efficiency.",
      author: "Austin Freeman"
    },
    {
      text: "Before software can be reusable it first has to be usable.",
      author: "Ralph Johnson"
    },
    {
      text: "Make it simple, but significant.",
      author: "Don Draper"
    },
    {
      text: "Optimism is an occupational hazard of programming: feedback is the treatment.",
      author: "Kent Beck"
    },
    {
      text: "Talk is cheap. Show me the code.",
      author: "Linus Torvalds"
    },
    {
      text: "Fix the cause, not the symptom.",
      author: "Steve Maguire"
    },
    {
      text: "Make it work, make it right, make it fast.",
      author: "Kent Beck"
    },
    {
      text: "The most disastrous thing that you can do is learn your first programming language so well that you single-mindedly write code in that language.",
      author: "Alan Perlis"
    },
    {
      text: "Clean code always looks like it was written by someone who cares.",
      author: "Michael Feathers"
    },
    {
      text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
      author: "Bill Gates"
    }
  ];

  function updateQuoteUI(text, author) {
    const textEl = document.getElementById('dailyQuoteText');
    const authorEl = document.getElementById('dailyQuoteAuthor');
    if (textEl) textEl.textContent = `"${text}"`;
    if (authorEl) authorEl.textContent = `— ${author}`;
  }

  function fetchDailyQuote() {
    const today = new Date().toISOString().split('T')[0];
    const cachedDate = localStorage.getItem('dailyQuoteDate');
    const cachedText = localStorage.getItem('dailyQuoteText');
    const cachedAuthor = localStorage.getItem('dailyQuoteAuthor');

    if (cachedDate === today && cachedText && cachedAuthor) {
      updateQuoteUI(cachedText, cachedAuthor);
      return;
    }

    // Try fetching from the free programming quotes API
    fetch('https://programming-quotesapi.vercel.app/api/random')
      .then(response => {
        if (!response.ok) throw new Error('API response not ok');
        return response.json();
      })
      .then(data => {
        const quoteText = data.en || data.quote || data.text;
        const quoteAuthor = data.author || 'Unknown';
        
        if (quoteText) {
          localStorage.setItem('dailyQuoteDate', today);
          localStorage.setItem('dailyQuoteText', quoteText);
          localStorage.setItem('dailyQuoteAuthor', quoteAuthor);
          updateQuoteUI(quoteText, quoteAuthor);
        } else {
          throw new Error('Invalid quote data');
        }
      })
      .catch(error => {
        console.warn('Could not fetch daily quote from API, using daily fallback quote:', error);
        // Use a consistent fallback quote based on the day of the year so it only changes once daily
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const fallback = fallbackQuotes[dayOfYear % fallbackQuotes.length];
        
        localStorage.setItem('dailyQuoteDate', today);
        localStorage.setItem('dailyQuoteText', fallback.text);
        localStorage.setItem('dailyQuoteAuthor', fallback.author);
        updateQuoteUI(fallback.text, fallback.author);
      });
  }

  // Load quote
  fetchDailyQuote();

  /* ================= EXPERIENCE FEEDBACK POPUP ================= */
  // ── CONFIG ── Replace this URL after you deploy your Google Apps Script web app
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZwSAUobRRFWZOOA1qrvbnBXtotQiGGPh9_R6g1NReY7sRSynQ3hqLdHlMGrbjzbQ/exec';

  const popup        = document.getElementById('experiencePopup');
  const closeBtn     = document.getElementById('closePopupBtn');
  const expForm      = document.getElementById('experienceForm');
  const successMsg   = document.getElementById('popupSuccessMessage');
  const footerEl     = document.querySelector('footer.footer');

  // Only run popup logic if popup element exists on this page
  if (popup && footerEl) {

    // ── Show / hide helpers ──────────────────────────────────────
    function showPopup() {
      // Never show again once the user has seen + dismissed it
      if (localStorage.getItem('expPopupDismissed') === 'true') return;
      popup.classList.add('show');
    }

    function hidePopup(permanent) {
      popup.classList.remove('show');
      if (permanent) {
        localStorage.setItem('expPopupDismissed', 'true');
      }
    }

    // ── Trigger: footer scroll only ─────────────────────────────
    const alreadyDismissed = localStorage.getItem('expPopupDismissed') === 'true';

    if (!alreadyDismissed) {
      // Show popup 2 s after the footer enters the viewport
      let footerTimerFired = false;
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !footerTimerFired) {
            footerTimerFired = true;          // only fire once per page load
            setTimeout(showPopup, 2000);
          }
        });
      }, { threshold: 0.15 });

      footerObserver.observe(footerEl);
    }

    // ── Close button ─────────────────────────────────────────────
    if (closeBtn) {
      closeBtn.addEventListener('click', () => hidePopup(true));
    }

    // ── Click outside the card to dismiss ────────────────────────
    popup.addEventListener('click', (e) => {
      if (e.target === popup) hidePopup(true);
    });

    // ── Escape key ───────────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('show')) {
        hidePopup(true);
      }
    });

    // ── Form submit → Google Sheets ──────────────────────────────
    if (expForm) {
      expForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = expForm.querySelector('.popup-submit-btn');
        const name       = document.getElementById('popupName').value.trim();
        const experience = document.getElementById('popupExperience').value.trim();

        if (!name || !experience) return;

        // Disable button while submitting
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        const payload = new URLSearchParams({
          name:       name,
          experience: experience,
          timestamp:  new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          page:       window.location.pathname
        });

        // POST to Google Apps Script web app
        fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode:   'no-cors',          // Apps Script requires no-cors
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload.toString()
        })
          .then(() => {
            // no-cors gives opaque response – treat any completion as success
            showSuccessState();
          })
          .catch(() => {
            // Network offline fallback: still show success to the user
            // and store locally so you never lose the entry
            const stored = JSON.parse(localStorage.getItem('pendingExperiences') || '[]');
            stored.push({ name, experience, timestamp: payload.get('timestamp') });
            localStorage.setItem('pendingExperiences', JSON.stringify(stored));
            showSuccessState();
          });

        function showSuccessState() {
          expForm.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
          
          // Mark as permanently dismissed so it doesn't show again on reload
          localStorage.setItem('expPopupDismissed', 'true');
          
          // Allow the user to see the success message for 3 seconds, then hide the modal
          setTimeout(() => {
            popup.classList.remove('show');
          }, 3000);
        }
      });
    }
  }

  /* ================= NEWSLETTER FORM SUBMIT ================= */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterPopup = document.getElementById('newsletterPopup');
  const closeNewsletterBtn = document.getElementById('closeNewsletterBtn');

  if (newsletterForm && newsletterPopup) {
    function hideNewsletterPopup() {
      newsletterPopup.classList.remove('show');
    }

    if (closeNewsletterBtn) {
      closeNewsletterBtn.addEventListener('click', hideNewsletterPopup);
    }

    newsletterPopup.addEventListener('click', (e) => {
      if (e.target === newsletterPopup) hideNewsletterPopup();
    });

    // Escape key listener for newsletter popup
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && newsletterPopup.classList.contains('show')) {
        hideNewsletterPopup();
      }
    });

    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('newsletterEmail');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const email = emailInput ? emailInput.value.trim() : '';
      
      if (!email) return;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Joining...';
      
      const payload = new URLSearchParams({
        type: 'newsletter',
        email: email,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });
      
      function showNewsletterSuccess() {
        newsletterPopup.classList.add('show');
        newsletterForm.reset();
        
        // Auto-close after 3 seconds
        setTimeout(hideNewsletterPopup, 3000);
      }

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      })
      .then(() => {
        showNewsletterSuccess();
      })
      .catch(error => {
        console.error('Newsletter error:', error);
        showNewsletterSuccess();
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join';
      });
    });
  }
})();
