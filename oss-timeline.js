// Copyright (C) 2011-2012  Gunnar Hellekson
// Licensed under the Creative Commons Attribution-ShareAlike 3.0 License.
// See the file COPYING for details.

SimileAjax.History.enabled = false;
var gEventSource;
// var EVENT_FEED_URL = "http://spreadsheets.google.com/feeds/list/0AjxnOozsvYvldHY1NE1MV0pGVXRyd2hUaTAzdmRJb1E/2/public/values?alt=json-in-script&callback=loadEventsWorksheetJSON";
// var PROJECT_FEED_URL = "http://spreadsheets.google.com/feeds/list/0AlXDdNQEU-8fdDI0OFJEVXRYNGhDNVRrVDhUS19LVVE/3/public/values?alt=json-in-script&callback=loadProjectsWorksheetJSON";

var EVENT_FEED_URL = "archive/us-govt-oss-events.json";
var PROJECT_FEED_URL = "archive/gov-oss-released-projects.json";

function loadProjectsWorksheetJSON(json) {
  var entries = json.feed.entry;
  var timelinerEntries = [];
  for (var i = 0; i < entries.length; ++i) {
    var entry = entries[i];

    // these values come from the spreadsheet
    var projectName = entry.gsx$projectnameacronym.$t;
    var jurisdiction = entry.gsx$jurisdictionlevel.$t;
    var organization = entry.gsx$orgdepartment.$t;
    var license = entry.gsx$osslicenses.$t;
    var url = entry.gsx$url.$t;
    var dateAdded = convertFromGDataDate(entry.gsx$dateadded.$t);
    var releaseDate= convertFromGDataDate(entry.gsx$releasedate.$t);
    var whatItDoes = entry.gsx$whatitdoes.$t;
    var notes = entry.gsx$notes.$t;

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
  var entries = json.feed.entry;
  var timelinerEntries = [];
  for (var i = 0; i < entries.length; ++i) {
    var entry = entries[i];

    /*
     * Really unhappy with how these variables are referenced, but can't see an
     * alternative given the JSON that Google's given me. The field names 
     * ("gsx$_chk2m") come from the JSON file:
     *
     * https://spreadsheets.google.com/feeds/list/0AjxnOozsvYvldHY1NE1MV0pGVXRyd2hUaTAzdmRJb1E/2/public/values?alt=json-in-script&callback=loadEventsWorksheetJSON
     *
     * That URL fetches sheet 2 ("/2/") of the spreadsheet ("0Ajxn0...Jb1E").
     * 
     */
    
    // these values come from the spreadsheet
    var start = convertFromGDataDate(entry.gsx$_cn6ca.$t);
    var title = entry.gsx$_cokwr.$t;
    var description = entry.gsx$_cpzh4.$t;
    var type = entry.gsx$_chk2m.$t;
    var link = entry.gsx$_cre1l.$t;
    var status = entry.gsx$_ckd7g.$t;

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

function onLoad() {
  gEventSource = new Timeline.DefaultEventSource();

  var theme = Timeline.ClassicTheme.create();
  theme.event.bubble.width = 400;
  theme.event.bubble.height = 200;

  var startTime = new Date(((new Date).getTime()) * 24 * 60 * 60 *
1000);

  var bandInfos = [
    Timeline.createHotZoneBandInfo({
        zones: [
            {   start:    "Jan 01 2009 00:00:00 GMT-0500",
                end:      "Jan 01 2013 00:00:00 GMT-0500",
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

  // Create a script that will feed the timeline data to our loadEventsWorksheetJSON
  var scriptTag = document.createElement('script');
  scriptTag.src = EVENT_FEED_URL;
  document.body.appendChild(scriptTag);

  // Create a script that will feed the code release data to our loadProjectsWorksheetJSON
  scriptTag = document.createElement('script');
  scriptTag.src = PROJECT_FEED_URL;;
  document.body.appendChild(scriptTag);
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
