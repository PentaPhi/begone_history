///Detect when all chrome windows close

chrome.windows.getAll( null, function(windows){
    num_windows = windows.length;
    console.log(num_windows)
});

chrome.windows.onCreated.addListener(function(e){
    num_windows++;
    console.log(num_windows)
});

chrome.windows.onRemoved.addListener(function(e){
    num_windows--;
    console.log(num_windows)
    if( num_windows == 0 ){
      deleting();
    }
});

//get Excludelist from LocalStorage
function getExcludeList(){
  return JSON.parse(localStorage.getItem("origins"));
}


function deleting(){
  chrome.browsingData.remove({},{
    "appcache": true,
    "cache": true,
    "downloads": true,
    "history": true,
  },(e)=>{console.log(e)})

  chrome.browsingData.remove({
    "excludeOrigins": getExcludeList()
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
