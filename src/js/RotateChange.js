class RotateChange {
  constructor(startPoint, center) {
    this.start = startPoint;        //don't really need
    this.center = center;
    this.startAngle = RotateChange.calcAngle(this.center, startPoint);
  }

  static calcAngle(center, satelite) {
    return Math.atan2(satelite.y - center.y, satelite.x - center.x);
  }

  calcNewSatelitePosition(point) {
    let x = point.x - this.center.x;                           //The position of the shape from this.center = {x,y}.
    let y = point.y - this.center.y;
    const radius = Math.sqrt(x * x + y * y);    //the length of the radius from the center of the group to the center of the shape.
    const oldAngle = Math.atan2(y, x);          //the angle between the vertical (horisontal?) line and to the shape, from 0->2PI
    const newAngle = oldAngle + this.getAngle();    //adds the angle change
    const newX = Math.cos(newAngle) * radius;   //calculates the new x and y coordinates to where the shape should move.
    const newY = Math.sin(newAngle) * radius;
    return {x: this.center.x -point.x + newX, y: this.center.y - point.y + newY};  //returns the new position positioned against the underlying map again.
  }

  update(newPoint, shift) {
    this.newPoint = MatrixChange.doStartSnap(newPoint, this.start);
    this.absAngle = this.getAbsoluteAngle();
    this.angle = this.absAngle - this.startAngle;
  }

  applyToShapeInfoObject(info) {
    let changes = this.calcNewSatelitePosition(info);
    changes.angle = this.getAngle();
    changes.w = 1;
    changes.h = 1;
    return info.applyChanges(changes);
  }

  asInfoObject(){
    return {w:1, h:1, angle: this.getAngle(), x: 0, y: 0};
  }

  getCenter(){
    return this.center;
  }
  getAngle() {
    return this.angle || 0;
  }

  getAbsoluteAngle() {
    return RotateChange.calcAngle(this.center, this.newPoint);
  }

  static toMatrix(rad) {
    return [
      Math.cos(rad),
      Math.sin(rad),
      -Math.sin(rad),
      Math.cos(rad),
      0,
      0
    ];
  }
}