var fileToRemoveWhenComplete;

/*
** Listen for the message from the popup to open the downloads folder when done
*/
chrome.extension.onMessage.addListener( function(request,sender,sendResponse){
  if( request.message === "showDownloadsFolder" ){
    chrome.downloads.showDefaultFolder();
  }
});

/*
** Monitor all changes to the downloads folder. When you detect a completed download, alert the popup.
*/
chrome.downloads.onChanged.addListener(function(delta){
  if (delta.state && delta.state.current === "complete") {
    handleDownloadedFile(delta.id);
  }
});

function handleDownloadedFile(fileId){
  chrome.downloads.search({
    id: fileId
  }, function(results){
    fullFilename = results[0].filename;

    if(fullFilename.includes("csv")){
      splitFilename = fullFilename.split("/");
      reversedFilename = splitFilename.reverse();
      filename = reversedFilename[0];
      fileToRemoveWhenComplete = fileId; // Save to global var to use later
      sendMessage(filename);
    }
  })
}


function sendMessage(message){
  chrome.runtime.sendMessage({message: message});
}
