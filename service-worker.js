if('function' === typeof importScripts)
  importScripts('./localForage/dist/localforage.min.js');

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



async function deleting(){

  if(!!await localforage.getItem("active")){

    //get Excludelist from LocalForage
    let excludeList = JSON.parse(await localforage.getItem("origins"));

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
