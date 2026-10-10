console.log("SCRIPT LOADED");


const component =
    document.querySelector("#component");


const stateButtons =
    document.querySelectorAll("[data-state]");


const resources = [
    {
        title: "Semantic HTML",
        category: "HTML",
        level: "Core"
    },

    {
        title: "CSS Grid",
        category: "CSS",
        level: "Core"
    },

    {
        title: "JavaScript DOM",
        category: "JavaScript",
        level: "Core"
    }
];



/* =========================
   LOADING STATE
========================= */

function renderLoading() {

    component.replaceChildren();


    const list =
        document.createElement("section");


    list.className = "skeleton-list";


    list.setAttribute(
        "aria-label",
        "Loading resources"
    );


    for (let i = 0; i < 3; i += 1) {

        const skeleton =
            document.createElement("article");


        skeleton.className = "skeleton-item";


        skeleton.setAttribute(
            "aria-hidden",
            "true"
        );


        list.appendChild(skeleton);

    }


    component.appendChild(list);

}



/* =========================
   LIVE DATA STATE
========================= */

function renderSuccess() {

    component.replaceChildren();


    const grid =
        document.createElement("section");


    grid.className = "resource-grid";


    resources.forEach((resource) => {

        const card =
            document.createElement("article");


        card.className = "resource-card";


        const title =
            document.createElement("h3");


        title.textContent =
            resource.title;


        const metadata =
            document.createElement("footer");


        metadata.className =
            "metadata";


        const category =
            document.createElement("span");


        category.className =
            "badge";


        category.textContent =
            resource.category;


        const level =
            document.createElement("span");


        level.className =
            "badge";


        level.textContent =
            resource.level;


        metadata.append(
            category,
            level
        );


        card.append(
            title,
            metadata
        );


        grid.appendChild(card);

    });


    component.appendChild(grid);

}



/* =========================
   EMPTY STATE
========================= */

function renderEmpty() {

    component.replaceChildren();


    const state =
        document.createElement("section");


    state.className =
        "state-message";


    const title =
        document.createElement("h3");


    title.textContent =
        "No resources found";


    const message =
        document.createElement("p");


    message.textContent =
        "There are currently no resources available.";


    state.append(
        title,
        message
    );


    component.appendChild(state);

}



/* =========================
   ERROR STATE
========================= */

function renderError() {

    component.replaceChildren();


    const state =
        document.createElement("section");


    state.className =
        "state-message";


    const title =
        document.createElement("h3");


    title.textContent =
        "Unable to load resources";


    const message =
        document.createElement("p");


    message.textContent =
        "Something went wrong while loading the data.";


    const retryButton =
        document.createElement("button");


    retryButton.type =
        "button";


    retryButton.textContent =
        "Retry";


    retryButton.addEventListener(
        "click",
        simulateLoading
    );


    state.append(
        title,
        message,
        retryButton
    );


    component.appendChild(state);

}



/* =========================
   RETRY / SIMULATED LOAD
========================= */

function simulateLoading() {

    renderLoading();


    setTimeout(() => {

        renderSuccess();

    }, 1500);

}



/* =========================
   STATE BUTTON EVENTS
========================= */

stateButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const state =
                button.dataset.state;


            console.log(
                "Clicked:",
                state
            );


            if (state === "loading") {

                renderLoading();

            }


            if (state === "success") {

                renderSuccess();

            }


            if (state === "empty") {

                renderEmpty();

            }


            if (state === "error") {

                renderError();

            }

        }
    );

});



/* =========================
   INITIAL STATE
========================= */

renderLoading();