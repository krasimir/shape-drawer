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

## Architecture

### CSS

The CSS styles are distributed to several files placed in `app/css/src` directory. There is a Gulp task that concatenates them. There is a little bit SMACSS organization of the files. We have basic styles, typography, layout, colors and component specific styles.

### JavaScript

Similar like with the CSS we split the app into components. There is one main class called `App.js` that acts as a glue between the different parts. 

* Utils.js - contains helper functions
* CLI.js - responsible for the input field in the button. Dispatches events `command` (when the Enter key is pressed), `update` (when the any other key is pressed) and `autocomplete` (when the TAB key is pressed).
* Drawer.js - that's the module that draws on the canvas
* Tooltip.js - that's the little popup shown above the input field. It displays the messages to the user
* FloodFill.js - that's an algorithm of flood filling *(It's not written by me. I just tweaked it a bit so it fits in my case.)*
* App.js - the main application's file

### Building

We are using Gulp. It concatenates the CSS and the JavaScript to `app/css/styles.css` and `app/js/scripts.js`. Later these files are merged with `app/drawing.html`. There are also watchers setupped so the whole building process happen on every change.

## API commands

* `?` - displays all the available commands
* `clear` - fills the whole canvas with particular color. The color is actually optional. It's default value is `#FFF`.
* `rectangle` - draws a rectangle
* `line` - draws a line
* `fill` - flood filling

## Room for improvements

* The Gulp setup uses temporary files for the CSS and JS content. It should be made with streams.
* There are some cases where the output to the tooltip is formated with tags. This is done in the JavaScript part which is wrong. The visual look of the tooltip messages should be controlled only by the CSS.
* The errors should be displayed differently
* Most of the commands require numbers. There should be check for that.