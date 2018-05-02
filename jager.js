(function (){
  'use strict';

  class Jager {
    constructor(){
      this.gestures = {
        unknown:   0,
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

      this.gestureColors = ['black', 'black', '#FF0000', '#2FA6EF', '#FFCC33', '#7AF330', '#56A521', '#FF9900', '#1976d2', 'yellow', '#FF0000'];

      this.gesturesRules = [
        {gesture: this.gestures.lightning, groups: 4, sections:[
            // x, y, requisite, group
            [-1,  1, false, 1],
            [-1,  0, false, 1],
            [ 1,  0, false, 2],
            [ 1,  1, false, 2],
            [-1,  0, false, 3],
            [-1,  1, false, 3],
          ]
        },
        {gesture: this.gestures.swypeTDrLTr, groups: 2, sections:[
            // x, y, requisite, group
            [ 1,  1,  true, 0],
            [-1,  0, false, 1],
            [-1,  1, false, 1],
            [-1, -1, false, 1],
            [ 1, -1,  true, 0],
          ]
        },
        {gesture: this.gestures.pigtail, groups: 5, sections:[
            // x, y, requisite, group
            [ 1,  1, false, 0],
            [ 1,  0, false, 1],
            [ 1, -1, false, 1],
            [ 0, -1, false, 2],
            [-1, -1, false, 2],
            [-1,  0, false, 2],
            [-1,  1, false, 3],
            [ 0,  1, false, 3],
            [ 1,  1, false, 4],
            [ 1,  0, false, 4],
            [ 1, -1, false, 0],
          ]
        },
      ];
    }

    drawPatch(path, ctx, gesture = 0){
      let i;
      if (path.length > 1){
        ctx.strokeStyle = this.gestureColors[gesture];
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.lineWidth   = 10;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (i = 1; i < path.length; i++){
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        ctx.closePath();
      }
    }

    getDistance(a, b) {
      return (Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
    }

    getSectionOrient(a, b){
      let dx = b.x - a.x;
      let dy = b.y - a.y;

      let result = {x: 0, y: 0, rx: 0, ry: 0};

      let ratio = Math.abs(dx)/(Math.abs(dx)+Math.abs(dy));

      result.rx = ratio;
      result.ry = 1 - ratio;

      if (ratio >= 0.75){
        result.x = Math.sign(dx);
      }
      else if (ratio <= 0.2){
        result.y = Math.sign(dy);
      }
      else{
        result.x = Math.sign(dx);
        result.y = Math.sign(dy);
      }
      return result;
    }

    recognite(path, tolerance = 20, debug = false){
      return this.cogniteGesture(this.simplifyPath(path, tolerance), debug);
    }

    cogniteGesture(path, debug = false){
      let i, j, k, l, ol, result = 0;
      let orients = [];
      if (path.length == 2){
        // simlpe gestures
        if (this.getDistance(path[0], path[1]) < 100){
          result = this.gestures.click;
        }
        else{
          orients.push(this.getSectionOrient(path[0], path[1]));
          if (orients[0].x && orients[0].ry < 0.3){
            result = this.gestures.swypeLR;
          }
          else if (orients[0].rx < 0.3 && orients[0].y){
            result = this.gestures.swypeTD;
          }
        }
      }
      else{
        orients.push(this.getSectionOrient(path[0], path[1]));
        l = 1;
        for (i = 2; i < path.length; i++){
          j = this.getSectionOrient(path[i-1], path[i]);
          k = orients.length - 1;
          if (j.x != orients[k].x || j.y != orients[k].y){
            l = i;
            orients.push(j);
          }
          else{
            orients[k] = this.getSectionOrient(path[l], path[i]);
          }
        }

        ol = orients.length;

        if (orients.length == 2
          && Math.abs(orients[0].y + orients[1].y) == 2
          && (Math.abs(orients[0].rx) + Math.abs(orients[1].rx)) < 0.4)
        {
          result = gestures.swypeTD;
        }
        else if ((ol == 2 || ol == 3)
          && orients[0].y == -orients[ol - 1].y 
          && ((ol == 2 && Math.abs(orients[0].x + orients[1].x) >= 1)
            || (ol == 3 && Math.abs(orients[0].x + orients[1].x + orients[2].x) >= 2)))
        {
            if (orients[0].y == 1){
              result = this.gestures.swypeTDT;
            }
            else{
              result = this.gestures.swypeDTD;
            }
        }
        else if ((ol == 2 || ol == 3)
          && orients[0].x == -orients[ol - 1].x 
          && ((ol == 2 && Math.abs(orients[0].y + orients[1].y) >= 1)
            || (ol == 3 && Math.abs(orients[0].y + orients[1].y + orients[2].y) >= 2)))
        {
            if (orients[0].x == 1){
              result = this.gestures.swypeLRL;
            }
            else{
              result = this.gestures.swypeRLR;
            }
        }
        
        if (result == 0){
          for (l = 0; l < this.gesturesRules.length; l++){
            let grs = this.gesturesRules[l].sections;
            // prepare groups
            let groups = [];
            k = Math.max(1, this.gesturesRules[l].groups);
            for (; k > 0; k--){
              groups.push(0);
            }
            // check rule
            for (i = 0, j = 0; i < grs.length && j < ol; i++, j++){
              if (orients[j].x != grs[i][0] || orients[j].y != grs[i][1]){
                if (grs[i][2] == false){
                  j--;
                }
                else{
                  break;
                }
              }
              else{
                groups[grs[i][3]|0] = 1;
              }
            }
            // remove unrequired tail
            for (; i < grs.length; i++){
              if (grs[i][2] == true){
                break;
              }
            }
            // check groups
            for (k = 1; k < groups.length; k++){
              if (groups[k] == 0){
                i = 0; break;
              }
            }
            // check conformance to the specified rules
            if (i == grs.length && j == ol){
              result = this.gesturesRules[l].gesture;
              break;
            }
          }
        }
      }

      if (debug){
        console.log(orients);
        console.log(result);
      }

      return result;
    }

    point(evt){
      return {x: evt.x, y: evt.y};
    }

    simplifyPath( points, tolerance ) {

      // helper classes 
      let Vector = function( x, y ) {
        this.x = x;
        this.y = y;
        
      };
      let Line = function( p1, p2 ) {
        this.p1 = p1;
        this.p2 = p2;
        
        this.distanceToPoint = function( point ) {
          // slope
          let m = ( this.p2.y - this.p1.y ) / ( this.p2.x - this.p1.x ),
            // y offset
            b = this.p1.y - ( m * this.p1.x ),
            d = [];
          // distance to the linear equation
          d.push( Math.abs( point.y - ( m * point.x ) - b ) / Math.sqrt( Math.pow( m, 2 ) + 1 ) );
          // distance to p1
          d.push( Math.sqrt( Math.pow( ( point.x - this.p1.x ), 2 ) + Math.pow( ( point.y - this.p1.y ), 2 ) ) );
          // distance to p2
          d.push( Math.sqrt( Math.pow( ( point.x - this.p2.x ), 2 ) + Math.pow( ( point.y - this.p2.y ), 2 ) ) );
          // return the smallest distance
          return d.sort( function( a, b ) {
            return ( a - b ); //causes an array to be sorted numerically and ascending
          } )[0];
        };
      };
      
      let douglasPeucker = function( points, tolerance ) {
        let i;
        if ( points.length <= 2 ) {
          return [points[0]];
        }
        let returnPoints = [],
          // make line from start to end 
          line = new Line( points[0], points[points.length - 1] ),
          // find the largest distance from intermediate poitns to this line
          maxDistance = 0,
          maxDistanceIndex = 0,
          p;
        for( i = 1; i <= points.length - 2; i++ ) {
          let distance = line.distanceToPoint( points[ i ] );
          if( distance > maxDistance ) {
            maxDistance = distance;
            maxDistanceIndex = i;
          }
        }
        // check if the max distance is greater than our tolerance allows 
        if ( maxDistance >= tolerance ) {
          p = points[maxDistanceIndex];
          line.distanceToPoint( p, true );
          // include this point in the output 
          returnPoints = returnPoints.concat( douglasPeucker( points.slice( 0, maxDistanceIndex + 1 ), tolerance ) );
          // returnPoints.push( points[maxDistanceIndex] );
          returnPoints = returnPoints.concat( douglasPeucker( points.slice( maxDistanceIndex, points.length ), tolerance ) );
        } else {
          // ditching this point
          p = points[maxDistanceIndex];
          line.distanceToPoint( p, true );
          returnPoints = [points[0]];
        }
        return returnPoints;
      };
      let arr = douglasPeucker( points, tolerance );
      // always have to push the very last point on so it doesn't get left off
      arr.push( points[points.length - 1 ] );
      return arr;
    };
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
})()