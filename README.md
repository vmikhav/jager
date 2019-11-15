# Description
Jager is an library for touch gesture / symbols recognition.

### Features
* Simple API
* Fast recognition (around 0.2 ms)
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
const jager = new Jager();
jager.addPoint({x, y});
let gesture = jager.recognise();
```

Also you can see this [demo page](https://vmikhav.github.io/jager/examples/index.html).

### Options
#### path
Array of points (x, y) for recognition

#### symbols
Object with symbols enumeration
```javascript
if (jager.recognise() === jager.symbols['pigtail']) { }
```

#### symbolsRules
Array of symbol patterns. Pattern contain the following fields:
* **symbol**: `{name, index}` Symbol info.
* **sections**: `Array` Rules for path sections. Each rule contain the following elements:
	* **x** `-1|0|1` Section orientation in X line. Should be `0` if `y` is not `0`.
	* **y** `-1|0|1` Section orientation in Y line. Should be `0` if `x` is not `0`.
	* **skip** `bool` *Optional* If `true`, this section can be skipped in mismatch case.
* **quarters**: `function (sX, sY, eX, eY)` Callback function to check start and end point positions. Each param is in integer range `[0, 3]` (top-left corner is (0, 0), bottom-right is (3, 3)).
```javascript
{
  symbol: this.symbols['circle'],
  sections: [{x: -1, y: 0, skip: true}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}],
  quarters: function (sX, sY, eX, eY) {
    return sY === 0 && eY === 0 && Math.abs(sX - eX) <= 1 && sX <= 2;
  }
}
```

### Methods
#### reset()
Reset current path.

#### point(evt)
Extract point object from the event data.
* **evt**: Event parameter.

#### pushPoint(point)
Add point to current path without changes.
* **point**: Point object, contains `x` and `y`.

#### addPoint(point[, distanceFilter[, smoothFactor]])
Add point to current path with smoothing.
* **point**: Point object, contains `x` and `y`.
* **distanceFilter**: Ignore point if squared distance to previous point is less than `distanceFilter`.
* **smoothFactor**: How smooth will be current path. Decimal in `[0, 1)`.

#### recognise([debug])
Recognizes the painted gesture.
* **debug**: `Bool` `optional` If true jager logging the symbol info.

#### drawPatch(ctx)
Draw current path in given `ctx`.
* **ctx**: `Context` Canvas context.

## License
This software is licensed under the [MIT](https://github.com/vmikhav/jager/blob/master/LICENSE) © [vmikhav](https://github.com/vmikhav)
