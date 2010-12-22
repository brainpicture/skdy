var Browser = (function() {

var regs = {
  '//': new RegExp('//', 'g')
}

var browsers = 0;

function Browser(cont) {
  this.id = browsers += 1;
  this.cont = cont;
  var self = this;
  this.cont.bind({
    dragenter: function(e) {
      $(this).addClass('upload');
      return false;
    },
    dragover: function() {
      return false;
    },
    dragleave: function() {
      $(this).removeClass('upload');
      return false;
    },
    drop: function(e) {
      $(this).removeClass('upload');
      var dt = e.originalEvent.dataTransfer;
      var upl = new Uploader(dt, self.path);
      return false;
    }
  });
}

Browser.prototype.go  = function(obj) {
  var dirname = obj.innerHTML;
  var path = this.path;
  if (dirname == '../') {
    var deep = path.lastIndexOf('/');
    if (deep != -1) {
      path = path.slice(0, deep);
    }
  } else {
    path = (path + '/' + dirname).replace(regs['//'], '/');
  }
  this.render(path);
}

Browser.prototype.select  = function(obj) {
  obj = $(obj);
  if (obj.hasClass('selected')) {
    return;
  }
  if (this.oldSel) {
    this.oldSel.removeClass('selected');
  }
  obj.addClass('selected');
  this.oldSel = obj;
  this.actCol = obj.parent().attr('id').split('_')[3];
}

Browser.prototype.load = function(path, callback) {
  $.get('/folder', {path: path}, callback, 'json');
}

Browser.prototype.render = function(path) {
  var self = this;
  this.load(path, function(data) {
    if (data.type == 'dir') {
      self.path = path;
      var height = self.cont.height();
      var items = Math.ceil(height / 24) - 2;
      var html = '<div class="head">'+path+'</div>';
      var columns  = [];
      var col = 0;
      var items = data.content;
      for (var i in items) {
        if (items[i][0] == '.' && items[i] != '../') {
          continue;
        }
        columns.push('<a onclick="bwr.go(this);" onmousemove="bwr.select(this);">'+items[i]+'</a>');
      }
      html += columns.join('');
      self.cont.html(html);
    } else {
      var edit = new Editor(data, document.getElementById('tab1'));
    }
  });
}

return Browser;

})();
