document.addEventListener("DOMContentLoaded", function() { 
    let newTodoinput = document.getElementById("new-todo");
    getItems();

    // add new item
    newTodoinput
        .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                if(this.value != ''){
                    addItem(this.value);
                    this.value = '';
                }
            }
        });

    document.body.onclick = function(event) {
        let t = event.target || event.innerText || textContent; 

        //make input be fulfilled
        if (t.tagName === 'INPUT'){
            fulfilledInput(t);
        }

        //change item
        if (t.tagName === 'LABEL'){
            changeItem(t.id, t.textContent, t);
        }

        //delete item
        if (t.tagName === 'BUTTON'){
            deleteItem(t.id, t);
        }
   }
});

let getItems = () => {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let todosData = JSON.parse(this.responseText);
            displayItems(todosData.items);
        }
    };
    xmlhttp.open("POST", "api/v1/getItems.php", true);
    xmlhttp.send();
};
        

let addItem = (newTodo) => {
    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let id = JSON.parse(this.responseText);
                addNewItem(id.id, newTodo);
            }
        };
        xmlhttp.open("POST", "api/v1/addItem.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send("text=" + newTodo);

};

let displayItems = (elements) => {
    document.getElementById('todo-list').innerHTML = '';

    elements.forEach(function (elem) {
        addNewItem(elem.id, elem.text); 
    });
};


let addNewItem = (id, text) => {
    document.getElementById('todo-list').innerHTML += `
        <li id="${id}">
            <div class="view">
                <input class="toggle" type="checkbox">
                <label>${text}</label>
                <button class="destroy"></button>
            </div>
        </li>`
    ;
};
    
let changeItem = (id, text, t) => {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let reply = JSON.parse(this.responseText);
            if(reply.ok === true){
                deleteItem(id, t);
                document.getElementById("new-todo").value = text;
            }
        }
    };
    xmlhttp.open("POST", "api/v1/deleteItem.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id=" + id, "text=" + text, "checked=" + true);
    
};

let deleteItem = (id, button) => {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let reply = JSON.parse(this.responseText);
            if(reply.ok === true){
                button.parentNode.parentNode.remove(button);
            }
        }
    };
    xmlhttp.open("POST", "api/v1/deleteItem.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id=" + id);
};

let fulfilledInput = (input) => {
    input.parentNode.parentNode.classList.toggle("completed");
};
