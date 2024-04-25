let opened = false;

function displaylist() {
    if (opened) {
        let friend = document.getElementById("friendList");
        friend.style.display = "none";
        opened = false;
    } else {
        let friend = document.getElementById("friendList");
        friend.style.display = "grid";
        opened = true;
    }
}