const slider = document.querySelector('.slider');

const slides = document.querySelectorAll('.slide');

const next = document.querySelector('.next');

const prev = document.querySelector('.prev');

let index = 0;

function actualizarSlider(){

    slider.style.transform = `translateX(-${index * 100}%)`;

}

next.addEventListener('click', () => {

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
