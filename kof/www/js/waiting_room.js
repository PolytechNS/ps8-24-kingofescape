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

const socket = io.connect(`${apiURL}api/1v1`,{
    query: {
        token: token
    }
});

socket.on('connect', () => {
    console.log('Connecté au serveur.');

    socket.once('getUsername', (username) => {
        console.log(username);
        document.getElementById('name').innerHTML = username;
    });

    socket.on('matchFound', (room) => {
        console.log('Match found!');
        localStorage.setItem("room", room);
        socket.disconnect();
        changePage("jeu_1v1.html");
    });

    socket.on('errorConnect', (message) => {
        alertDialog('Connection',message, 'OK');
        changePage("mode.html");
    });
});
