/*
 * Courtesy http://pipetree.com/qmacro/blog/2013/10/sheetasjson-google-spreadsheet-data-as-json/
 */

function doGet(request) {
    var output = ContentService.createTextOutput();
    var data = {};
    var id = request.parameters.id;
    var sheet = request.parameters.sheet;
    var ss = SpreadsheetApp.openById(id);
    if (sheet) {
      data[sheet] = readData_(ss, sheet);
    } else {
      // Grab all sheets except those with a name
      // that starts with an underscore
      ss.getSheets().forEach(function(oSheet, iIndex) {
        var sName = oSheet.getName();
        if (! sName.match(/^_/)) {
          data[sName] = readData_(ss, sName);
        }
      })
    }
    var callback = request.parameters.callback;
    if (callback == undefined) {
      output.setContent(JSON.stringify(data));
      output.setMimeType(ContentService.MimeType.JSON);
    }
    else {
      output.setContent(callback + "(" + JSON.stringify(data) + ")");
      output.setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return output;
  }
  
  
  function readData_(ss, sheetname, properties) {
  
    if (typeof properties == "undefined") {
      properties = getHeaderRow_(ss, sheetname);
      properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
    }
    
    var rows = getDataRows_(ss, sheetname);
    var data = [];
    for (var r = 0, l = rows.length; r < l; r++) {
      var row = rows[r];
      var record = {};
      for (var p in properties) {
        record[properties[p]] = convert_(row[p]);
      }
      data.push(record);
    }
    return data;
  }
  
  
  function convert_(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }
  
  
  function getDataRows_(ss, sheetname) {
  
    var sh = ss.getSheetByName(sheetname);
    return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
  
  }
  
  
  function getHeaderRow_(ss, sheetname) {
  
    var sh = ss.getSheetByName(sheetname);
    return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  
  }
  

