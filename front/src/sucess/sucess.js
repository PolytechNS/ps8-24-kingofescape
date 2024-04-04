async function fetchData(endpoint) {
    let result = await verifyLogin();
    if (result !== null) {
        let response = await fetch(endpoint + await result.text());
        if (response.status === 200) {
            return await response.json();
        }
    }
    return null;
}

async function scoreSuccess() {
    let res = await fetchData('http://localhost:8000/api/getScores/');
    if (res !== null && res.score !== undefined) {
        let score = res.score;
        let elements = ['score1', 'score2', 'score3', 'score4', 'score5', 'score6', 'score7', 'score8'];
        let steps = [50,100,150,200,300,500,750,1000];
        let j = 0; 

        for (let i of steps) {
            if (score < i) {
                changeOpacity(elements[j]);
            }
            j++;
        }
    }
}

async function gameSuccess() {
    let res = await fetchData('http://localhost:8000/api/getStat/');
    if (res !== null && res.win !== undefined) {
        let win = res.win;
        let lose = res.lose;
        let elements = ['sucess_win1', 'sucess_win5', 'sucess_win10', 'sucess_win20', 'sucess_win50', 'sucess_win100', 'sucess_win200', 'sucess_win500', 'sucess_win1000'];
        let elements2 = ['sucess_loos1', 'sucess_loos5', 'sucess_loos10', 'sucess_loos20', 'sucess_loos50', 'sucess_loos100', 'sucess_loos200', 'sucess_loos500', 'sucess_loos1000'];
        let steps = [1,5,10,20,50,100,200,500,1000];
        let j = 0; 
        console.log(win);
        console.log(lose);
        for (let i of steps) {
            if (win < i) {
                changeOpacity(elements[j]);
            } 
            if (lose < i) {
                changeOpacity(elements2[j]); 
            }
            j++;
        }
    }
}

function changeOpacity(id) {
    var element = document.getElementById(id);
    if (element) {
        element.style.opacity = 0.5;
    }
}

scoreSuccess();
gameSuccess();
