"use strict";


var math = require("./math.js");
var v2 = require("./v2.js");

var coldet = {
  circleToAabb: function circleToAabb(pos, rad) {
    var extent = v2.create(rad);
    return {
      min: v2.sub(pos, extent),
      max: v2.add(pos, extent)
    };
  },

  aabbToCircle: function aabbToCircle(min, max) {
    var e = v2.mul(v2.sub(max, min), 0.5);
    var c = v2.add(min, e);
    return {
      pos: c,
      rad: v2.length(e)
    };
  },

  lineSegmentToAabb: function lineSegmentToAabb(a, b) {
    return {
      min: v2.create(a.x < b.x ? a.x : b.x, a.y < b.y ? a.y : b.y),
      max: v2.create(a.x > b.x ? a.x : b.x, a.y > b.y ? a.y : b.y)
    };
  },

  boundingAabb: function boundingAabb(aabbs) {
    var min = v2.create(Number.MAX_VALUE, Number.MAX_VALUE);
    var max = v2.create(-Number.MAX_VALUE, -Number.MAX_VALUE);
    for (var i = 0; i < aabbs.length; i++) {
      var x = aabbs[i];
      min.x = math.min(min.x, x.min.x);
      min.y = math.min(min.y, x.min.y);
      max.x = math.max(max.x, x.max.x);
      max.y = math.max(max.y, x.max.y);
    }
    return { min: min, max: max };
  },

  splitAabb: function splitAabb(aabb, axis) {
    // Split aabb along centerpoint into two child aabbs.
    // This could be generalized into split-along-plane
    var e = v2.mul(v2.sub(aabb.max, aabb.min), 0.5);
    var c = v2.add(aabb.min, e);
    var left = { min: v2.copy(aabb.min), max: v2.copy(aabb.max) };
    var right = { min: v2.copy(aabb.min), max: v2.copy(aabb.max) };
    if (Math.abs(axis.y) > Math.abs(axis.x)) {
      left.max = v2.create(aabb.max.x, c.y);
      right.min = v2.create(aabb.min.x, c.y);
    } else {
      left.max = v2.create(c.x, aabb.max.y);
      right.min = v2.create(c.x, aabb.min.y);
    }
    // Return aabbs ordered [toward axis, away from axis]
    var dir = v2.sub(aabb.max, aabb.min);
    return v2.dot(dir, axis) > 0.0 ? [right, left] : [left, right];
  },

  scaleAabbAlongAxis: function scaleAabbAlongAxis(aabb, axis, scale) {
    var e = v2.mul(v2.sub(aabb.max, aabb.min), 0.5);
    var c = v2.add(aabb.min, e);
    var y = Math.abs(axis.y) > Math.abs(axis.x);
    return {
      min: v2.create(y ? aabb.min.x : c.x - e.x * scale, y ? c.y - e.y * scale : aabb.min.y),
      max: v2.create(y ? aabb.max.x : c.x + e.x * scale, y ? c.y + e.y * scale : aabb.max.y)
    };
  },

  clampPosToAabb: function clampPosToAabb(pos, aabb) {
    return v2.minElems(v2.maxElems(pos, aabb.min), aabb.max);
  },

  clampPolygonToAabb: function clampPolygonToAabb(poly, aabb) {
    var newPoly = [];
    for (var i = 0; i < poly.length; i++) {
      newPoly.push(coldet.clampPosToAabb(poly[i], aabb));
    }
    return newPoly;
  },

  testPointAabb: function testPointAabb(pos, min, max) {
    return pos.x >= min.x && pos.y >= min.y && pos.x <= max.x && pos.y <= max.y;
  },

  testCircleAabb: function testCircleAabb(pos, rad, min, max) {
    var cpt = v2.create(math.clamp(pos.x, min.x, max.x), math.clamp(pos.y, min.y, max.y));
    var dstSqr = v2.lengthSqr(v2.sub(pos, cpt));
    return dstSqr < rad * rad || pos.x >= min.x && pos.x <= max.x && pos.y >= min.y && pos.y <= max.y;
  },

  testCircleCircle: function testCircleCircle(pos0, rad0, pos1, rad1) {
    var rad = rad0 + rad1;
    return v2.lengthSqr(v2.sub(pos1, pos0)) < rad * rad;
  },

  testAabbAabb: function testAabbAabb(min0, max0, min1, max1) {
    return min0.x < max1.x && min0.y < max1.y && min1.x < max0.x && min1.y < max0.y;
  },

  testAabbPolygon: function testAabbPolygon(min, max, poly) {
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i];
      var b = i == poly.length - 1 ? poly[0] : poly[i + 1];
      if (coldet.intersectSegmentAabb(a, b, min, max)) {
        return true;
      }
    }
    return false;
  },

  aabbInsideAabb: function aabbInsideAabb(min0, max0, min1, max1) {
    return min0.x >= min1.x && min0.y >= min1.y && max0.x <= max1.x && max0.y <= max1.y;
  },

  signedAreaTri: function signedAreaTri(a, b, c) {
    return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
  },

  intersectSegmentSegment: function intersectSegmentSegment(a0, a1, b0, b1) {
    var x1 = coldet.signedAreaTri(a0, a1, b1);
    var x2 = coldet.signedAreaTri(a0, a1, b0);
    if (x1 != 0.0 && x2 != 0.0 && x1 * x2 < 0.0) {
      var x3 = coldet.signedAreaTri(b0, b1, a0);
      var x4 = x3 + x2 - x1;
      if (x3 * x4 < 0.0) {
        var t = x3 / (x3 - x4);
        return {
          point: v2.add(a0, v2.mul(v2.sub(a1, a0), t))
        };
      }
    }
    return null;
  },

  intersectSegmentCircle: function intersectSegmentCircle(s0, s1, pos, rad) {
    var d = v2.sub(s1, s0);
    var len = math.max(v2.length(d), 0.000001);
    d = v2.div(d, len);
    var m = v2.sub(s0, pos);
    var b = v2.dot(m, d);
    var c = v2.dot(m, m) - rad * rad;
    if (c > 0.0 && b > 0.0) {
      return null;
    }
    var discSq = b * b - c;
    if (discSq < 0.0) {
      return null;
    }
    var disc = Math.sqrt(discSq);
    var t = -b - disc;
    if (t < 0.0) {
      t = -b + disc;
    }
    if (t <= len) {
      var point = v2.add(s0, v2.mul(d, t));
      return {
        point: point,
        normal: v2.normalize(v2.sub(point, pos))
      };
    }
    return null;
  },

  intersectSegmentAabb: function intersectSegmentAabb(s0, s1, min, max) {
    var tmin = 0;
    var tmax = Number.MAX_VALUE;
    var eps = 0.00001;
    var r = s0;
    var d = v2.sub(s1, s0);
    var dist = v2.length(d);
    d = dist > eps ? v2.div(d, dist) : v2.create(1.0, 0.0);

    var absDx = Math.abs(d.x);
    var absDy = Math.abs(d.y);

    // @HACK: fix this function
    if (absDx < eps) {
      d.x = eps * 2.0;
      absDx = d.x;
    }
    if (absDy < eps) {
      d.y = eps * 2.0;
      absDy = d.y;
    }

    if (absDx > eps) {
      var tx1 = (min.x - r.x) / d.x;
      var tx2 = (max.x - r.x) / d.x;
      tmin = math.max(tmin, math.min(tx1, tx2));
      tmax = math.min(tmax, math.max(tx1, tx2));
      if (tmin > tmax) {
        return null;
      }
    }
    if (absDy > eps) {
      var ty1 = (min.y - r.y) / d.y;
      var ty2 = (max.y - r.y) / d.y;
      tmin = math.max(tmin, math.min(ty1, ty2));
      tmax = math.min(tmax, math.max(ty1, ty2));
      if (tmin > tmax) {
        return null;
      }
    }
    if (tmin > dist) {
      return null;
    }
    // Hit
    var p = v2.add(s0, v2.mul(d, tmin));
    // Intersection normal
    var c = v2.add(min, v2.mul(v2.sub(max, min), 0.5));
    var p0 = v2.sub(p, c);
    var d0 = v2.mul(v2.sub(min, max), 0.5);

    var x = p0.x / Math.abs(d0.x) * 1.001;
    var y = p0.y / Math.abs(d0.y) * 1.001;
    var n = v2.normalizeSafe(v2.create(x < 0.0 ? Math.ceil(x) : Math.floor(x), y < 0.0 ? Math.ceil(y) : Math.floor(y)), v2.create(1.0, 0.0));
    return {
      point: p,
      normal: n
    };
  },

  intersectSegmentAabb2: function intersectSegmentAabb2(s0, s1, min, max) {
    // Returns proper intersection point if the segment
    // begins inside of the aabb
    var segments = [{ a: v2.create(min.x, min.y), b: v2.create(max.x, min.y) }, { a: v2.create(max.x, min.y), b: v2.create(max.x, max.y) }, { a: v2.create(max.x, max.y), b: v2.create(min.x, max.y) }, { a: v2.create(min.x, max.y), b: v2.create(min.x, min.y) }];
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      var res = coldet.intersectSegmentSegment(s0, s1, seg.a, seg.b);
      if (res) {
        return res;
      }
    }
    return null;
  },

  intersectRayAabb: function intersectRayAabb(o, d, min, max) {
    var eps = 0.00001;
    if (Math.abs(d.x) < eps) {
      d.x = eps * 2.0;
    }
    if (Math.abs(d.y) < eps) {
      d.y = eps * 2.0;
    }
    var tmin = v2.divElems(v2.sub(min, o), d);
    var tmax = v2.divElems(v2.sub(max, o), d);
    var rmin = v2.minElems(tmin, tmax);
    var rmax = v2.maxElems(tmin, tmax);
    var minmax = math.min(rmax.x, rmax.y);
    var maxmin = math.max(rmin.x, rmin.y);
    return minmax >= maxmin ? v2.add(o, v2.mul(d, minmax)) : null;
  },

  intersectCircleCircle: function intersectCircleCircle(pos0, rad0, pos1, rad1) {
    var r = rad0 + rad1;
    var toP1 = v2.sub(pos1, pos0);
    var distSqr = v2.lengthSqr(toP1);
    if (distSqr < r * r) {
      var dist = Math.sqrt(distSqr);
      return {
        dir: dist > 0.00001 ? v2.div(toP1, dist) : v2.create(1.0, 0.0),
        pen: r - dist
      };
    }
    return null;
  },

  intersectAabbCircle: function intersectAabbCircle(min, max, pos, rad, isPlayerCollision) {
    if (pos.x >= min.x && pos.x <= max.x && pos.y >= min.y && pos.y <= max.y) {
      var e = v2.mul(v2.sub(max, min), 0.5);
      var c = v2.add(min, e);
      var p = v2.sub(pos, c);
      var xp = Math.abs(p.x) - e.x - rad;
      var yp = Math.abs(p.y) - e.y - rad;
      if (xp > yp) {
        return {
          dir: v2.create(p.x > 0.0 ? 1.0 : -1.0, 0.0),
          pen: -xp
        };
      } else {
        return {
          dir: v2.create(0.0, p.y > 0.0 ? 1.0 : -1.0),
          pen: -yp
        };
      }
    } else {
      var cpt = v2.create(math.clamp(pos.x, min.x, max.x), math.clamp(pos.y, min.y, max.y));
      var dir = v2.sub(pos, cpt);

      if (isPlayerCollision) {
        dir = v2.sub(cpt, pos);
      } else {
        dir = v2.sub(pos, cpt);
      }

      var dstSqr = v2.lengthSqr(dir);
      if (dstSqr < rad * rad) {
        var dst = Math.sqrt(dstSqr);
        return {
          dir: dst > 0.0001 ? v2.div(dir, dst) : v2.create(1.0, 0.0),
          pen: rad - dst
        };
      }
    }
    return null;
  },

  intersectAabbAabb: function intersectAabbAabb(min0, max0, min1, max1) {
    var e0 = v2.mul(v2.sub(max0, min0), 0.5);
    var c0 = v2.add(min0, e0);
    var e1 = v2.mul(v2.sub(max1, min1), 0.5);
    var c1 = v2.add(min1, e1);
    var n = v2.sub(c1, c0);
    var xo = e0.x + e1.x - Math.abs(n.x);
    if (xo > 0.0) {
      var yo = e0.y + e1.y - Math.abs(n.y);
      if (yo > 0.0) {
        if (xo > yo) {
          return {
            dir: n.x < 0.0 ? v2.create(-1.0, 0.0) : v2.create(1.0, 0.0),
            pen: xo
          };
        } else {
          return {
            dir: n.y < 0.0 ? v2.create(0.0, -1.0) : v2.create(0.0, 1.0),
            pen: yo
          };
        }
      }
    }
    return null;
  },

  /**
   * Calculates the overlapping area of two rectangle collions and reutrns its distance and direction to avoid overlap for the second rectangle
   * @param min0 v2 Bottom left corner of the first rectangle
   * @param max0 v2 Top Right corner of the first rectangle
   * @param min1 v2 Bottom left corner of the second rectangle
   * @param max1 v2 Top Right corner of the second rectangle
   * @returns Object with the dir and pen of the collision
   */
  intersectAabbRectangle: function intersectAabbRectangle(min0, max0, min1, max1) {
    // Get the sides of the overlap rectangle
    var overlapX = Math.min(max0.x, max1.x) - Math.max(min0.x, min1.x);
    var overlapY = Math.min(max0.y, max1.y) - Math.max(min0.y, min1.y);

    //  console.log("OverlapX Rectangle "+overlapX);
    // console.log("OverlapY Rectangle "+overlapY);

    // If either are below 0, there is no overlap
    if (overlapX > 0 && overlapY > 0) {
      //   console.log("Overlap Rectangle");
      var dirx = 0.0;
      var diry = 0.0;
      // Look for the smallest overlap side
      if (overlapX < overlapY) {
        // If the second rectangle minx is bigger the collision comes from the right
        if (min0.x < min1.x) {
          dirx = -1.0;
        } else {
          dirx = 1.0;
        }
      } else {
        // If the second rectangle miny is bigger the collision comes from the right
        if (min0.y < min1.y) {
          diry = -1.0;
        } else {
          diry = 1.0;
        }
      }
      return {
        dir: v2.create(dirx, diry),
        pen: Math.min(overlapX, overlapY)
      };
    }
    return null;
  },

  /**
   * Calculates the overlapping area of a circle and melee rectangle
   * @param meleeCollider melee rectangle
   * @param obstacleCollider collider rectangle
   * @returns intersection
   */
  intersectMeleeCircle: function intersectMeleeCircle(meleeCollider, obstacleCollider) {
    var meleeCenterX = meleeCollider.pos.x;
    var meleeCenterY = meleeCollider.pos.y;

    meleeCenterX = (meleeCollider.pts[0].x + meleeCollider.pts[1].x + meleeCollider.pts[2].x + meleeCollider.pts[3].x) / 4;
    meleeCenterY = (meleeCollider.pts[0].y + meleeCollider.pts[1].y + meleeCollider.pts[2].y + meleeCollider.pts[3].y) / 4;

    var meleeWidth = this.getDistance(meleeCollider.pts[0].x, meleeCollider.pts[0].y, meleeCollider.pts[2].x, meleeCollider.pts[2].y);
    var meleeHeight = this.getDistance(meleeCollider.pts[0].x, meleeCollider.pts[0].y, meleeCollider.pts[1].x, meleeCollider.pts[1].y);

    //Math.abs(meleeCollider.max.x - meleeCollider.min.x)
    var rectX = meleeCenterX - meleeWidth / 2;
    var rectY = meleeCenterY - meleeHeight / 2;

    var rectReferenceX = rectX;
    var rectReferenceY = rectY;

    var rot = meleeCollider.angle * (Math.PI / 180);

    // Rotate circle's center point back
    var unrotatedCircleX = Math.cos(rot) * (obstacleCollider.pos.x - meleeCenterX) - Math.sin(rot) * (obstacleCollider.pos.y - meleeCenterY) + meleeCenterX;
    var unrotatedCircleY = Math.sin(rot) * (obstacleCollider.pos.x - meleeCenterX) + Math.cos(rot) * (obstacleCollider.pos.y - meleeCenterY) + meleeCenterY;

    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
    var closestX, closestY;

    // Find the unrotated closest x point from center of unrotated circle
    if (unrotatedCircleX < rectReferenceX) {
      closestX = rectReferenceX;
    } else if (unrotatedCircleX > rectReferenceX + meleeWidth) {
      closestX = rectReferenceX + meleeWidth;
    } else {
      closestX = unrotatedCircleX;
    }

    // Find the unrotated closest y point from center of unrotated circle
    if (unrotatedCircleY < rectReferenceY) {
      closestY = rectReferenceY;
    } else if (unrotatedCircleY > rectReferenceY + meleeHeight) {
      closestY = rectReferenceY + meleeHeight;
    } else {
      closestY = unrotatedCircleY;
    }

    // Determine collision
    var collision = false;
    var distance = this.getDistance(unrotatedCircleX, unrotatedCircleY, closestX, closestY);

    if (distance < obstacleCollider.rad) {
      collision = true;

      console.log("rectangles-circle intersection");
      return {
        dir: v2.create(0.0, 1.0),
        pen: distance
      };
    } else {
      console.log("rectangles-circle NOT intersection");
      collision = false;
      return null;
    }
  },


  /**
   * Calculates if two rectangles are overlapping their edges
   * @param {float} min0 v2 Bottom left corner of the first rectangle
   * @param {float} max0 v2 Top Right corner of the first rectangle
   * @param {float} min1 v2 Bottom left corner of the second rectangle
   * @param {float} max1 v2 Top Right corner of the second rectangle
   * @returns Booleean
   * */
  intersectRectangleBorder: function intersectRectangleBorder(min0, max0, min1, max1) {
    var rect1 = { min: min0, max: max0 };
    var rect2 = { min: min1, max: max1 };
    var overlapBoder = false;

    //Width and Height of rect2 bigger that the rect1
    if (max0.x - min0.x < max1.x - min1.x && max0.y - min0.y < max1.y - min1.y) {
      rect1 = { min: min1, max: max1 };
      rect2 = { min: min0, max: max0 };
    }

    if (rect1.min.x < rect2.min.x && rect1.max.x > rect2.max.x) {
      if (rect1.min.y < rect2.min.y && rect1.max.y > rect2.max.y) {
        overlapBoder = true;
      }
    }

    return overlapBoder;
  },

  getDistance: function getDistance(fromX, fromY, toX, toY) {
    var dX = Math.abs(fromX - toX);
    var dY = Math.abs(fromY - toY);

    return Math.sqrt(dX * dX + dY * dY);
  },

  /**
   * Calculates the overlapping area of two rotated rectangle collions
   * @param meleeCollider melee rectangle
   * @param obstacleCollider collider rectangle
   * @returns intersection
   */
  intersectRotatedRectangle: function intersectRotatedRectangle(meleeCollider, obstacleCollider) {
    var rectangles = [meleeCollider, obstacleCollider];
    var minA = void 0,
        maxA = void 0,
        projected = void 0,
        i = void 0,
        i1 = void 0,
        j = void 0,
        minB = void 0,
        maxB = void 0,
        pen = void 0,
        dir = void 0;
    var existsIntersection = false;

    var lenght = rectangles.length;
    for (i = 0; i < lenght; i++) {
      // for each rectangle, look at each edge of the rectangle, and determine if it separates
      // the two shapes
      var pts = rectangles[i];
      var ptsLenght = pts.length;
      for (i1 = 0; i1 < ptsLenght; i1++) {
        //2

        // grab 2 vertices to create an edge
        var i2 = (i1 + 1) % pts.length;
        var p1 = pts[i1];
        var p2 = pts[i2];

        // find the line perpendicular to this edge
        var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

        minA = maxA = undefined;
        // for each vertex in the first shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        for (j = 0; j < meleeCollider.length; j++) {
          projected = normal.x * meleeCollider[j].x + normal.y * meleeCollider[j].y;
          if (!minA || projected < minA) {
            minA = projected;
          }
          if (!maxA || projected > maxA) {
            maxA = projected;
          }
        }

        // for each vertex in the second shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        minB = maxB = undefined;
        for (j = 0; j < obstacleCollider.length; j++) {
          projected = normal.x * obstacleCollider[j].x + normal.y * obstacleCollider[j].y;
          if (!minB || projected < minB) {
            minB = projected;
          }
          if (!maxB || projected > maxB) {
            maxB = projected;
          }
        }

        // if there is no overlap between the projects, the edge we are looking at separates the two
        // rectangles, and we know there is no overlap
        if (maxA < minB || maxB < minA) {
          return null;
        } else {
          // TODO: Calculate correct pen and dir
          if (minB <= maxA) {
            pen = minB;
          } else {
            //minA <= maxB
            pen = minA;
          }
          existsIntersection = true;
        }
      }
    }

    if (existsIntersection) {
      return {
        dir: v2.create(0.0, 1.0),
        pen: pen
      };
    } else {
      return null;
    }
  }
};

module.exports = coldet;
