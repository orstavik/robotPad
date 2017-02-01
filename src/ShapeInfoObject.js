class ShapeInfoObject {
  constructor(x, y) {
    this.number = ShapeInfoObject.generateId();
    this.style = "no";
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.angle = 0;
    this.zIndex = 1000;
    this.centered = true;
  }

  clone() {
    return Object.assign(new ShapeInfoObject(0, 0), this); //this correctly overwrite the new number, as it should do.
  }

  makeCopy(x, y) {
    let c = this.clone();
    c.number = ShapeInfoObject.generateId();
    c.x += x;
    c.y += y;
    return c;
  }

  //2*PI = 360gr
  rotate(radian) {
    this.angle += radian;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  setNewPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  scaleDirection(xPercent, yPercent, topDistance, rightDistance, bottomDistance, leftDistance, direction) {
    if (direction.indexOf("s") >= 0) {
      this.y -= topDistance * yPercent;
      this.h *= (1+yPercent);
    }
    if (direction.indexOf("n") >= 0) {
      this.y -= bottomDistance * yPercent;
      this.h *= (1-yPercent);
    }
    if (direction.indexOf("e") >= 0) {
      this.x += leftDistance * xPercent;
      this.w *= (1+xPercent);
    }
    if (direction.indexOf("w") >= 0) {
      this.x += rightDistance * xPercent;
      this.w *= (1-xPercent);
    }
  }

  getLeft(widthCount) {
    let normal = this.x - (widthCount * (this.w - 1) / 2);
    return this.w < 0 ? normal + widthCount * this.w : normal;
  }

  getTop(heightCount) {
    let normal = this.y - (heightCount * (this.h - 1) / 2);
    return this.h < 0 ? normal + heightCount * this.h : normal;
  }

  getBoundingRect(factor) {
    let square = {
      left: this.getLeft(factor),
      top: this.getTop(factor),
      width: Math.abs(this.w) * factor,
      height: Math.abs(this.h) * factor
    };
    square.right = square.left + square.width;
    square.bottom = square.top + square.height;
    return square;
  }

  mirror() {
    let c = this.clone();
    c.w *= -1;
    return c;
  }

  center() {
    let c = this.clone();
    c.centered = !c.centered;
    return c;
  }

  zUp() {
    let c = this.clone();
    c.zIndex += 1;
    return c;
  }

  zDown() {
    let c = this.clone();
    c.zIndex -= 1;
    return c;
  }

  setStyle(styleName) {
    this.style = styleName;
  }

  update(value) {
    Object.assign(this, value);
  }

  getAngle() {
    let angle = this.angle;
    if (this.style.startsWith("tone"))
      angle = 0;
    return angle;
  }

  cssMatrix() {
    let angle = this.getAngle();
    let matrix = [
      this.w * Math.cos(angle),
      this.w * Math.sin(angle),
      -this.h * Math.sin(angle),
      this.h * Math.cos(angle),
      this.x,
      this.y];
    return "matrix(" + matrix.join(',') + ")";
  }

  static generateId() {
    return ShapeInfoObject.__sessionID++;
  }
}
ShapeInfoObject.__sessionID = new Date().getTime();

class ImmutableArrayFunctions {
  // static filter(array, numbers) {
  //   return array.filter(function (item) {
  //     return numbers.indexOf(item.number) == -1;
  //   });
  // }
  //
  //todo 10 times slower..
  static alterSlow(array, numbers, func, arg1, arg2) {
    array = array.map(function (item) {
      if (numbers.indexOf(item.number) == -1)
        return item;
      return func.call(item, arg1, arg2);
    });
    return array;
  }

  static alter(array, numbers, func, arg1, arg2) {
    let toBeAltered = [];
    array = array.map(function (item) {
      if (numbers.indexOf(item.number) == -1)
        return item;
      item = item.clone();
      toBeAltered.push(item);
      return item;
    });
    toBeAltered.map(function (item) {
      return func.call(item, arg1, arg2);
    });
    return array;
  }

  static replaceEqualNumber(original, replacements) {
    let listOfNumbers = replacements.map(function (item) {
      return item.number;
    });
    return original.map(function (item) {
      let posOfNumber = listOfNumbers.indexOf(item.number);
      if (posOfNumber == -1)
        return item;
      return replacements[posOfNumber];
    });
  }

  static alterPreSelected(array, func, arg1, arg2) {
    array.map(function (item) {
      return func.call(item, arg1, arg2);
    });
    return array;
  }

  //todo it looks like Stringify is 2x as slow as parse(?!).
  static testJSONstringifyParseSpeed() {
    let start = new Date().getTime();
    console.log("test1: " + start);
    let ar = [];
    for (var i = 0; i < 100000; i++) {
      ar[i] = JSON.stringify(start);
    }
    let stop = new Date().getTime();
    console.log("test1: " + (stop - start));
    start = stop;
    console.log("test2: " + start);
    for (var j = 0; j < 100000; j++) {
      ar[100000 + j] = JSON.parse(ar[j]);
    }
    stop = new Date().getTime();
    console.log("test2: " + (stop - start));
  }

  static testSpeed(count) {
    let start = new Date().getTime();
    console.log("speed 1: " + start);
    let ar = [];
    for (var i = 0; i < count; i++) {
      ar[i] = new ShapeInfoObject(i, i);
    }
    let stop = new Date().getTime();
    console.log("speed 1: " + (stop - start));

    let number = Math.floor(count / 10);
    let selected = [0, number * 1, number * 3, number * 5, number * 7, number * 2, number * 4, number * 6, number * 8, number * 9];

    start = stop;
    console.log("speed 2: " + start);
    ar = ImmutableArrayFunctions.alter(ar, selected, ShapeInfoObject.prototype.setNewPosition, -10, 10);
    stop = new Date().getTime();
    console.log("speed 2: " + (stop - start));
  }

  static testSpeedArrayMap(count) {
    let start = new Date().getTime();
    let ar = [];
    for (var i = 0; i < count; i++) {
      ar[i] = new ShapeInfoObject(i, i);
    }
    let stop = new Date().getTime();
    console.log("build array 1 for loop with building objects: " + (stop - start));

    start = stop;
    let ar2 = [];
    for (var i = 0; i < count; i++) {
      ar[i].move(10, 10);
    }
    stop = new Date().getTime();
    console.log("alter array for loop: " + (stop - start));

    start = stop;
    ar2 = [];
    for (var i = 0; i < count; i++) {
      ar[i].move(10, 10);
      ar2[i] = ar[i];
    }
    stop = new Date().getTime();
    console.log("alter array for loop, with duplication: " + (stop - start));

    start = stop;
    ar2 = ar.map(function (item) {
      item.move(9, 9)
    });
    stop = new Date().getTime();
    console.log("alter array map, old syntax: " + (stop - start));

    start = stop;
    ar2 = ar.map(item => item.move(10, 10));
    stop = new Date().getTime();
    console.log("alter array map, arrow syntax: " + (stop - start));
  }
}
// ImmutableArrayFunctions.testJSONstringifyParseSpeed();
// ImmutableArrayFunctions.testSpeed(100000);
// ImmutableArrayFunctions.testSpeedArrayMap(5000000);