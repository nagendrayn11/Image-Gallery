
const galleryItems = [...document.querySelectorAll(".gallery-item")];
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const imageCount = document.getElementById("imageCount");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visibleItems = [...galleryItems];
let currentIndex = 0;
let lastFocusedElement = null;

// Filter gallery by category
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.filter;

        visibleItems = galleryItems.filter(item => {
            const matches = category === "all" ||
                item.dataset.category === category;

            item.classList.toggle("hide", !matches);
            return matches;
        });
    });
});

// Open image in lightbox
function openLightbox(index) {
    if (!visibleItems.length) return;

    currentIndex = index;
    lastFocusedElement = document.activeElement;

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";

    showImage();
    closeBtn.focus();
}

// Display current image
function showImage() {
    const item = visibleItems[currentIndex];
    const img = item.querySelector("img");
    const title = item.querySelector("h3");
    const category = item.querySelector(".image-info p");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title.textContent;
    lightboxCategory.textContent = category.textContent;

    imageCount.textContent =
        `Image ${currentIndex + 1} of ${visibleItems.length}`;

    prevBtn.disabled = visibleItems.length < 2;
    nextBtn.disabled = visibleItems.length < 2;
}

// Click any visible gallery image
galleryItems.forEach(item => {
    item.addEventListener("click", () => {
        const index = visibleItems.indexOf(item);

        if (index !== -1) {
            openLightbox(index);
        }
    });
});

// Next image
function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showImage();
}

// Previous image
function previousImage() {
    currentIndex =
        (currentIndex - 1 + visibleItems.length) % visibleItems.length;

    showImage();
}

nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", previousImage);

// Close lightbox
function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

closeBtn.addEventListener("click", closeLightbox);

// Close when clicking the dark background
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard controls
document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowRight") {
        nextImage();
    } else if (event.key === "ArrowLeft") {
        previousImage();
    }
});
