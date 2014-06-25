# ShapeDrawer

---

> Little web app that draws shapes on a page based on a user's commands

## Setup

The application uses Gulp for CSS and JS concatenation so:

```
npm install
gulp	
```

## Builds

The build version of the app is available as `drawing.html` file in the main repository's folder.

## Room for improvements

* The Gulp setup uses temporary files for the CSS and JS content. It should be made with streams.
* There are some cases where the output to the tooltip is formated with tags. This is done in the JavaScript part which is wrong. The visual look of the tooltip messages should be controlled only by the CSS.