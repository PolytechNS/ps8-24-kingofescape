
function scoreSucess(){
    let result = verifyLogin();
    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                let url = 'http://localhost:8000/api/getScores/'+ await response.text();
                fetch(url, {
                    method: 'get'
                }).then(async (response) => {
                    if (response.status === 200) {
                        let res = await response.text();
                        res = JSON.parse(res);
                        if (res.score <50) {
                            changeOpacity('score1');
                            changeOpacity('score2');
                            changeOpacity('score3');
                            changeOpacity('score4');
                            changeOpacity('score5');
                            changeOpacity('score6');
                            changeOpacity('score7');
                            changeOpacity('score8');
                        }
                        else if(res.score <100) {
                            changeOpacity('score2');
                            changeOpacity('score3');
                            changeOpacity('score4');
                            changeOpacity('score5');
                            changeOpacity('score6');
                            changeOpacity('score7');
                            changeOpacity('score8');
                        } else if(res.score <150) {
                            changeOpacity('score3');
                            changeOpacity('score4');
                            changeOpacity('score5');
                            changeOpacity('score6');
                            changeOpacity('score7');
                            changeOpacity('score8');
                        } else if(res.score <200) {
                            changeOpacity('score4');
                            changeOpacity('score5');
                            changeOpacity('score6');
                            changeOpacity('score7');
                            changeOpacity('score8');
                        } else if(res.score <300) {
                            changeOpacity('score5');
                            changeOpacity('score6');
                            changeOpacity('score7');
                            changeOpacity('score8');
                        } else if(res.score <500) {
                            changeOpacity('score6');
                            changeOpacity('score7');
                            changeOpacity('score8');
                        } else if(res.score <750) {
                            changeOpacity('score7');
                            changeOpacity('score8');
                        } else if(res.score <1000) {
                            changeOpacity('score8');
                        }
                    }
                    else {
                    }
                });
            }
        });
    }
}

function changeOpacity(id){
    var element = document.getElementById(id); 
    return element.style.opacity = 0.5; 
}

scoreSucess();