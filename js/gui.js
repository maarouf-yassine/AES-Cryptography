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
        createH3(header);
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

function createH3(h3) {
    var header = document.createElement('h3');
    header.innerHTML = h3;
    var parent = document.getElementsByClassName('container')[1];
    parent.appendChild(header);
}

function encrypt() {

    //let key = getArrayOfHexadecimals(getKey());
    //let block = getArrayOfHexadecimals(getPlaintext());

    //ExpandKey(key);
    //Encrypt(block,key);
    //let finalEncryption = convertBlockToHex(block);
    
    //console.log("Plaintext = "+getPlaintext());
    //console.log("Key = "+getKey());
    //console.log("Expanded Key = "+key);
    //console.log("Encryption = "+finalEncryption);

    //createOutputTable(finalEncryption, 'Resulting Ciphertext Matrix:', 'ciphertext-table');
    //alert(finalEncryption);
}

/*
$('#slides-shop').superslides({
    inherit_width_from: '.cover-slides',
    inherit_height_from: '.cover-slides',
    play: 5000,
    animation: 'fade',
});

$(".cover-slides ul li").append("<div class='overlay-background'></div>");

//! Superslides - v0.6.3-wip - 2013-12-17
//https://github.com/nicinabox/superslides
//Copyright (c) 2013 Nic Aitch; Licensed MIT 
(function(i,t){var n,e="superslides";n=function(n,e){this.options=t.extend({play:!1,animation_speed:600,animation_easing:"swing",animation:"slide",inherit_width_from:i,inherit_height_from:i,pagination:!0,hashchange:!1,scrollable:!0,elements:{preserve:".preserve",nav:".slides-navigation",container:".slides-container",pagination:".slides-pagination"}},e);var s=this,o=t("<div>",{"class":"slides-control"}),a=1;this.$el=t(n),this.$container=this.$el.find(this.options.elements.container);var r=function(){return a=s._findMultiplier(),s.$el.on("click",s.options.elements.nav+" a",function(i){i.preventDefault(),s.stop(),t(this).hasClass("next")?s.animate("next",function(){s.start()}):s.animate("prev",function(){s.start()})}),t(document).on("keyup",function(i){37===i.keyCode&&s.animate("prev"),39===i.keyCode&&s.animate("next")}),t(i).on("resize",function(){setTimeout(function(){var i=s.$container.children();s.width=s._findWidth(),s.height=s._findHeight(),i.css({width:s.width,left:s.width}),s.css.containers(),s.css.images()},10)}),s.options.hashchange&&t(i).on("hashchange",function(){var i,t=s._parseHash();i=s._upcomingSlide(t),i>=0&&i!==s.current&&s.animate(i)}),s.pagination._events(),s.start(),s},h={containers:function(){s.init?(s.$el.css({height:s.height}),s.$control.css({width:s.width*a,left:-s.width}),s.$container.css({})):(t("body").css({margin:0}),s.$el.css({position:"relative",overflow:"hidden",width:"100%",height:s.height}),s.$control.css({position:"relative",transform:"translate3d(0)",height:"100%",width:s.width*a,left:-s.width}),s.$container.css({display:"none",margin:"0",padding:"0",listStyle:"none",position:"relative",height:"100%"})),1===s.size()&&s.$el.find(s.options.elements.nav).hide()},images:function(){var i=s.$container.find("img").not(s.options.elements.preserve);i.removeAttr("width").removeAttr("height").css({"-webkit-backface-visibility":"hidden","-ms-interpolation-mode":"bicubic",position:"absolute",left:"0",top:"0","z-index":"-1","max-width":"none"}),i.each(function(){var i=s.image._aspectRatio(this),n=this;if(t.data(this,"processed"))s.image._scale(n,i),s.image._center(n,i);else{var e=new Image;e.onload=function(){s.image._scale(n,i),s.image._center(n,i),t.data(n,"processed",!0)},e.src=this.src}})},children:function(){var i=s.$container.children();i.is("img")&&(i.each(function(){if(t(this).is("img")){t(this).wrap("<div>");var i=t(this).attr("id");t(this).removeAttr("id"),t(this).parent().attr("id",i)}}),i=s.$container.children()),s.init||i.css({display:"none",left:2*s.width}),i.css({position:"absolute",overflow:"hidden",height:"100%",width:s.width,top:0,zIndex:0})}},c={slide:function(i,t){var n=s.$container.children(),e=n.eq(i.upcoming_slide);e.css({left:i.upcoming_position,display:"block"}),s.$control.animate({left:i.offset},s.options.animation_speed,s.options.animation_easing,function(){s.size()>1&&(s.$control.css({left:-s.width}),n.eq(i.upcoming_slide).css({left:s.width,zIndex:2}),i.outgoing_slide>=0&&n.eq(i.outgoing_slide).css({left:s.width,display:"none",zIndex:0})),t()})},fade:function(i,t){var n=this,e=n.$container.children(),s=e.eq(i.outgoing_slide),o=e.eq(i.upcoming_slide);o.css({left:this.width,opacity:0,display:"block"}).animate({opacity:1},n.options.animation_speed,n.options.animation_easing),i.outgoing_slide>=0?s.animate({opacity:0},n.options.animation_speed,n.options.animation_easing,function(){n.size()>1&&(e.eq(i.upcoming_slide).css({zIndex:2}),i.outgoing_slide>=0&&e.eq(i.outgoing_slide).css({opacity:1,display:"none",zIndex:0})),t()}):(o.css({zIndex:2}),t())}};c=t.extend(c,t.fn.superslides.fx);var d={_centerY:function(i){var n=t(i);n.css({top:(s.height-n.height())/2})},_centerX:function(i){var n=t(i);n.css({left:(s.width-n.width())/2})},_center:function(i){s.image._centerX(i),s.image._centerY(i)},_aspectRatio:function(i){if(!i.naturalHeight&&!i.naturalWidth){var t=new Image;t.src=i.src,i.naturalHeight=t.height,i.naturalWidth=t.width}return i.naturalHeight/i.naturalWidth},_scale:function(i,n){n=n||s.image._aspectRatio(i);var e=s.height/s.width,o=t(i);e>n?o.css({height:s.height,width:s.height/n}):o.css({height:s.width*n,width:s.width})}},l={_setCurrent:function(i){if(s.$pagination){var t=s.$pagination.children();t.removeClass("current"),t.eq(i).addClass("current")}},_addItem:function(i){var n=i+1,e=n,o=s.$container.children().eq(i),a=o.attr("id");a&&(e=a);var r=t("<a>",{href:"#"+e,text:e});r.appendTo(s.$pagination)},_setup:function(){if(s.options.pagination&&1!==s.size()){var i=t("<nav>",{"class":s.options.elements.pagination.replace(/^\./,"")});s.$pagination=i.appendTo(s.$el);for(var n=0;s.size()>n;n++)s.pagination._addItem(n)}},_events:function(){s.$el.on("click",s.options.elements.pagination+" a",function(i){i.preventDefault();var t,n=s._parseHash(this.hash);t=s._upcomingSlide(n,!0),t!==s.current&&s.animate(t,function(){s.start()})})}};return this.css=h,this.image=d,this.pagination=l,this.fx=c,this.animation=this.fx[this.options.animation],this.$control=this.$container.wrap(o).parent(".slides-control"),s._findPositions(),s.width=s._findWidth(),s.height=s._findHeight(),this.css.children(),this.css.containers(),this.css.images(),this.pagination._setup(),r()},n.prototype={_findWidth:function(){return t(this.options.inherit_width_from).width()},_findHeight:function(){return t(this.options.inherit_height_from).height()},_findMultiplier:function(){return 1===this.size()?1:3},_upcomingSlide:function(i,t){if(t&&!isNaN(i)&&(i-=1),/next/.test(i))return this._nextInDom();if(/prev/.test(i))return this._prevInDom();if(/\d/.test(i))return+i;if(i&&/\w/.test(i)){var n=this._findSlideById(i);return n>=0?n:0}return 0},_findSlideById:function(i){return this.$container.find("#"+i).index()},_findPositions:function(i,t){t=t||this,void 0===i&&(i=-1),t.current=i,t.next=t._nextInDom(),t.prev=t._prevInDom()},_nextInDom:function(){var i=this.current+1;return i===this.size()&&(i=0),i},_prevInDom:function(){var i=this.current-1;return 0>i&&(i=this.size()-1),i},_parseHash:function(t){return t=t||i.location.hash,t=t.replace(/^#/,""),t&&!isNaN(+t)&&(t=+t),t},size:function(){return this.$container.children().length},destroy:function(){return this.$el.removeData()},update:function(){this.css.children(),this.css.containers(),this.css.images(),this.pagination._addItem(this.size()),this._findPositions(this.current),this.$el.trigger("updated.slides")},stop:function(){clearInterval(this.play_id),delete this.play_id,this.$el.trigger("stopped.slides")},start:function(){var n=this;n.options.hashchange?t(i).trigger("hashchange"):this.animate(),this.options.play&&(this.play_id&&this.stop(),this.play_id=setInterval(function(){n.animate()},this.options.play)),this.$el.trigger("started.slides")},animate:function(t,n){var e=this,s={};if(!(this.animating||(this.animating=!0,void 0===t&&(t="next"),s.upcoming_slide=this._upcomingSlide(t),s.upcoming_slide>=this.size()))){if(s.outgoing_slide=this.current,s.upcoming_position=2*this.width,s.offset=-s.upcoming_position,("prev"===t||s.outgoing_slide>t)&&(s.upcoming_position=0,s.offset=0),e.size()>1&&e.pagination._setCurrent(s.upcoming_slide),e.options.hashchange){var o=s.upcoming_slide+1,a=e.$container.children(":eq("+s.upcoming_slide+")").attr("id");i.location.hash=a?a:o}e.$el.trigger("animating.slides",[s]),e.animation(s,function(){e._findPositions(s.upcoming_slide,e),"function"==typeof n&&n(),e.animating=!1,e.$el.trigger("animated.slides"),e.init||(e.$el.trigger("init.slides"),e.init=!0,e.$container.fadeIn("fast"))})}}},t.fn[e]=function(i,s){var o=[];return this.each(function(){var a,r,h;return a=t(this),r=a.data(e),h="object"==typeof i&&i,r||(o=a.data(e,r=new n(this,h))),"string"==typeof i&&(o=r[i],"function"==typeof o)?o=o.call(r,s):void 0}),o},t.fn[e].fx={}})(this,jQuery);

*/