let Sbox = new Array(99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22);
let ShiftRowTab = new Array(0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11);

let Sbox_Inv = new Array(256);
let ShiftRowTab_Inv = new Array(16);
let xtime = new Array(256);

function Init(){
    for (var i = 0; i < 256; i++)
    Sbox_Inv[Sbox[i]] = i;

    for (var i = 0; i < 16; i++)
    ShiftRowTab_Inv[ShiftRowTab[i]] = i;

    
    for (var i = 0; i < 128; i++) {
        xtime[i] = i << 1;
        xtime[128 + i] = (i << 1) ^ 0x1b;
    }
}

function Done(){
    delete Sbox_Inv;
    delete ShiftRowTab_Inv;
    delete xtime;
}

function ExpandKey(key) {
    var kl = key.length,
        ks, Rcon = 1;
    switch (kl) {
    case 16:
        ks = 16 * (10 + 1);
        break;
    case 24:
        ks = 16 * (12 + 1);
        break;
    case 32:
        ks = 16 * (14 + 1);
        break;
    default:
        alert("ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!");
    }
    for (var i = kl; i < ks; i += 4) {
        var temp = key.slice(i - 4, i);
        if (i % kl == 0) {
            temp = new Array(Sbox[temp[1]] ^ Rcon, Sbox[temp[2]], Sbox[temp[3]], Sbox[temp[0]]);
            if ((Rcon <<= 1) >= 256) Rcon ^= 0x11b;
        }
        else if ((kl > 24) && (i % kl == 16)) temp = new Array(Sbox[temp[0]], Sbox[temp[1]], Sbox[temp[2]], Sbox[temp[3]]);
        for (var j = 0; j < 4; j++)
        key[i + j] = key[i + j - kl] ^ temp[j];
    }
}

function Encrypt(block, key) {
    var l = key.length;
    //Round 0
    AddRoundKey(block, key.slice(0, 16));
    //    console.log("AddRoundKey:"+convertBlockToHex(block))
    for (var i = 16; i < l - 16; i += 16) {
        SubBytes(block, Sbox);
    //    console.log("S-box:"+convertBlockToHex(block))
        ShiftRows(block, ShiftRowTab);
    //    console.log("Shift-Rows:"+convertBlockToHex(block))
        MixColumns(block);
    //    console.log("Mix-Columns:"+convertBlockToHex(block))
        AddRoundKey(block, key.slice(i, i + 16));
    //    console.log("AddRoundKey:"+convertBlockToHex(block))
    }
    SubBytes(block, Sbox);
    ShiftRows(block, ShiftRowTab);
    AddRoundKey(block, key.slice(i, l));
}

function Decrypt(block, key) {
    var l = key.length;
    AddRoundKey(block, key.slice(l - 16, l));
    ShiftRows(block, ShiftRowTab_Inv);
    SubBytes(block, Sbox_Inv);
    for (var i = l - 32; i >= 16; i -= 16) {
        AddRoundKey(block, key.slice(i, i + 16));
        MixColumns_Inv(block);
        ShiftRows(block, ShiftRowTab_Inv);
        SubBytes(block, Sbox_Inv);
    }
    AddRoundKey(block, key.slice(0, 16));
}

function SubBytes(state, sbox) {
    for (var i = 0; i < 16; i++)
    state[i] = sbox[state[i]];
}

function AddRoundKey(state, rkey) {
    for (var i = 0; i < 16; i++){
        state[i] ^= rkey[i];
    }
}

function ShiftRows(state, shifttab) {
    var h = new Array().concat(state);
    for (var i = 0; i < 16; i++)
    state[i] = h[shifttab[i]];
}

function MixColumns(state){
    for (var c=0; c<16; c+=4) {
        var a = new Array(4);  // 'a' is a copy of the current column from 's'
        var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
        for (var i=0; i<4; i++) {
            a[i] = state[c+i];
            b[i] = state[c+i]&0x80 ? state[c+i]<<1 ^ 0x011b : state[c+i]<<1;  
        }
        // a[n] ^ b[n] is a•{03} in GF(2^8)
        state[c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
        state[c+1] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
        state[c+2] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
        state[c+3] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
    }
}
/*function MixColumns(state) {
    for (var i = 0; i < 16; i += 4) {
        var s0 = state[i + 0],
            s1 = state[i + 1];
        var s2 = state[i + 2],
            s3 = state[i + 3];
        console.log(decimalToHexString(s0),decimalToHexString(s1),decimalToHexString(s2),decimalToHexString(s3))
        var h = s0 ^ s1 ^ s2 ^ s3;
        state[i + 0] ^= h ^ xtime[s0 ^ s1];
        state[i + 1] ^= h ^ xtime[s1 ^ s2];
        state[i + 2] ^= h ^ xtime[s2 ^ s3];
        state[i + 3] ^= h ^ xtime[s3 ^ s0];
    }
}*/

function MixColumns_Inv(state) {
    for (var i = 0; i < 16; i += 4) {
        var s0 = state[i + 0],
            s1 = state[i + 1];
        var s2 = state[i + 2],
            s3 = state[i + 3];
        var h = s0 ^ s1 ^ s2 ^ s3;
        var xh = xtime[h];
        var h1 = xtime[xtime[xh ^ s0 ^ s2]] ^ h;
        var h2 = xtime[xtime[xh ^ s1 ^ s3]] ^ h;
        state[i + 0] ^= h1 ^ xtime[s0 ^ s1];
        state[i + 1] ^= h2 ^ xtime[s1 ^ s2];
        state[i + 2] ^= h1 ^ xtime[s2 ^ s3];
        state[i + 3] ^= h2 ^ xtime[s3 ^ s0];
    }
}
function decimalToHexString(num){
    return num.toString(16)
}
function hexToDecimal(num){
    return parseInt(num, 16);
}
function convertBlockToHex(block){    
    let test = block.slice()
    for (var i =0 ; i< block.length; i++ ){
        test[i] = decimalToHexString(block[i]) 
    }
    return test
}

let key = [0x54, 0x68, 0x61, 0x74, 0x73, 0x20, 0x6D, 0x79, 0x20, 0x4B,0x75, 0x6E,0x67, 0x20, 0x46, 0x75]
let block = [0x54, 0x77, 0x6F,0x20, 0x4F,0x6E,0x65, 0x20, 0x4E,0x69, 0x6E,0x65,0x20,0x54,0x77,0x6F]
ExpandKey(key)
Encrypt(block,key)
console.log(convertBlockToHex(block))