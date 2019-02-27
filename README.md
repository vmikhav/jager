# Description
Jager is an library for touch gesture recognition.

### Features
* Simple API
* Fast recognition (around 0.1 ms)
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

Also you can see this [demo page](https://vmikhav.github.io/jager/examples/index.html).

### Options
#### gestures
Object with gesture codes
```javascript
gestures = {
  unknown: 0,
  click:   1,
  swipeLR: 2,
  swipeTD: 3,
  swipeDTD: 4,
  swipeTDT: 5,
  swipeLRL: 6,
  swipeRLR: 7,
  pigtail: 8,
  pigtail_reverse: 9,
  lightning: 10,
  circle: 11,
};
```

#### gestureColors
Array of gestures colors. Contains color names or HEX codes (string).

#### gesturesRules
Array of gesture patterns. Pattern contain the following fields:
(Angles are measured in degrees)
* **gesture**: `Number` Gesture code.
* **startAngle**: `[Number, Number]` Allowed start angle diapason.
* **endAngle**: `[Number, Number]` Allowed end angle diapason.
* **terminatorForce**: `[Number, Number]` Allowed start/end line to control line ratio.
* **distanceX**: `[Number, Number]|null` Allowed distance between start and end point (x-axis).
* **distanceY**: `[Number, Number]|null` Allowed distance between start and end point (y-axis).
* **points**: `Array` Rules for internal points. Each rule contain the following elements:
	* **angle** `[Number, Number]` Allowed angle.
	* **force** `[[Number, Number], [Number, Number]]` Allowed line to control line ratio.
```javascript
{
  gesture: this.gestures.pigtail,
  startAngle: [-60, 40],
  endAngle: [155, 240],
  terminatorForce: [0, 0.75],
  distanceX: null,
  distanceY: null,
  points: [
    {angle: [125, 200], force: [[0.1, 0.5], [0, 0.5]]}
  ],
},
```

### Methods
#### point(evt)
Extract point object from the event data.
* **evt**: Event parameter.

#### recognise(path[, tolerance[, debug]])
Recognizes the painted gesture.
* **path**: `Array of points` Pointer path.
* **tolarence**: `Number` `optional` Tolerance of the path approximator. Bigger tolerance - shorter approximate path. Default 5000.
* **debug**: `Bool` `optional` If true jager logging the gesture section.

#### drawPatch(path, ctx[, gesture])
Draw `path` in given `ctx` with `gesture` color.
* **path**: `Array of points` Pointer path.
* **ctx**: `Context` Canvas context.
* **gesture**: `Number` `optional` Gesture number. Used to determine the color of the line.

## License
This software is licensed under the [MIT](https://github.com/vmikhav/jager/blob/master/LICENSE) © [vmikhav](https://github.com/vmikhav)
