const clickHandler = () => {
    let selected = [];
    for (let option of document.getElementById('author').options) {
        if (option.selected) {
            selected.push(option.value);
        }
    }

    for (let option of document.getElementById('concept').options) {
        if (option.selected) {
            selected.push(option.value);
        }
    }

    const req = new XMLHttpRequest;
    req.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(typeof(this.responseText))
            const data = await JSON.parse(this.responseText);
            document.getElementById("title").innerHTML = data[0].problemName;
            // document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    req.open("POST", "http://localhost:8081/getAllProblems", true);
    req.setRequestHeader("Content-Type", "application/json");

    let data = {
        tag: selected
    };

    req.send(JSON.stringify(data));
}
