function $(id) {
    return document.getElementById(id);
}

window.onload = function () {

    createInputTable('plaintext-table',0);
    createInputTable('key-table', 128);


    var encryptButton = document.getElementById('encrypt');
    encryptButton.onclick = encrypt;

    $("keySize").onchange = changeKeySizeAndTable;
    
    
}

function changeKeySizeAndTable(){

    //need to remove the old default table to create new one 
    var Table = document.getElementById("key-table");
    Table.innerHTML = "";

    //create key table based on key size
    var keySize_string = $("keySize").value;
    if (keySize_string == '192bits') createInputTable('key-table', 192);
    else if (keySize_string == '256bits') createInputTable('key-table', 256);
    else createInputTable('key-table', 128);

}

function createInputTable(tableElement,sizeOfKey) {
    //size of key can be:
    // 0 --> this case is just to make the function work when creating the plaintext table
    // 128 bits
    // 192 bits
    // 256 bits

    var table = document.getElementById(tableElement);
    var tr = document.createElement('tr');

    table.appendChild(tr);

    var numOfInitialWords;

    if (sizeOfKey==0 || sizeOfKey==128) numOfInitialWords = 4;
    else if (sizeOfKey==192) numOfInitialWords = 6; 
    else numOfInitialWords = 8;

    for (let i=0; i<numOfInitialWords; i++) {

        //create table row 
        var tr = document.createElement('tr');
        var title = document.createTextNode('W'+(i+1));
        var td = document.createElement('td');
        td.appendChild(title);
        tr.appendChild(td);

        for (let j=0; j<4; j++) {
            var inputArea = document.createElement('input');
            inputArea.setAttribute('maxlength', '2');
            inputArea.setAttribute('size', '2');
            inputArea.setAttribute('class', tableElement.split('-')[0]); //i.e. plaintext or key
            inputArea.setAttribute('value', '11');

            var td = document.createElement('td');

            td.appendChild(inputArea);
            tr.appendChild(td); //add box to row
        }
        table.appendChild(tr);
    }
}

function createOutputTable(resultMatrix) {
    var container = document.getElementsByClassName('container')[0];
    if ($('ciphertext-table') != null) {
        var table = $('ciphertext-table');
        while (table.lastChild) {
            table.removeChild(table.lastChild);
        }
        container.removeChild(table)
    }

    var table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('id', 'ciphertext-table')
    var tr = document.createElement('tr');

    table.appendChild(tr);
    for (let i=0; i<4; i++) {
        var tr = document.createElement('tr');

        var title = document.createTextNode('W'+(i+1));
        var td = document.createElement('td');
        td.appendChild(title);
        tr.appendChild(td);
        
        for (let j=0; j<4; j++) {
            var outputValue = document.createTextNode(resultMatrix[i+j]);

            var td = document.createElement('td');

            td.appendChild(outputValue);
            tr.appendChild(td);
        }
        table.appendChild(tr);
        container.appendChild(table);
    }
}

function getBinary4DigitNum (inp){
    //input string e.g. '1' & output string e.g. '0001'

    if (inp=="1") return '0001';
    else if (inp=="2") return '0010';
    else if (inp=="3") return '0011';
    else if (inp=="4") return '0100';
    else if (inp=="5") return '0101';
    else if (inp=="6") return '0110';
    else if (inp=="7") return '0111';
    else if (inp=="8") return '1000';
    else if (inp=="9") return '1001';
    else if (inp=="A") return '1010';
    else if (inp=="B") return '1011';
    else if (inp=="C") return '1100';
    else if (inp=="D") return '1101';
    else if (inp=="E") return '1110';
    else if (inp=="F") return '1111';
    else {
        alert("Your input plaintext/key should only contain characters 1,2,3,4,5,6,7,8,9,A,B,C,D,E, or F");
    }
}

function getKey(){ // returns inputted key as array, but each element is converted to decimal, e.g. '11' becomes 17

    let userInput = document.getElementsByClassName('key');
    let key = [];

    for (let i=0; i<userInput.length; i++) {
        
        let byte = userInput[i].value; //type = string, e.g. '11'

        let letter1 = byte[0]; //e.g. '1'
        let bin_string1 = getBinary4DigitNum(letter1); // e.g. '0001'
        let letter2 = byte[1]; 
        let bin_string2 = getBinary4DigitNum(letter2);

        let bin_string = bin_string1 + bin_string2; //e.g. '00010001'

        byte_in_decimal = 0;
        for (let i=0; i<bin_string.length; i++) {
            if (bin_string[i]== '1') {
                byte_in_decimal += 2**(7-i); //e.g. '00010001' will become 1*2^0 + 1*2^4 = 17
        }}

        key.push(byte_in_decimal);
    }
    return key;
}

function getPlaintext() {

    let userInput = document.getElementsByClassName('plaintext');
    let plain_text = [];

    for (let i=0; i<userInput.length; i++) {
        
        let byte = userInput[i].value; //type = string, e.g. '11'

        let letter1 = byte[0]; //e.g. '1'
        let bin_string1 = getBinary4DigitNum(letter1); // e.g. '0001'
        let letter2 = byte[1]; 
        let bin_string2 = getBinary4DigitNum(letter2);

        let bin_string = bin_string1 + bin_string2; //e.g. '00010001'

        byte_in_decimal = 0;
        for (let i=0; i<bin_string.length; i++) {
            if (bin_string[i]== '1') {
                byte_in_decimal += 2**(7-i); //e.g. '00010001' will become 1*2^0 + 1*2^4 = 17
        }}

        plain_text.push(byte_in_decimal);
    }
    return plain_text;

}

function getArrayOfHexadecimals(arrayOfDecimals) {
    //creates an array of hexadecimals

    hex_array = [];

    for (let i=0; i<arrayOfDecimals.length; i++) {
        let hex_string = arrayOfDecimals[i].toString(16); //decimal to hexadecimal string
        hex_array.push(parseInt(hex_string, 16)); 

    }
    return hex_array;

}

function encrypt() {

    let key = getArrayOfHexadecimals(getKey());
    let block = getArrayOfHexadecimals(getPlaintext());

    ExpandKey(key);
    Encrypt(block,key);
    let finalEncryption = convertBlockToHex(block);
    
    alert("Plaintext = "+getPlaintext());
    alert("Key = "+getKey());
    alert("Expanded Key = "+key);
    alert("Encryption = "+finalEncryption);


}
