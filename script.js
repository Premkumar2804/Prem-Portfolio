/*=================== Toogle icon nav   =======================*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () =>  {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active')
    
}  


/*=================== Scroll sec active link=======================*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');
    
        if(top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector('header nav a[href*=' + id +']').classList.add('active');
            });
        }
    });
    
    /*=================== sticky navbar=======================*/
    let header =document.querySelector('header');
    header.classList.toggle('sticky',window.scrollY > 100);

    /*=================== remove toggle icon and navbar=======================*/
    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');

};

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
    strings:['.Net Full Stack Developer.','Application Developer','Youtuber'],
    typeSpeed: 70,
    backSpeed: 70,
    backDelay:100,
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