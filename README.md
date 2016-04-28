Code to make timelines from Google Spreadsheets.  For each timeline,
we've added a separate branch with different titles, sources, and
styling, but the baseline material is the same.  You probably want to
use the master branch as the basis for your work.  Master was
originally:

Presentation and accompanying materials for OSCON 2012 presentation
"US Government v. Open Source: A History and Lessons Learned", with
Gunnar Hellekson (Red Hat) and Karl Fogel (Open Tech Strategies).

See http://www.oscon.com/oscon2012/public/schedule/detail/24221.

Materials:

    oss-timeline.html        -- The timeline page one browses to.
    oss-timeline.js          -- Custom JavaScript for timeline.
    SheetAsJSON.gs           -- Google App Engine to convert Spreadsheets to JSON
    us-govt-open-source.odp  -- Presentation slides.
    archive/                 -- Backups of some source materials.
    Overpass-fonts/          -- Copies of the Overpass font, used in the presentation.

To host the timeline (not that you really need to, since it's already
online at http://gov-oss.org), you'd want the Simile Timeline widget code:

    http://www.simile-widgets.org/timeline/

which provides the "simile-ajax-api.js" and "timeline-api.js" files
(referenced from the HTML headers), and the files + images they load.

If you do host this yourself, you should note that we've included a Google
Analytics tracker in the footer of the HTML file. That will (presumably) help
us understand where the code is being used. If you don't like it, feel free
to delete it!

