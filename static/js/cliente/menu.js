const slider = document.querySelector('.slider');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

let index = 0;

function getSlides(){
    return document.querySelectorAll('.slide')
}

function actualizarSlider(){
    slider.style.transform = `translateX(-${index * 100}%)`;

}

next.addEventListener('click', () => {
    const slides =getSlides();
    if(index < slides.length - 1){
        index++;
        actualizarSlider();
    }
});

prev.addEventListener('click', () => {
    if(index > 0){
        index--;
        actualizarSlider();
    }
});
