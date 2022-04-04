function newElement(text) {
  var li = document.createElement("li");
  var inputValue = text;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
  } else {
    document.getElementById("list").appendChild(li);
  }
  document.getElementById("originInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      origins = origins.filter(e => e !== this.parentElement.textContent.split("×")[0]);
      update(origins);
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

function update(origins){
  localforage.setItem("origins", JSON.stringify(origins));
}

function setAuto(value){
  localforage.setItem("active", value);
}

async function getAuto(){
  return await localforage.getItem("active");
}


function newInput() {
  let url = document.getElementById("originInput").value
  if(validURL(url)){
    newElement(url);
    origins.push(url);
    update(origins);
    document.getElementsByClassName("error")[0].classList.remove("erroranim")
  }else{
    document.getElementsByClassName("error")[0].classList.add("erroranim")
  }
}

function switchBox() {
  let value = document.getElementsByClassName("toggle-checkbox")[0].checked;
  setAuto(value);
}

//check if input is valid
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*','i'); //
  return !!pattern.test(str);
}

async function getExcludeList(){
  if(!!localStorage.getItem("origins")){
    localforage.setItem("origins",localStorage.getItem("origins"));
    localStorage.removeItem("origins");
    localforage.setItem("active",false)
  }
  return JSON.parse(await localforage.getItem("origins"));
}


//wipe
async function deleting(){
  chrome.browsingData.remove({},{
    "appcache": true,
    "cache": true,
    "downloads": true,
    "history": true,
  },(e)=>{console.log(e)})

  chrome.browsingData.remove({
    "excludeOrigins": await getExcludeList()
  }, {
    "cacheStorage": true,
    "cookies": true,
    "fileSystems": true,
    "indexedDB": true,
    "localStorage": true,
    "serviceWorkers": true,
    "webSQL": true
  }, (e)=>{console.log(e)});
}


//init list
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}
async function main(){

    //load origins to list
    origins = []
    if(!!await getExcludeList()){
        origins = await getExcludeList();
        for(let e of origins){
            newElement(e)
        }
    }else{
        update(origins);
    }

    //init button
    document.getElementsByClassName("toggle-checkbox")[0].checked = await getAuto();


    //set listeners

    //button listener
    document.getElementsByClassName("addBtn")[0].onclick = newInput
    document.getElementsByClassName("wipeBtn")[0].onclick = deleting
    document.getElementsByClassName("toggle-checkbox")[0].onclick = switchBox

    //keyboard listener
    var input = document.getElementById("originInput");
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            newInput();
        }
    });
}

main();
