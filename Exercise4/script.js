const component = document.querySelector("#component");

function renderLoading() {
    component.replaceChildren();

    const list = document.createElement("section");
    list.className = "skeleton-list";
    list.setAttribute("aria-label", "Loading resources");

    for (let i = 0; i < 3; i += 1) {
        const skeleton = document.createElement("article");
        skeleton.className = "skeleton-item";
        skeleton.setAttribute("aria-hidden", "true");

        list.appendChild(skeleton);
    }

    component.appendChild(list);
}

renderLoading();