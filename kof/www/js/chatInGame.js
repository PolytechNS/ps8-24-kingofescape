let opened = false;

function display() {
    if (opened) {
        document.getElementById('chooseRecation').style.display = 'none';
        opened = false;
    }
    else {    
        document.getElementById('chooseRecation').style.display = 'grid';
        opened = true;
    }
}