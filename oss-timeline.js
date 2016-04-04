// Copyright (C) 2011-2012  Gunnar Hellekson
// Licensed under the Creative Commons Attribution-ShareAlike 3.0 License.
// See the file COPYING for details.

SimileAjax.History.enabled = false;
var gEventSource;

var SHEET_AS_JSON_URL = 'https://script.google.com/macros/s/AKfycbzh43ijzVB3FheF5rSrM7vh4PXzJu2WokOCIpFao_17fBLfD4Nu/exec?';

var EVENT_SPREADSHEET_KEY = '10ypjj1ofXYTtshH96qwyS9XvRNDDyvrwaCJSKjewiYQ';
var EVENT_SHEET_NAME = 'Published';

var PROJECT_SPREADSHEET_KEY = '1-z0AiiGbiW8aCcXjupeHVoH_g5LadO2K2dmyIIPuaRY';
var PROJECT_SHEET_NAME = 'gov-oss.org';

var EVENT_FEED_URL = SHEET_AS_JSON_URL + 'id=' + EVENT_SPREADSHEET_KEY + '&sheet=' + EVENT_SHEET_NAME;

function loadProjectsWorksheetJSON(json) {
  var entries = json["gov-oss.org"];
  var timelinerEntries = [];
  for (var i = 0; i < entries.length; ++i) {
    var entry = entries[i];

    // these values come from the spreadsheet
    var projectName = entry["Project_Name/Acronym"];
    var jurisdiction = entry["Jurisdiction_Level"];
    var organization = entry["Org/Department"];
    var license = entry["OSS_License(s)"];
    var url = entry["URL"];
    var dateAdded = convertFromGDataDate(entry["Date_Added"]);
    var releaseDate = convertFromGDataDate(entry["Release_Date"]);
    var whatItDoes = entry["What_it_does"];
    var notes = entry["Notes"];

    // these values we set based on the spreadsheet values
    var color = null;
    var image = "project.png";
    var icon = "project-icon.png";
    var classname = 'project';
    var description = '';


    if (organization) {
       projectName = projectName + ' (' + organization + ')';
       description = description + '<p><b>Released by: </b> ' + organization;
       if (jurisdiction)
          description = description + ' (' + jurisdiction + ')';
       description = description + '</p>';
    }

    if (releaseDate)
       description = description + '<p><b>Release Date</b>: ' + releaseDate + '</p>';

    if (license)
       description = description + '<p><b>License</b>: ' + license + '</p>';

    if (whatItDoes)
       description = description + '<p><b>What it does</b><br />' + whatItDoes + '</p>';

    if (notes)
       description = description + '<p><b>Notes</b><br />' + notes + '</p>';

    var event = new Timeline.DefaultEventSource.Event({
      title: projectName,
      text: projectName,
      description: description,
      classname: classname,
      instant: true,
      start: releaseDate,
      end: null, 
      latestStart: null,
      latestEnd: null, 
      isDuration: false, 
      image: image,
      link: url,
      icon: icon,
      color: color, 
      textColor: undefined
    });
    timelinerEntries.push(event);
  }
  gEventSource.addMany(timelinerEntries);
}

function loadEventsWorksheetJSON(json) {
  var entries = json.Published;
  var timelinerEntries = [];
  for (var i = 0; i < entries.length; ++i) {
    var entry = entries[i];

    // these values come from the spreadsheet
    var start = convertFromGDataDate(entry.start);
    var title = entry.title;
    var description = entry.headline;
    var type = entry.type;
    var link = entry.link;
    var status = entry.status;

    // these values we set based on the spreadsheet values
    var classname = null;
    var color = null;
    var image = null;
    var icon = null;

    // Now determine how the event will appear
    if (type.match(/Policy/i)) {
       classname = classname + ' policy';
       image = "book.png";
       icon = "book-icon.png";
    }
    else if (type.match(/Publication/g)) {
       classname = classname + ' publication';
       image = "lightbulb.png";
       icon = "lightbulb-icon.png";
    }

    if (status.match(/Highlight/i)) {
       classname = classname + ' highlight';
       image = "highlight.png";
       icon = "highlight-icon.png";
    }

    var event = new Timeline.DefaultEventSource.Event({
      text: title,
      description: description,
      classname: classname,
      instant: true,
      start: start,
      end: null, 
      latestStart: null,
      latestEnd: null, 
      isDuration: false, 
      image: image,
      link: link,
      icon: icon,
      color: color, 
      textColor: undefined
    });
    timelinerEntries.push(event);
  }
  gEventSource.addMany(timelinerEntries);
};

function zeroPad(n) {
  if (n < 0) throw new Error('n is negative');
  return (n < 10) ? '0' + n : n;
}

function convertToGDataDate(/*Date*/ date) {
  return date.getFullYear() + '-' +
         zeroPad(date.getMonth() + 1) + '-' +
         zeroPad(date.getDate());
}

function convertFromGDataDate(/*string<YYYY-MM-DD>*/ date) {
// Not sure why this worked for my Japanese friend, and not me, but I had
// to change the date format.
//  var match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
// return new Date(parseInt(match[3]), parseInt(match[2]), parseInt(match[1]));
//  var match = date.match(/(\d+)\/(\d+)\/(\d+)/);
  var newDate = new Date(Date.parse(date));
  return newDate;
}

function getQueryString() {
    query_string = window.location.search.substr(1).split('&');
    if (query_string == "") return {};
    var results = {};
    for (var i = 0; i < query_string.length; ++i)
    {
        var param=query_string[i].split('=');
        if (param.length != 2) continue;
        results[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
    }
    return results;;
}

function onLoad() {
  gEventSource = new Timeline.DefaultEventSource();

  var theme = Timeline.ClassicTheme.create();
  theme.event.bubble.width = 400;
  theme.event.bubble.height = 200;

  /*
   * now decide if we're in super-secret offline mode or not. 
   * if you're using chrome, you'll need to start with the --allow-file-access-from-files argument.
   */
  var query_string = getQueryString();
  if (query_string['offline']) {
    EVENT_FEED_URL = "archive/us-govt-oss-events.json";
    PROJECT_FEED_URL = "archive/gov-oss-released-projects.json";
  }


  var bandInfos = [
    Timeline.createHotZoneBandInfo({
        zones: [
            {   start:    "Jan 01 2010 00:00:00 GMT-0500",
                end:      "Jan 01 2010 00:00:00 GMT-0500",
                magnify:  5,
                unit:     Timeline.DateTime.MONTH
            },
        ],
        eventSource:    gEventSource,
        start:          "Jan 01 1978 00:00:00 GMT-0500",
        width:          "90%", 
        intervalUnit:   Timeline.DateTime.YEAR, 
        intervalPixels: 100,
        theme:          theme
    }),
    Timeline.createBandInfo({
        overview:       true,
        eventSource:    gEventSource,
        start:          "Jan 01 1978 00:00:00 GMT-0500",
        width:          "10%", 
        intervalUnit:   Timeline.DateTime.YEAR, 
        intervalPixels: 100,
        trackHeight:    0.5,
        trackGap:       0.2,
        theme:          theme
    })
  ];
  bandInfos[1].syncWith = 0;
  bandInfos[1].highlight = true;

  tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);

  // feed the timeline data to our JSON eaters
  $.getJSON(EVENT_FEED_URL, loadEventsWorksheetJSON);

}

var resizeTimerID = null;

function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}


var codeDisplayed = false;
function toggleCode(el) {
  var codeblock = document.getElementById("codeblock");
  if (!codeDisplayed) {
    codeblock.style.display = '';
    el.innerHTML = "Hide the JavaScript";
  } else {
    codeblock.style.display = 'none';
    el.innerHTML = "Show me the JavaScript that loads the JSON";
  }
  codeDisplayed = !codeDisplayed;
}

// These are needed to trigger the display in Wordpress
window.onload = onLoad;
window.onresize = onResize;
