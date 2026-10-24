
(() => {
  "use strict";

  const lightbox = document.getElementById("lightbox");
  const largePhoto = document.getElementById("largePhoto");
  const closeButton = document.getElementById("closeLightbox");

  function closePhoto() {
    lightbox.classList.remove("open");
    largePhoto.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".photo").forEach((card) => {
    card.addEventListener("click", () => {
      largePhoto.src = card.dataset.photo;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  closeButton.addEventListener("click", closePhoto);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closePhoto();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePhoto();
    }
  });

  const surpriseButton = document.getElementById("surpriseBtn");
  const surpriseText = document.getElementById("surpriseText");

  surpriseButton.addEventListener("click", () => {
    surpriseText.hidden = !surpriseText.hidden;

    surpriseButton.textContent = surpriseText.hidden
      ? "One tiny surprise ♡"
      : "Keep this little secret ✧";

    if (!surpriseText.hidden) {
      surpriseText.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });

  document.querySelectorAll(".photo img").forEach((img) => {
    img.addEventListener("error", () => {
      img.alt = "Image not found: " + img.getAttribute("src");
      img.style.objectFit = "contain";
      img.style.padding = "12px";
    });
  });
})();
      
