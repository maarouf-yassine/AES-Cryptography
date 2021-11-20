function $(id) {
    return document.getElementById(id);
}

window.onload = function () {

    createInputTable('plaintext-table',0);
    createInputTable('key-table', 128);


    var encryptButton = document.getElementById('encrypt');
    encryptButton.onclick = encrypt;
    
    var decryptButton = document.getElementById('decrypt');
    decryptButton.onclick = decrypt;
    

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

    var lenOfRow;

    if (sizeOfKey==0 || sizeOfKey==128) lenOfRow = 16;
    else if (sizeOfKey==192) lenOfRow = 24; 
    else lenOfRow = 32;

    for (let i=0; i<lenOfRow; i++) {

        var inputArea = document.createElement('input');
        inputArea.setAttribute('maxlength', '2');
        inputArea.setAttribute('size', '1.5');
        inputArea.setAttribute('class', tableElement.split('-')[0]); //i.e. plaintext or key
        inputArea.setAttribute('value', '11');

        var td = document.createElement('td');
        td.appendChild(inputArea);
        tr.appendChild(td); //add box to row
    }
    table.appendChild(tr);


}

function createOutputTable(resultMatrix,header,id) {
    
    //alert("resultMatrix = "+resultMatrix);
    //alert("typeOf(resultMatrix) = "+typeof(resultMatrix));
    
    var container = document.getElementsByClassName('container')[1]; //i.e. container of the output result
    
    if ($(id) != null) {
        var table = $(id);
        while (table.lastChild) {
            table.removeChild(table.lastChild);
        }
        container.removeChild(table)
    } else {
        createH3(header,1);
    }

    var table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('id', 'ciphertext-table')
    

    var headers = document.createElement('tr');
    headers.classList.add('headersOfOutput');
    
    for (let i=0; i<4; i++) { //for loop to form W1 W2 W3 W4
        var ti = document.createTextNode('W'+(i+1));
        var wi = document.createElement('td');
        wi.appendChild(ti);
        headers.appendChild(wi);
    }
    table.appendChild(headers);


    for (let i=0; i<4; i++) { //for loop to fill the table
        //the output presented as columns W1, W2, W3, W4:
        // W1 W2 W3 W4
        // 0  4  8  12
        // 1  5  9  13
        // 2  6  10 14
        // 3  7  11 15 
        
        var tr = document.createElement('tr');
        
        var td1 = document.createElement('td');
        td1.innerHTML = resultMatrix[i];
        tr.appendChild(td1);

        var td2 = document.createElement('td');
        td2.innerHTML = resultMatrix[i+4];
        tr.appendChild(td2);

        var td3 = document.createElement('td');
        td3.innerHTML = resultMatrix[i+8];
        tr.appendChild(td3);

        var td4 = document.createElement('td');
        td4.innerHTML = resultMatrix[i+12];
        tr.appendChild(td4);

        table.appendChild(tr);

    }
    container.appendChild(table);
    

}

function createRoundTable(resultMatrix,header,id, roundNumber){
    var container = document.getElementsByClassName('container')[0]; //i.e. container of the inputs
    
    if ($(id) != null) {
        var table = $(id);
        while (table.lastChild) {
            table.removeChild(table.lastChild);
        }
        container.removeChild(table)
    } else {
        createH3("Round "+roundNumber+":"+header,0);
    }
    var table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('id', id)

    var headers = document.createElement('tr');
    headers.classList.add('headersOfOutput');
    
    for (let i=0; i<4; i++) { //for loop to form W1 W2 W3 W4
        var ti = document.createTextNode('W'+(i+1));
        var wi = document.createElement('td');
        wi.appendChild(ti);
        headers.appendChild(wi);
    }
    table.appendChild(headers);


    for (let i=0; i<4; i++) { //for loop to fill the table
        //the output presented as columns W1, W2, W3, W4:
        // W1 W2 W3 W4
        // 0  4  8  12
        // 1  5  9  13
        // 2  6  10 14
        // 3  7  11 15 
        
        var tr = document.createElement('tr');
        
        var td1 = document.createElement('td');
        td1.innerHTML = resultMatrix[i];
        tr.appendChild(td1);

        var td2 = document.createElement('td');
        td2.innerHTML = resultMatrix[i+4];
        tr.appendChild(td2);

        var td3 = document.createElement('td');
        td3.innerHTML = resultMatrix[i+8];
        tr.appendChild(td3);

        var td4 = document.createElement('td');
        td4.innerHTML = resultMatrix[i+12];
        tr.appendChild(td4);

        table.appendChild(tr);

    }
    container.appendChild(table);
}

function getBinary4DigitNum (inp){
    //input string e.g. '1' & output string e.g. '0001'

    if (inp=="0") return '0000';
    if (inp=="1") return '0001';
    else if (inp=="2") return '0010';
    else if (inp=="3") return '0011';
    else if (inp=="4") return '0100';
    else if (inp=="5") return '0101';
    else if (inp=="6") return '0110';
    else if (inp=="7") return '0111';
    else if (inp=="8") return '1000';
    else if (inp=="9") return '1001';
    else if (inp=="A" || inp=="a" ) return '1010';
    else if (inp=="B" || inp=="b") return '1011';
    else if (inp=="C" || inp=="c") return '1100';
    else if (inp=="D" || inp=="d") return '1101';
    else if (inp=="E" || inp=="e") return '1110';
    else if (inp=="F"|| inp=="f") return '1111';
    else {
        alert("Your input plaintext/key should only contain characters 0,1,2,3,4,5,6,7,8,9,A,B,C,D,E, or F");
        return;
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

function createH3(h3,containerNumber) {
    //containerNumber is 1 in case we want to create header in **output** side(right)
    //containerNumber is 0 in case we want to create header in **input** side (left)
    var header = document.createElement('h3');
    header.innerHTML = h3;
    var parent = document.getElementsByClassName('container')[containerNumber];
    parent.appendChild(header);
}

function encrypt() {

    let key = getArrayOfHexadecimals(getKey());
    let block = getArrayOfHexadecimals(getPlaintext());

    ExpandKey(key);
    Encrypt(block,key);
    let finalEncryption = convertBlockToHex(block);

    
    //console.log("Plaintext = "+getPlaintext());
    //console.log("Key = "+getKey());
    //console.log("Expanded Key = "+key);
    //console.log("Encryption = "+finalEncryption);

    createOutputTable(finalEncryption, 'Resulting Ciphertext Matrix:', 'ciphertext-table');
    //alert(finalEncryption);
}

function decrypt() {

    let key = getArrayOfHexadecimals(getKey());
    let block = getArrayOfHexadecimals(getPlaintext());

    Init();
    //let key = [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11]
    //let block = [0xe5,0x6e,0x26,0xf5,0x60,0x8b,0x8d,0x26,0x8f,0x25,0x56,0xe1,0x98,0xa0,0xe0,0x1b]

    ExpandKey(key);
    let result = convertBlockToHex(Decrypt(block,key));
    
    createOutputTable(result, 'Resulting Matrix:', 'ciphertext-table');
    Done();
    
    //ExpandKey(key);
    //alert("Expanded Key: "+key);
    //Encrypt(block,key)
    //let result = Decrypt (block,key)
    //result = convertBlockToHex(result) 
    //console.log(convertBlockToHex(block))

}

