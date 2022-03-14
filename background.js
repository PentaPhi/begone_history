chrome.runtime.onStartup.addListener(function() {
    deleting();
});

///Detect when all chrome windows close
chrome.windows.onRemoved.addListener(function(e){
  chrome.windows.getAll((windows)=>{
    if(windows.length == 0)
      deleting();
  });
});

//get Excludelist from LocalStorage
function getExcludeList(){
  return JSON.parse(localStorage.getItem("origins"));
}


function deleting(){
  if( JSON.parse(localStorage.getItem("active"))){
    chrome.browsingData.remove({},{
      "appcache": true,
      "cache": true,
      "downloads": true,
      "history": true,
    });

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
    });
  }
}
