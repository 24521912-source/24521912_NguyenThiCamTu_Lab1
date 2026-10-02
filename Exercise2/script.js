// Find the theme toggle button
const themeButton =
    document.querySelector("#theme-btn");


// Read previously saved theme
const savedTheme =
    localStorage.getItem("theme");


// Restore dark theme if it was saved
if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-theme"
    );

    themeButton.setAttribute(
        "aria-pressed",
        "true"
    );

    themeButton.textContent =
        "☀️ Light mode";
}


// Listen for button click
themeButton.addEventListener(
    "click",
    () => {

        // Toggle CSS class
        document.body.classList.toggle(
            "dark-theme"
        );


        // Check current theme state
        const isDark =
            document.body.classList.contains(
                "dark-theme"
            );


        // Update accessibility state
        themeButton.setAttribute(
            "aria-pressed",
            String(isDark)
        );


        // Update button text
        themeButton.textContent =
            isDark
                ? "☀️ Light mode"
                : "🌙 Dark mode";


        // Save state
        localStorage.setItem(
            "theme",
            isDark
                ? "dark"
                : "light"
        );

    }
);