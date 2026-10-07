const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});


const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const message = document.getElementById("message");

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const messageError = document.getElementById("messageError");
        const formSuccess = document.getElementById("formSuccess");

        // Clear previous messages
        nameError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";
        formSuccess.textContent = "";

        name.classList.remove("input-error");
        email.classList.remove("input-error");
        message.classList.remove("input-error");

        let isValid = true;


        // Name validation
        if (name.value.trim() === "") {

            nameError.textContent =
                "Please enter your name.";

            name.classList.add("input-error");

            isValid = false;
        }


        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.value.trim() === "") {

            emailError.textContent =
                "Please enter your email.";

            email.classList.add("input-error");

            isValid = false;

        } else if (!emailPattern.test(email.value.trim())) {

            emailError.textContent =
                "Please enter a valid email address.";

            email.classList.add("input-error");

            isValid = false;
        }


        // Message validation
        if (message.value.trim() === "") {

            messageError.textContent =
                "Please enter your message.";

            message.classList.add("input-error");

            isValid = false;

        } else if (message.value.trim().length < 10) {

            messageError.textContent =
                "Your message should be at least 10 characters.";

            message.classList.add("input-error");

            isValid = false;
        }


        // Stop if validation failed
        if (!isValid) {
            return;
        }


        // Disable button while sending
        const submitButton =
            contactForm.querySelector(".submit-btn");

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";


        try {

            const response = await fetch("/api/contact", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    message: message.value.trim()
                })

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message || "Something went wrong."
                );

            }


            formSuccess.textContent =
                result.message;

            contactForm.reset();


        } catch (error) {

            formSuccess.textContent =
                error.message;

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Send Message";

        }

    });

}


const revealElements = document.querySelectorAll(
    ".section-title, .about-grid, .skill-card, .project-card, .contact-grid"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);

    
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                });

                const activeLink = document.querySelector(
                    `.nav-links a[href="#${entry.target.id}"]`
                );

                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    },
    {
        threshold: 0.45
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});



const backToTop = document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

}

const mobileNavLinks = document.querySelectorAll(".nav-links a");

mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
const navLinks = document.querySelectorAll(".nav-menu .nav-link");        const menuToggle = document.querySelector(".menu-toggle");

        if (navLinks) {
            navLinks.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.classList.remove("active");
        }
    });
});
});



console.log("Portfolio JavaScript loaded");