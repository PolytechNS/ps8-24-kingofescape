function createTable() {
    const table = document.getElementById('jeu');

    for (let i = 9; i >= 1; i--) {
        for (let j = 1; j <= 9; j++) {
            let divSquare = document.createElement('div');
            divSquare.id = 'I ' + String(j) + String(i);
            divSquare.className = 'square';
            table.appendChild(divSquare);

            if (j !== 9) {
                let divWallVertical = document.createElement('div');
                divWallVertical.id = 'V ' + String(j) + String(i);
                table.appendChild(divWallVertical);
            }
        }

        for (let j = 1; j <= 9; j++) {
            if (i !== 1) {
                let divWallHorizontal = document.createElement('div');
                divWallHorizontal.id = 'H ' + String(j) + String(i);
                table.appendChild(divWallHorizontal);
            }

            if (i !== 1 && j !== 9) {
                let divOSquare = document.createElement('div');
                divOSquare.id = 'O ' + String(j) + String(i);
                table.appendChild(divOSquare);
            }
        }
    }
}

function printAllWallPossible(sentWall) {
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            if (j !== 9) {
                document.getElementById('V ' + String(j) + String(i)).addEventListener('click', sentWall);
            }

            if (i !== 1) {
                document.getElementById('H ' + String(j) + String(i)).addEventListener('click', sentWall);
            }
        }
    }
}

export {createTable, printAllWallPossible}