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
let token = getCookie("token");

const socket = io.connect('http://localhost:8000/api/1v1',{
    query: {
        token: token
    }
});

socket.on('connect', () => {
    console.log('Connecté au serveur.');

    socket.on('matchFound', (room) => {
        console.log('Match found!');
        localStorage.setItem("room", room);
        changePage("jeu_1v1/jeu_1v1.html");
    });

    socket.on('errorConnect', (message) => {
        window.alert(message);
        changePage("mode/mode.html");
    });
});
