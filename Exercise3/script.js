const themeButton =
    document.querySelector("#theme-btn");

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");

    themeButton.setAttribute(
        "aria-pressed",
        "true"
    );

    themeButton.textContent = "☀️";
}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-theme"
        );


        const isDark =
            document.body.classList.contains(
                "dark-theme"
            );


        themeButton.setAttribute(
            "aria-pressed",
            String(isDark)
        );


        themeButton.textContent =
            isDark ? "☀️" : "🌙";


        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

    }
);
const contactForm =
    document.querySelector("#contact-form");

const submitButton =
    document.querySelector("#submit-btn");

const formStatus =
    document.querySelector("#form-status");


contactForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        submitButton.disabled = true;

        submitButton.textContent =
            "Sending...";

        formStatus.textContent =
            "Submitting your message...";


        setTimeout(() => {

            formStatus.textContent =
                "Message sent successfully!";

            submitButton.disabled = false;

            submitButton.textContent =
                "Send Message";

            contactForm.reset();

        }, 1000);

    }
);