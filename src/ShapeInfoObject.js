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
  rotate(deg) {
    this.angle = (2 * Math.PI + (this.angle + deg / 50)) % (2 * Math.PI);
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  scaleSquare(y) {
    this.w = this.h = this.h + y / 20;
  }

  scaleRestrict(y) {
    const divis = this.w / this.h;
    this.w += y / 30 * divis;
    this.h += y / 30;
  }

  scaleFree(x, y) {
    let cos = Math.cos(this.angle);
    let sin = Math.sin(this.angle);
    let nx = cos * x + sin * y;
    let ny = cos * y - sin * x;
    this.w += nx / 20;
    this.h -= ny / 20;
  }

  getBoundingRect() {
    let square = {left: this.x, top: this.y, width: this.w * 40, height: this.h * 40};
    square.right = square.left + square.width;
    square.bottom = square.top + square.height;
    if (square.right < square.left) {
      let l = square.left;
      square.left = square.right;
      square.right = l;
    }
    if (square.bottom < square.top) {
      let t = square.top;
      square.top = square.bottom;
      square.bottom = t;
    }
    return square;
  }

  static getSurroundingSquare(elems) {
    if (!elems || elems.length == 0)
      return {left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0};
    let res = elems[0].getBoundingRect();
    for (let i = 1; i < elems.length; i++) {
      let next = elems[i].getBoundingRect();
      res.left = Math.min(res.left, next.left);
      res.top = Math.min(res.top, next.top);
      res.right = Math.max(res.right, next.right);
      res.bottom = Math.max(res.bottom, next.bottom);
    }
    res.width = res.right - res.left;
    res.height = res.bottom - res.top;
    return res;
  }

  mirror() {
    this.w *= -1;
  }

  center() {
    this.centered = !this.centered;
  }

  zUp() {
    this.zIndex += 1;
  }

  zDown() {
    this.zIndex -= 1;
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
  static push(array, obj) {
    array = array.slice();
    array.push(obj);
    return array;
  }

  static filter(array, numbers) {
    return array.filter(function (item) {
      return numbers.indexOf(item.number) == -1;
    });
  }

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
    ar = ImmutableArrayFunctions.alter(ar, selected, ShapeInfoObject.prototype.scaleFree, -10, 10);
    stop = new Date().getTime();
    console.log("speed 2: " + (stop - start));
  }
}