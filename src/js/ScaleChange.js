class ScaleChange {
  constructor(startPoint, center) {
    this.start = startPoint;
    this.center = center;
    this.xDistStart = this.start.x - this.center.x;
    this.yDistStart = this.start.y - this.center.y;
    this.center.x -= this.xDistStart;
    this.center.y -= this.yDistStart;
    this.xDistStart *=2;
    this.yDistStart *=2;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.w = 1;
    this.h = 1;
  }

  update(newPoint, shift) {
    newPoint = MatrixChange.doStartSnap(newPoint, this.start);
    this.xDistNow = newPoint.x - this.center.x;
    this.yDistNow = newPoint.y - this.center.y;
    this.w = this.xDistNow / this.xDistStart;
    this.h = this.yDistNow / this.yDistStart;
  }

  changeForPoint(x, y) {
    let asInfoObject2 = this.asInfoObject();
    let xDistPoint = x - this.center.x;
    let yDistPoint = y - this.center.y;
    asInfoObject2.x = (xDistPoint * (this.w-1));
    asInfoObject2.y = (yDistPoint * (this.h-1));

    //todo change .w and .h so that it fits with the angle of the info

    return asInfoObject2;
  }

  asInfoObject() {
    return {w: this.w, h: this.h, angle: 0, x: this.x, y: this.y};
  }
}