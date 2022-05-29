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

function searchHandler() {
    const element = document.getElementById("mySelect");
    if(element)
    {
        element.remove();
        console.log("here")
    }
    const text = document.getElementById("searchText").value;

    const req = new XMLHttpRequest;
    req.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            const data= await JSON.parse(this.responseText);
            let myParent = document.body;

            // Create array of options to be added
            let value = [];

            data.map(obj=>value.push(obj.tag))

            // Create and append select list
            let selectList = document.createElement("select");
            selectList.id = "mySelect";
            myParent.appendChild(selectList);

            // Create and append the options
            for (let i = 0; i < value.length; i++) {
                let option = document.createElement("option");
                option.value = value[i];
                option.text = value[i];
                selectList.appendChild(option);
            }
        }
    }
    req.open("GET", "http://localhost:8081/searchTag?value=" + text, true);
    req.send();
}
