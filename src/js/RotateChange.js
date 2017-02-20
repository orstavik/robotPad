class RotateChange {
  constructor(startPoint, center) {
    this.start = startPoint;        //don't really need
    this.center = center;
    this.startAngle = RotateChange.calcAngle(this.center, startPoint);
    this.angle = 0;
  }

  changeForPoint(px, py) {
    const x = px - this.center.x;               //The position of the shape from this.center = {x,y}.
    const y = py - this.center.y;
    const radius = Math.sqrt(x * x + y * y);    //the length of the radius from the center of the group to the center of the shape.
    const oldAngle = Math.atan2(y, x);          //the angle between the vertical (horisontal?) line and to the shape, from 0->2PI
    const newPoint = RotateChange.newPointForAngle(oldAngle + this.angle, radius);
    const xMove = this.center.x -px + newPoint.x;
    const yMove = this.center.y - py + newPoint.y;   
    return {w: 1, h: 1, angle: this.angle, x: xMove, y: yMove};
  }

  update(newPoint, shift) {
    this.newPoint = MatrixChange.doStartSnap(newPoint, this.start);
    this.absAngle = RotateChange.calcAngle(this.center, this.newPoint);
    this.angle = this.absAngle - this.startAngle;
  }

  //calculates the position of a point at a given angle (rad) from center 0,0
  static newPointForAngle(angle, radius){
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  static calcAngle(center, satelite) {
    return Math.atan2(satelite.y - center.y, satelite.x - center.x);
  }
}