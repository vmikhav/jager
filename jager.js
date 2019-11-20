
/**
 *  Library for touch gesture / symbols recognition
 *  Volodymyr Mikhav, 2017-2019
 *
 *  The MIT License (MIT)
 *
 *  https://github.com/vmikhav/jager
 */

(function (){
  'use strict';

  class Jager {
    constructor() {
      this.path = [];
      this.symbols = this.generateSymbolsEnum('|', '_', 'V', '^', '<', '>', 'lighting', 'pigtail', 'circle');

      this.symbolsRules = [
        {
          symbol: this.symbols['|'], sections: [{x: 0, y: 1}], quarters: function (sX, sY, eX, eY) {
            return sY === 0 && eY === 3;
          }
        },
        {
          symbol: this.symbols['|'], sections: [{x: 0, y: -1}], quarters: function (sX, sY, eX, eY) {
            return sY === 3 && eY === 0;
          }
        },
        {
          symbol: this.symbols['_'], sections: [{x: 1, y: 0}], quarters: function (sX, sY, eX, eY) {
            return sX === 0 && eX === 3;
          }
        },
        {
          symbol: this.symbols['_'], sections: [{x: -1, y: 0}], quarters: function (sX, sY, eX, eY) {
            return sX === 3 && eX === 0;
          }
        },

        {// left to right
          symbol: this.symbols['V'],
          sections: [{x: 0, y: -1, skip: true}, {x: 0, y: 1}, {x: 1, y: 0, skip: true}, {x: 0, y: -1}, {
            x: 1,
            y: 0,
            skip: true
          }],
          quarters: function (sX, sY, eX, eY) {
            return eY <= 1 && eX === 3;
          }
        },
        {
          symbol: this.symbols['V'],
          sections: [{x: 0, y: -1, skip: true}, {x: 0, y: 1}, {x: 1, y: 0}],
          quarters: function (sX, sY, eX, eY) {
            return eY <= 1 && eX === 3;
          }
        },
        {// right to left
          symbol: this.symbols['V'],
          sections: [{x: 0, y: -1, skip: true}, {x: 0, y: 1}, {x: -1, y: 0, skip: true}, {x: 0, y: -1}, {x: -1, y: 0, skip: true}],
          quarters: function (sX, sY, eX, eY) {
            return eY <= 1 && eX === 0;
          }
        },
        {
          symbol: this.symbols['V'],
          sections: [{x: 0, y: -1, skip: true}, {x: 0, y: 1}, {x: -1, y: 0}],
          quarters: function (sX, sY, eX, eY) {
            return eY <= 1 && eX === 0;
          }
        },

        {// left to right
          symbol: this.symbols['^'],
          sections: [{x: 0, y: 1, skip: true}, {x: 1, y: 0, skip: true}, {x: 0, y: -1}, {x: 1, y: 0, skip: true}, {x: 0, y: 1}, {x: 1, y: 0, skip: true}],
          quarters: function (sX, sY, eX, eY) {
            return eY >= 2 && eX === 3;
          }
        },
        {
          symbol: this.symbols['^'],
          sections: [{x: 0, y: 1, skip: true}, {x: 0, y: -1}, {x: 1, y: 0}],
          quarters: function (sX, sY, eX, eY) {
            return eY >= 2 && eX === 3;
          }
        },
        {// right to left
          symbol: this.symbols['^'],
          sections: [{x: 0, y: 1, skip: true}, {x: 0, y: -1}, {x: -1, y: 0, skip: true}, {x: 0, y: 1}, {x: -1, y: 0, skip: true}],
          quarters: function (sX, sY, eX, eY) {
            return eY >= 2 && eX === 0;
          }
        },
        {
          symbol: this.symbols['^'],
          sections: [{x: 0, y: 1, skip: true}, {x: 0, y: -1}, {x: -1, y: 0}],
          quarters: function (sX, sY, eX, eY) {
            return eY >= 2 && eX === 0;
          }
        },
        {
          symbol: this.symbols['^'],
          sections: [{x: 1, y: 0}, {x: 0, y: 1}],
          quarters: function (sX, sY, eX, eY) {
            return eY >= 2 && eX === 3 && sX === 0;
          }
        },

        {
          symbol: this.symbols['<'],
          sections: [{x: -1, y: 0}, {x: 0, y: 1, skip: true}, {x: 1, y: 0}],
          quarters: function (sX, sY, eX, eY) {
            return sX >= 2 && eX >= 3 && sY === 0 && eY === 3;
          }
        },
        {
          symbol: this.symbols['<'],
          sections: [{x: 1, y: 0}, {x: 0, y: -1, skip: true}, {x: -1, y: 0}],
          quarters: function (sX, sY, eX, eY) {
            return sX >= 3 && eX >= 3 && sY === 3 && eY === 0;
          }
        },

        {
          symbol: this.symbols['>'],
          sections: [{x: 1, y: 0}, {x: 0, y: 1, skip: true}, {x: -1, y: 0}, {x: 0, y: 1, skip: true}],
          quarters: function (sX, sY, eX, eY) {
            return sX <= 1 && eX <= 1 && sY === 0 && eY === 3;
          }
        },
        {
          symbol: this.symbols['>'],
          sections: [{x: 1, y: 0}, {x: 0, y: 1}],
          quarters: function (sX, sY, eX, eY) {
            return sX <= 1 && eX <= 1 && sY === 0 && eY === 3;
          }
        },
        {
          symbol: this.symbols['>'],
          sections: [{x: -1, y: 0}, {x: 0, y: -1, skip: true}, {x: 1, y: 0}],
          quarters: function (sX, sY, eX, eY) {
            return sX <= 1 && eX <= 1 && sY === 3 && eY === 0;
          }
        },

        {
          symbol: this.symbols['lighting'],
          sections: [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: 1}],
          quarters: function (sX, sY, eX, eY) {
            return sY === 0 && eY === 3 && eX >= 1;
          }
        },
        {
          symbol: this.symbols['lighting'],
          sections: [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: 1, skip: true}, {x: -1, y: 0}, {x: 0, y: 1, skip: true}],
          quarters: function (sX, sY, eX, eY) {
            return sY === 0 && eY === 3 && sX >= eX && sX >= 1 && eX < 3;
          }
        },
        {
          symbol: this.symbols['lighting'],
          sections: [
            {x: 0, y: 1, skip: true}, {x: -1, y: 0}, {x: 0, y: 1, skip: true}, {x: 1, y: 0},
            {x: 0, y: 1, skip: true}, {x: -1, y: 0}, {x: 0, y: 1, skip: true}
          ],
          quarters: function (sX, sY, eX, eY) {
            return sY === 0 && eY === 3 && sX >= eX && sX >= 1 && eX < 3;
          }
        },
        {
          symbol: this.symbols['pigtail'],
          sections: [
            {x: 0, y: 1, skip: true}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0},
            {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1, skip: true},
          ],
          quarters: function (sX, sY, eX, eY) {
            return sX === 0 && eX === 3 && sY >= 2 && eY >= 2;
          }
        },
        {// left-right
          symbol: this.symbols['circle'],
          sections: [{x: -1, y: 0, skip: true}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0, skip: true}],
          quarters: function (sX, sY, eX, eY) {
            return sY === 0 && eY === 0 && Math.abs(sX - eX) <= 1 && sX <= 2;
          }
        },
        {// right-left
          symbol: this.symbols['circle'],
          sections: [{x: 1, y: 0, skip: true}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}, {x: 1, y: 0, skip: true}],
          quarters: function (sX, sY, eX, eY) {
            return sY === 0 && eY === 0 && Math.abs(sX - eX) <= 1 && sX >= 1;
          }
        },
      ];
    }

    reset() {
      this.path = [];
    }

    generateSymbolsEnum() {
      let result = {all: []};
      let names = [...arguments];
      names.unshift(null);
      for (let i = 0; i < names.length; i++) {
        let item = {name: names[i], index: i};
        result.all.push(item);
        result[names[i]] = item;
      }
      return result;
    }

    getSymbols() {
      return this.symbols;
    }

    drawPatch(ctx) {
      let i;
      if (this.path.length > 1) {
        ctx.strokeStyle = "white";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        for (i = 1; i < this.path.length; i++) {
          ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        ctx.stroke();
        ctx.closePath();
      }
    }

    recognise(debug = false) {
      let res = this.symbols[null];
      if (!this.path.length) {return res;}

      let time;
      if (debug) {
        time = window.performance.now();
      }
      let sections = [], lastId = -50, lastSection = {x: 0, y: 0};
      let minX = this.path[0].x, minY = this.path[0].y, maxX = this.path[0].x, maxY = this.path[0].y;
      for (let i = 1; i < this.path.length; i++) {
        if (minX > this.path[i].x) {minX = this.path[i].x;}
        if (maxX < this.path[i].x) {maxX = this.path[i].x;}
        if (minY > this.path[i].y) {minY = this.path[i].y;}
        if (maxY < this.path[i].y) {maxY = this.path[i].y;}
        let section = this.sectionOrient(this.path[i - 1], this.path[i]);
        if (section.x !== lastSection.x || section.y !== lastSection.y) {
          if (i - lastId < 4 && sections.length >= 2 && section.x === sections[sections.length-2].x && section.y === sections[sections.length-2].y) {
            lastSection = sections[sections.length-2];
            sections.pop();
          } else {
            lastId = i;
            lastSection = section;
            sections.push(lastSection);
          }
        }
      }

      const [startQX, startQY, endQX, endQY] = this.calcQuarters(minX, minY, maxX, maxY, this.path[0].x, this.path[0].y, this.path[this.path.length-1].x, this.path[this.path.length-1].y);
      let rule, isRuleGood, rsi, si;
      for (let i = 0; i < this.symbolsRules.length; i++) {
        rule = this.symbolsRules[i];
        if (rule.quarters(startQX, startQY, endQX, endQY)) {
          isRuleGood = true;
          for (rsi = 0, si = 0; rsi < rule.sections.length; rsi++) {
            if (si < sections.length && sections[si].x === rule.sections[rsi].x && sections[si].y === rule.sections[rsi].y) {
              si++;
            } else if (!rule.sections[rsi].skip) {
              isRuleGood = false;
              break;
            }
          }
          if (isRuleGood && si >= sections.length) {
            res = rule.symbol;
            break;
          }
        }
      }
      if (debug) {
        console.log('performance', window.performance.now() - time);
        console.log('start: ' + startQX + ', ' + startQY);
        console.log('end: ' + endQX + ', ' + endQY);
        console.log(sections);
        console.log(res);
      }
      this.reset();
      return res;
    }

    pushPoint(point) {
      this.path.push(point);
    }

    addPoint(point, distanceFilter = 75, smoothFactor = 0.75) {
      if (!this.path.length) {
        this.pushPoint(point);
      }
      let oldP = this.path[this.path.length-1];
      let newP = {x: (oldP.x * smoothFactor) + (point.x * (1 - smoothFactor)), y: (oldP.y * smoothFactor) + (point.y * (1 - smoothFactor))};

      if (Math.pow(Math.abs(oldP.x - newP.x), 2) + Math.pow(Math.abs(oldP.y - newP.y), 2) > distanceFilter) {
        this.path.push(newP);
        return [oldP, newP];
      }
      return null;
    }

    calcQuarters(minX, minY, maxX, maxY, startX, startY, endX, endY) {
      let widthStep = Math.ceil((maxX - minX + 1) / 4), heightStep = Math.ceil((maxY - minY + 1) / 4);
      startX = startX - minX; endX = endX - minX;
      startY = startY - minY; endY = endY - minY;
      return [Math.floor(startX / widthStep), Math.floor(startY / heightStep), Math.floor(endX / widthStep), Math.floor(endY / heightStep)];
    }

    sectionOrient(p1, p2){
      const sign = i => i < 0 ? -1 : 1;
      let xDiff  = p2.x - p1.x;
      let yDiff  = p2.y - p1.y;
      let xADiff = Math.abs(xDiff);
      let yADiff = Math.abs(yDiff);

      let x = 0, y = 0;

      if (xADiff >= yADiff) {x = sign(xDiff);} else {y = sign(yDiff);}
      return {x, y}
    }

    point(evt) {
      return {x: evt.x, y: evt.y};
    }
  }

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return {
        Jager: Jager
      };
    });
  }

  // Add support for CommonJS libraries such as browserify.
  if (typeof exports !== 'undefined') {
    exports.Jager = Jager;
  }

  // Define globally in case AMD is not available or unused.
  if (typeof window !== 'undefined') {
    window.Jager = Jager;
  }
})();
