function saveshopping() {
    if (!shoppingfield.value.length == 0) {
        // random-price
        let price;
        price = Math.random() * 100;

        let inputfieldtext = document.createTextNode(shoppingfield.value + " (" + price.toFixed(2) + ' \xA3)');    //€; \u20AC
        let listitem = document.createElement("li");
        listitem.appendChild(inputfieldtext);

        // olshopping.insertBefore(listitem, olshopping.firstChild)

        olshopping.appendChild(listitem);
        shoppingfield.value = "";

    }
};
// clear the saved list
function clearshopping() {
    while (olshopping.firstChild) {
        olshopping.removeChild(olshopping.firstChild);
    }
}

function moveList() {
    // move list from olshopping to savedlists
    // clear olshopping
    let listitem = document.createElement("li");
    let copyOfOlshopping = olshopping.cloneNode(true);
    if (copyOfOlshopping.childElementCount == 0) {
        return;
    }
    listitem.appendChild(copyOfOlshopping);

    savedlists.appendChild(listitem);

    clearshopping();
    shoppingfield.value = "";
}

function tablelist() {
    moveList;
}

function savetable() {

}

//#region EventListeners

shoppingForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('submit');
    moveList();
})

document.getElementById('save').addEventListener('click', () => {
    saveshopping();
}) 

// Remove Item handler
olshopping.addEventListener('dblclick', (e) => {
    // console.log("dbclick"); 
    e.target.remove();
    if (olshopping.children.length == 0) {
        olshopping.className = '';
    }
});

document.getElementById('clear').addEventListener('click', () => {
    clearshopping();
})


document.onkeydown = function (e) {
    if (e.shiftKey) {
     saveshopping();
    }
}

/*
document.getElementById('newlist1').addEventListener('click', () => {
    moveList();
})
*/

// document.getElementById('table').addEventListener('click', () => {
//     tablelist();
// })



// Remove Item handler
savedlists.addEventListener('dblclick', (e) => {
    //console.log("dbclick"); 
    e.target.remove();
    if (savedlists.children.length == 0) {
        savedlists.className = '';
        olshopping.remove();

    }
    if (copyOfOlshopping.children.length == 0) {
        copyOfOlshopping.className = '';
    }

});

//#endregion EventListeners

// Get the input field
var input = document.getElementById("save");

function tablelist() {
    // move list from olshopping to table
    let shoppingList = document.getElementById("olshopping").childNodes;
    let sum = 0;
    for (let i = 0; i < shoppingList.length; i++) {
        let product = shoppingList[i].textContent.split(" (")[0];
        let price = parseFloat(shoppingList[i].textContent.split(" (")[1].split(" ")[0]);
        let tableRow = document.createElement("tr");
        let productCell = document.createElement("td");
        let priceCell = document.createElement("td");
        productCell.textContent = product;
        priceCell.textContent = price.toFixed(2) + " £";
        tableRow.appendChild(productCell);
        tableRow.appendChild(priceCell);
        document.getElementById("tbody").appendChild(tableRow);
        sum += price;
    }
    document.getElementById("sum").textContent = sum.toFixed(2) + " £";
}


/*
    TODO: list items add to the top instead of the bottom
            
        2. add the function enter to the "save" button

        3. from saved list with "dbl" click also delete the ol

        4. put the list in table

        5. random: same "products" same prices

        6. save saved list in browser javascript (menu)
        https://www.geeksforgeeks.org/save-files-in-electronjs/+
*/

