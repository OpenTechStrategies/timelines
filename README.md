Template for displaying timelines based on Google Spreadsheets.

To use this tree, we recommend creating a new branch based on the
`master` branch and then customizing as needed.  You can take a look
at the `us-govt-oss` branch and the `ots-geonode` branches for
examples of typical customizations.  The baseline materials are:

    timeline                 -- The timeline page one browses to.
    timeline.js              -- Custom JavaScript for timeline.
    .htaccess                -- If you rename `timeline`, adjust here too.
    SheetAsJSON.gs           -- Convert Spreadsheets->JSON via Google App Engine

You'll also need the Simile Timeline widget code:

    http://www.simile-widgets.org/timeline/

which provides the "simile-ajax-api.js" and "timeline-api.js" files
(referenced from the HTML headers), and the files + images they load.

This project originated as a small web site for displaying a
presentation and accompanying materials for OSCON 2012 presentation
["US Government v. Open Source: A History and Lessons
Learned"](http://www.oscon.com/oscon2012/public/schedule/detail/24221),
with Gunnar Hellekson (Red Hat) and Karl Fogel (Open Tech Strategies).
The template here still reflects that content, and you should just
edit the obvious places to customize it for your own needs.  See the
`us-govt-oss` branch for the original production version.

Web Analytics
-------------

If you want web analytics, see the Google Analytics and Piwik code
near the bottom of `oss-timeline.html` on the `us-govt-oss` branch.
