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
     ScrollReveal().reveal('.home-img, .technical-skills, .project-cointainer, .certificate-container, .contact form', { origin: 'button' });
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

  