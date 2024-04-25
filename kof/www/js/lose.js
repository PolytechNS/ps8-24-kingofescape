function loadLose() {
    const result = verifyLogin();

    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                document.getElementById("name").innerHTML = await response.text();
            }
        });
    }
}

loadLose();