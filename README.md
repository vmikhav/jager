# Description
Jager is an library for touch gesture recognition.

### Features
* Simple API
* Recognition on-the-fly
* No outside dependencies, just pure JavaScript

# Documentation

### Contents
* [Quick Start](#quick-start)
* [Examples](#examples)
* [Options](#options)
* [Methods](#methods)
* [License](#license)

### Quick Start

* Clone the repo: `git clone https://github.com/vmikhav/jager.git`

In the browser:

```html
<script src="/path/to/jager.js"></script>
<script>
    var jager = new Jager();
</script>
```

### Examples

```javascript
var jager = new Jager();

var gesture = jager.recognise(path);
```

Also you can see this [demo page](./docs/index.html).

### Options
#### gestures
Object with gesture codes
```javascript
gestures = {
  unknown:     0,
  click:       1,
  swypeLR:     2,
  swypeTD:     3,
  swypeDTD:    4,
  swypeTDT:    5,

  swypeLRL:    6,
  swypeRLR:    7,

  pigtail:     8,

  lightning:   9,

  swypeTDrLTr:10,
};
```

#### gestureColors
Array of gestures colors. Contains color names or HEX codes (string).

#### gesturesRules
Array of gesture patterns. Pattern contain the following fields:
* **gesture**: `Number` Gesture code.
* **groups**: `Number` Count of the sections groups.
* **sections**: `Array` Pattern sections. Each section contain the following elements:
	* **x** `[-1, 0, 1]` Section X orient.
	* **y** `[-1, 0, 1]` Section Y orient.
	* **requisite** `[true, false]` Necessary of the existence of the section.
	* **group** `Number` Section group. One item in the group must be present in the gesture. Group 0 is ignored, use it by default.
	```javascript
	{gesture: jager.gestures.lightning, groups: 4, sections:[
	    // x, y, requisite, group
	    [-1,  1, false, 1],
	    [-1,  0, false, 1],
	    [ 1,  0, false, 2],
	    [ 1,  1, false, 2],
	    [-1,  0, false, 3],
	    [-1,  1, false, 3],
	  ]
	}
	```

### Methods
#### point(evt)
Extract point object from the event data.
* **evt**: Event parameter.

#### recognise(path[, tolerance[, debug]])
Recognizes the painted gesture.
* **path**: `Array of points` Pointer path.
* **tolarence**: `Number` `optional` Tolerance of the path approximator. Bigger tolerance - shorter approximate path. Default 20.
* **debug**: `Bool` `optional` If true jager logging the gesture section.

#### drawPatch(path, ctx[, gesture])
Draw `path` in given `ctx` with `gesture` color.
* **path**: `Array of points` Pointer path.
* **ctx**: `Context` Canvas context.
* **gesture**: `Number` `optional` Gesture number. Used to determine the color of the line.

## License
This software is licensed under the [MIT](https://github.com/vmikhav/jager/blob/master/LICENSE) © [vmikhav](https://github.com/vmikhav)
