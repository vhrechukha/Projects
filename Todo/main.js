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

    document.onclick = function(event) {
        let t = event.target || event.innerText || textContent; 

        //make input be fulfilled
        if (t.tagName === 'INPUT') {
            fulfilledInput(t);
        }

        //change item
        if (t.tagName === 'LABEL') {
            let inputState = t.parentNode.parentNode.lastElementChild;
                labelState = t.parentNode;

            let data = changeInStaticConditions();
            saveChangedItem(data);

            changeInVariableCondition(inputState, labelState, t.textContent);
        }

        // verufy if some item changed
        if (t.tagName !== 'INPUT' && t.tagName !== 'LABEL') {
            let data = changeInStaticConditions();
            saveChangedItem(data);
        }

        //delete item
        if (t.tagName === 'BUTTON') {
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
            <input class="edit" style="display: none;">
        </li>`
    ;
};

let changeInStaticConditions = () => {
    let inputElem = document.querySelectorAll('input.edit'),
        divELem = document.querySelectorAll('div.view'),
        data = [],
        i;

    for (i = 0; i < divELem.length; i++) { 
        if(inputElem[i].value) {
            data[0] = i;
            data[1] = inputElem[i].value; 
        }
    }
    return data;
};

let displaySaveChangedItem = (i) => {
    let todoTask = document.querySelectorAll('div.view label')[i],
        inputElem = document.querySelectorAll('input.edit'),
        divELem = document.querySelectorAll('div.view');
    inputElem[i].style = 'display: none';
    divELem[i].style = 'display: block';
    todoTask.innerText = inputElem[i].value;
};

let changeInVariableCondition = (inputState, labelState, textContent) => {
    inputForm = inputState,
    todoTask = labelState;
    inputForm.innerHTML = todoTask.value; 
    inputForm.style = 'display : block';
    inputForm.value = textContent;
    todoTask.style = "display: none";
};

let saveChangedItem = (data) => {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let reply = JSON.parse(this.responseText);
            if(reply.ok === true){
                displaySaveChangedItem(data[0]);
            }
        }
    };
    xmlhttp.open("POST", "api/v1/changeItem.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id=" + data[0], "text=" + data[1], "checked=" + true);
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

