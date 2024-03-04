const dots = document.querySelector('.dots');

function animateDots() {
    let dotCount = dots.textContent.length;
    if (dotCount < 3) {
        dots.textContent += '.';
    } else {
        dots.textContent = '';
    }
}

setInterval(animateDots, 500);
