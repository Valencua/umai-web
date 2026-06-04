const slider_servicios = document.querySelector(".slider-servicios");
const slides_servicios = document.querySelectorAll(".slide-servicios");
const next_servicios = document.querySelector(".next-servicios");
const prev_servicios = document.querySelector(".prev-servicios");

let index_servicios = 0;

function actualizarSlider() {
  slider_servicios.style.transform = `translateX(-${index_servicios * 100}%)`;
}

next_servicios.addEventListener("click", () => {
  if (index_servicios < slides_servicios.length - 1) {
    index_servicios++;

    actualizarSlider();
  }
});

prev_servicios.addEventListener("click", () => {
  if (index_servicios > 0) {
    index_servicios--;

    actualizarSlider();
  }
});