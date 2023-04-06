let shoppingList = {};

function saveshopping() {
    if (olshopping.childElementCount == 5) return;

    if (!shoppingfield.value.length == 0) {

        // Get the product name
        let productName = shoppingfield.value.trim();

        // Check if the product is already in the shopping list
        if (shoppingList[productName]) {
            // If the product already exists, use the existing price
            var price = shoppingList[productName];
        } else {
            // If the product doesn't exist, generate a new price and save it in the shopping list
            price = Math.random() * (59 - 20) + 20;
            shoppingList[productName] = price;
        }

        // Create the list item with the product name and price
        let inputfieldtext = document.createTextNode(productName + " (" + price.toFixed(2) + ' \xA3)');
        let listitem = document.createElement("li");
        listitem.appendChild(inputfieldtext);

        // Add the list item to the shopping list
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

function updateFinalSum() {
    // create a finalSum variable
    let finalSum = 0;
    // iterate through table (google: "how to iterate through every cell in a table in javacsript")
    let rows = document.getElementsByClassName("productrow");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        // parse every price and add it to finalsum
        let price = parseFloat(row.dataset.price);
        finalSum += price;
    }
    // update the sum table row with the new final sum
    if (finalSum == 0) {
        document.getElementById("total-cell").innerHTML = "Sum:";
    } else {
        document.getElementById("total-cell").innerHTML = finalSum.toFixed(2) + ' \xA3';
        //   document.getElementById("total-cell").innerHTML = (finalSum.toFixed(2))  + ' \xA3';
    }
}

function moveList() {
    mainList.className = mainList.className.replace("hidden", "");
    // move list from olshopping to savedlists
    // clear olshopping
    let listitem = document.createElement("li");
    let copyOfOlshopping = olshopping.cloneNode(true);
    if (copyOfOlshopping.childElementCount == 0) {
        return;
    }
    listitem.appendChild(copyOfOlshopping);

    // savedlists.appendChild(listitem);

    let shoppingList = document.getElementById("olshopping").childNodes;

    // iterate through list
    for (let child of shoppingList) {
        let row = savedProductsBody.insertRow(0);
        row.className = "productrow";
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let splitted = child.innerHTML.split('(');
        let name = splitted[0];
        let price = splitted[1];
        row.dataset.price = price;
        price = price.substring(0, price.length - 1);
        cell1.innerHTML = name;
        cell2.innerHTML = price;
    }

    updateFinalSum();

    // clearTimeout
    for (var i = 0; i < shoppingList.length; ++i) {
        $().append(moveList[i] + "<br/>");
        setTimeout(function () {
            // $(cell1).empty();
            // $(cell2).empty();
            $(savedProductsBody).empty();
            $(updateFinalSum).empty();
        }, 5000);
    }
    clearshopping();
    shoppingfield.value = "";
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////// 
const fileNameInput = document.querySelector('#fileName');

// Auf Submit-Ereignis des Formulars reagieren
document.querySelector('#fileNameForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Standard-Formular-Submit-Verhalten unterdrücken

    // Den eingegebenen Dateinamen abrufen
    const fileName = fileNameInput.value.trim();
    const shoppingListRows = document.querySelectorAll('#saved-products__body .productrow');

    // Wenn der Benutzer einen Dateinamen eingegeben hat und Produkte in der Liste vorhanden sind
    if (fileName && shoppingListRows.length > 0) {

        // Daten der aktuellen Einkaufsliste abrufen und in eine CSV-ähnliche Struktur umwandeln
        let subtotal = 0;
        const csvData = 'Product,Price,Pound\n' + Array.from(shoppingListRows).map(row => {
            const name = row.querySelector('td:first-child').textContent.trim();
            const priceWithSymbol = row.querySelector('td:last-child').textContent.trim();
            const price = priceWithSymbol.slice(0, -1).trim(); // das letzte Zeichen (Pfund-Symbol) entfernen und Leerzeichen am Anfang und Ende des Strings entfernen
            subtotal += parseFloat(price);
            return `${name},${price},\u00A3`;
        }).join('\n');

        // Gesamtbetrag berechnen und zum CSV-Data hinzufügen
        const totalRow = `All,${subtotal.toFixed(2)},\u00A3`;
        const csvDataWithTotal = csvData + '\n' + totalRow;

        // Eine neue Datei mit dem Dateinamen erstellen und die Daten speichern
        const file = new Blob([csvDataWithTotal], { type: 'text/csv' });
        const fileURL = URL.createObjectURL(file);

        // Eine neue Liste erstellen, um die gespeicherten Einkaufslisten anzuzeigen
        const savedLists = document.querySelector('#saved-lists');
        const newListElement = document.createElement('li')
        const newListLink = document.createElement('a');
        newListLink.href = fileURL;
        newListLink.download = fileName + '.csv'; // Hier wird der Dateiname um ".csv" erweitert
        newListLink.innerHTML = fileName;
        newListElement.appendChild(newListLink);
        savedLists.insertBefore(newListElement, savedLists.firstChild); // Die neue Liste am Anfang der Liste der gespeicherten Listen einfügen

        // Die Subtotal und Total in der Tabelle aktualisieren
        const subtotalCell = document.createElement('td');
        subtotalCell.innerHTML = "Sum:";
        const totalCell = document.querySelector('#total-cell');
        totalCell.innerHTML = '';
        totalCell.appendChild(subtotalCell);
        const totalValueCell = document.createElement('td');
        totalValueCell.innerHTML = '\u00A3' + subtotal.toFixed(2);
        totalCell.appendChild(totalValueCell);
    }

    // Eingabe des Nutzers löschen
    shoppingListRows.forEach(row => row.remove());
    fileNameInput.value = "";
    updateFinalSum() === "";
});



function clearFileList() {
    const savedLists = document.querySelector('#saved-lists');// Die obere const wird deshalb nicht direkt akzeptiert, da die diie sich in einer function befindet (deshalb ausserhalb des funktion der class nochmal in einer const schreiben)
    while (savedLists.firstChild) {
        savedLists.removeChild(savedLists.firstChild);
    }
}

//#region EventListeners

shoppingForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('submit');
    console.log(olshopping.childElementCount);
    if (olshopping.childElementCount == 0) return;
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

document.getElementById('clearFile').addEventListener('click', () => {
    clearFileList();
})


/*// Remove Item handler

savedProductsBody.addEventListener('dblclick', (e) => {
    //console.log("dbclick");
    e.target.remove();
    if (savedProductsBody.children.length == 0) {
        savedProductsBody.className = '';
        olshopping.remove();

    }
    if (copyOfOlshopping.children.length == 0) {
        copyOfOlshopping.className = '';
    }

});*/

//#endregion EventListeners


/* TODO:
    TODO: list items add to the top instead of the bottom
        1. 
*/

/* comleted LISTS:

1)  - add the function enter to the "save" button
    - add the function shift to the "" button

2)  - put the list in table

3)  - insert clearTimeout()

4)  - random: same "products" same prices

5)  - save saved list in browser javascript (menu) =>csv (COMPLETED!!!)

6)  - if einbauen; wenn in saved lists kein wert steht (if (!shoppingfield.value.length == 0) {}) dann den button nicht ausführen!!!!!!!!

*/

/*OTHER METHOD METHOD FOR ALLOCATION OF THE PRODUCTS AND PRICES

      console.log("======");
    let i = 0;
    for(let child of shoppingList){
        console.log(i++ ,"->", child);
    }

    console.log("======");
    for(let i = 0; i < shoppingList.length; i++){
        console.log(i ,"->", shoppingList[i]);
    }
    console.log("======");
 */

