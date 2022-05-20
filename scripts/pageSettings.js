
// cancel scrolling with keyboard
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);



// handle move between pages
$(document).ready(function() {
    document.getElementById('register').style.display = "none";
    document.getElementById('login').style.display = "none";
    document.getElementById('game').style.display = "none";
    document.getElementById('settings').style.display = "none";
});

function SetActiveDiv(el) {
    document.getElementById('welcome').style.display = "none";
    document.getElementById('register').style.display = "none";
    document.getElementById('login').style.display = "none";
    document.getElementById('game').style.display = "none";
    document.getElementById('settings').style.display = "none";

    document.getElementById(el).style.display = "block";
}


// random game settings
$(document).ready(function() {
    $("#rand").click(function(){
        var select = document.getElementById('dots');
        var items = select.getElementsByTagName('option');
        var index = Math.floor(Math.random() * items.length);
        select.selectedIndex = index;
        select = document.getElementById('ghosts');
        items = select.getElementsByTagName('option');
        index = Math.floor(Math.random() * items.length);
        select.selectedIndex = index;
        var dotcolor=document.getElementById("5color");
        dotcolor.value='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
        dotcolor=document.getElementById("15color");
        dotcolor.value='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
        dotcolor=document.getElementById("25color");
        dotcolor.value='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
        var Time=document.getElementById("setTm")
        Time.value=getRandomInt(60,3600);
    });

    $("#play").click(function(){
        let tSet = $( "#setTm" ).val();
        if(tSet<60){
            alert("Time must be at least 60 secends");
            return;
        }
        document.getElementById('playA').style.visibility = "hidden";
		document.getElementById('playA').disabled = true;
        SetActiveDiv('game');
        Start();
        synchronizeSettings();
    });
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return ""+Math.floor(Math.random() * (max - min) + min);
}

// update other settings window
function synchronizeSettings(){
    var select = document.getElementById('dots');
    var items = select.getElementsByTagName('option');
    var select2=document.getElementById('dots2')
    select2.selectedIndex=select.selectedIndex;
    select = document.getElementById('ghosts');
    select2=document.getElementById('ghosts2')
    items = select.getElementsByTagName('option');
    select2.selectedIndex=select.selectedIndex;
    var dotcolor=document.getElementById("5color");
    var dotcolor2=document.getElementById("5color2")
    dotcolor2.value=dotcolor.value
    dotcolor=document.getElementById("15color");
    dotcolor2=document.getElementById("15color2")
    dotcolor2.value=dotcolor.value
    dotcolor=document.getElementById("25color");
    dotcolor2=document.getElementById("25color2")
    dotcolor2.value=dotcolor.value
    var Time=document.getElementById("setTm")
    document.getElementById("setTm2").value=Time.value
}



// handle about pop up
function popUp() { 
    document.getElementById("myDialog").showModal(); 
} 

function closePopUp() { 
    document.getElementById("myDialog").close(); 
}

$(document).ready(function() {
    $("#myDialog").click(function(e) {
        if (e.target.classList.contains("dialogComponent")){
            document.getElementById("myDialog").close(); 
        }
    });
});

// change game keyboard
function changeKey(key){
    $(document).keydown(function(event){
        key_pressed = event.keyCode;
        //if(key == "up")
        alert(key_pressed);
        return;
    });
}
