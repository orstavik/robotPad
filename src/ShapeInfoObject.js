//This "is" an Immutable object, don't change its fields, you only get copies when you make changes.
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
    return Object.assign(new ShapeInfoObject(0, 0), this);
  }

  makeCopy() {
    const c = this.clone();
    c.number = ShapeInfoObject.generateId();
    return c;
  }

  //2*PI = 360gr
  rotate(radian) {
    const c = this.clone();
    c.angle += radian;
    return c;
  }

  move(x, y) {
    const c = this.clone();
    c.x += x;
    c.y += y;
    return c;
  }

  rotatePositionFromExternalPoint(center, angle) {
    const newPos = this.calcNewSatelitePosition(center, angle);
    const c = this.rotate(angle);
    c.x = newPos.x;
    c.y = newPos.y;
    return c;
  }

  calcNewSatelitePosition(center, angleChange) {
    const x = this.x - center.x;           //the center of this group = {0,0}. The position of the shape from this center = {x,y}.
    const y = this.y - center.y;
    const radius = Math.sqrt(x * x + y * y);    //the length of the radius from the center of the group to the center of the shape.
    const oldAngle = Math.atan2(y, x);          //the angle between the vertical (horisontal?) line and to the shape, from 0->2PI
    const newAngle = oldAngle + angleChange;    //adds the angle change
    const newX = Math.cos(newAngle) * radius;   //calculates the new x and y coordinates to where the shape should move.
    const newY = Math.sin(newAngle) * radius;
    return {x: center.x + newX, y: center.y + newY};  //returns the new position positioned against the underlying map again.
  }

  scaleDirection(xPercent, yPercent, topDistance, rightDistance, bottomDistance, leftDistance, direction) {
    const c = this.clone();
    if (direction.indexOf("s") >= 0) {
      c.y -= topDistance * yPercent;
      c.h *= (1+yPercent);
    }
    if (direction.indexOf("n") >= 0) {
      c.y -= bottomDistance * yPercent;
      c.h *= (1-yPercent);
    }
    if (direction.indexOf("e") >= 0) {
      c.x += leftDistance * xPercent;
      c.w *= (1+xPercent);
    }
    if (direction.indexOf("w") >= 0) {
      c.x += rightDistance * xPercent;
      c.w *= (1-xPercent);
    }
    return c;
  }

  mirror() {
    const c = this.clone();
    c.w *= -1;
    return c;
  }

  center() {
    const c = this.clone();
    c.centered = !c.centered;
    return c;
  }

  zUp() {
    const c = this.clone();
    c.zIndex += 1;
    return c;
  }

  zDown() {
    const c = this.clone();
    c.zIndex -= 1;
    return c;
  }

  setStyle(styleName) {
    const c = this.clone();
    c.style = styleName;
    return c;
  }

  update(value) {
    return Object.assign(this.clone(), value);
  }

  cssMatrix() {
    const angle = this.style.startsWith("tone") ? 0 : this.angle;
    const matrix = [
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