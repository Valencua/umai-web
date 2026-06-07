const slider_reseñas = document.querySelector(".slider-resenas");
const slides_reseñas = document.querySelectorAll(".slide-resenas");
const next_reseñas = document.querySelector(".next-resenas");
const prev_reseñas = document.querySelector(".prev-resenas");

let index_reseñas = 0;

function actualizarSlider() {
  slider_reseñas.style.transform = `translateX(-${index_reseñas * 100}%)`;
}

next_reseñas.addEventListener("click", () => {
  if (index_reseñas < slides_reseñas.length - 1) {
    index_reseñas++;

    actualizarSlider();
  }
});

prev_reseñas.addEventListener("click", () => {
  if (index_reseñas > 0) {
    index_reseñas--;

    actualizarSlider();
  }
});