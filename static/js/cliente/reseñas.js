const slider = document.querySelector(".slider-resenas");
const slides = document.querySelectorAll(".slide-resenas");
const next = document.querySelector(".next-resenas");
const prev = document.querySelector(".prev-resenas");

let index = 0;

function actualizarSlider() {
  slider.style.transform = `translateX(-${index * 100}%)`;
}

next.addEventListener("click", () => {
  if (index < slides.length - 1) {
    index++;

    actualizarSlider();
  }
});

prev.addEventListener("click", () => {
  if (index > 0) {
    index--;

    actualizarSlider();
  }
});