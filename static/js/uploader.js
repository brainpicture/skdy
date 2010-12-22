var Uploader = function(dt, path) {
  var cont = $('#uploaders');
  //cont.append();
  this.path = path;
  var len = dt.files.length;
  for (var i = 0; i < len; i++) {
    var file =dt.files[i];
    this.uploadFile(file, '/upload');
  }
};

function onprogressHandler(evt) {
    var percent = event.loaded/event.total*100;
    console.log('Upload progress: ' + percent + '%');
    if (percent == 100) {
      setTimeout(function() {
        bwr.render(bwr.path);
      }, 200);
    }
}

Uploader.prototype.uploadFile = function(file, url) {
  var xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', onprogressHandler, false);
  var path = this.path + '/';
  path = path.replace(/\/\//g, '/');
  xhr.open('POST', url+'?path='+path+file.name, true);
  xhr.send(file); // Simple!
/*  var reader = new FileReader();
 
  reader.onload = function() {    
    var xhr = new XMLHttpRequest();    
    
    xhr.upload.addEventListener("progress", function(e) {
      if (e.lengthComputable) {
        var progress = (e.loaded * 100) / e.total;
      }
    }, false);
    

 
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if(this.status == 200) {
        } else {
        }
      }
    };
    
    xhr.open("POST", url);
    var boundary = "WebKitFormBoundaryR9QTpwbeQISfxmKV";    
    xhr.setRequestHeader("Content-Type", "multipart/form-data, boundary="+boundary);
    xhr.setRequestHeader("Cache-Control", "no-cache");    
    var body = "--" + boundary + "\r\n";
    body += "Content-Disposition: form-data; name=\"title\"\r\n\r\n\r\n";
    body += "--" + boundary + "\r\n";
    body += "Content-Disposition: form-data; name=\"upload\"; filename=\"" + file.name + "\"\r\n\r\n";
    body += reader.result + "\r\n";
    body += "--" + boundary + "--";
 
    if(xhr.sendAsBinary) {
      xhr.sendAsBinary(body);
    } else {
      xhr.send(body);
    }
  };
  reader.readAsBinaryString(file);
*/
}
