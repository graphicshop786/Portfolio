// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-links li a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// Responsive Navbar Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function () {
  navLinks.classList.toggle('active');
});

// Intersection Observer for Section Fade-In Animations
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');

  const observerOptions = {
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
});

// Function to animate text letter by letter while keeping spaces intact
function animateText(element, delay = 50) {
    const text = element.innerText;
    element.innerHTML = ""; // Empty the text to replace it with spans

    text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.innerText = char;
        span.classList.add("animated-text");
        span.style.transitionDelay = `${index * delay}ms`;

        // Preserve spaces by replacing them with a non-breaking space ( )
        if (char === " ") {
            span.innerHTML = "&nbsp;";
        }

        element.appendChild(span);
    });

    // Reveal letters with delay
    setTimeout(() => {
        document.querySelectorAll(".animated-text").forEach((char) => {
            char.style.opacity = "1";
            char.style.transform = "translateY(0)";
        });
    }, 100);
}

// Apply animation to the About Me paragraph
document.addEventListener("DOMContentLoaded", () => {
    const aboutText = document.querySelector("#about p");
    if (aboutText) {
        animateText(aboutText);
    }
});

// Circular Progress Bar Animation Function
function animateProgressBar(element, endValue, color) {
    let startValue = 0;
    let speed = 30;
    
    let progress = setInterval(() => {
        startValue++;
        element.querySelector(".progress-value").textContent = `${startValue}%`;
        element.style.background = `conic-gradient(${color} ${startValue * 3.6}deg, #222 0deg)`;
        
        if (startValue === endValue) {
            clearInterval(progress);
        }
    }, speed);
}

// Apply animation to skills
document.addEventListener("DOMContentLoaded", () => {
    const skills = [
        { element: ".wordpress", value: 95, color: "#39FF14" },
        { element: ".graphic-design", value: 90, color: "#FFD700" },
        { element: ".web-development", value: 85, color: "#20c997" },
        { element: ".android", value: 80, color: "#00D8FF" },
        { element: ".cnc", value: 75, color: "#FF4500" },
        { element: ".road-safety", value: 70, color: "#FF1493" },
    ];

    skills.forEach(skill => {
        animateProgressBar(document.querySelector(skill.element), skill.value, skill.color);
    });
});

////////////////////////////

let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let pos = document.documentElement.scrollTop;

    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    
    if (pos > 100) {
        scrollProgress.style.display = "grid"; // Show button
    } else {
        scrollProgress.style.display = "none"; // Hide button
    }

    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0; // Scroll to top
    });

    scrollProgress.style.background = `conic-gradient(#fff ${scrollValue}%, #e6006d ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;