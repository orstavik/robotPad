class WHXLAChange {
  constructor(startPoint, centerPoint, data) {
    this.start = startPoint;
    this.center = centerPoint;
    this.data = data;
    this.w = 1;
    this.h = 1;
    this.a = 0;
    this.x = 0;
    this.y = 0;
    //implement this constructor using super(startPoint, center, data)
  }

  asInfoObject() {
    return {w: this.w, h: this.h, angle: this.a, x: this.x, y: this.y};
  }

  update(newPoint, shift) {
    this.newPoint = this.doStartSnap(newPoint);
    this.doShift(shift);
    this.calc();
  }

  applyToShapeInfoObject(info) {
    return info.change(this.asInfoObjectForInfo(info));
  }

  doStartSnap(point) {
    if (Math.abs(this.start.x - point.x) < 6 && Math.abs(this.start.y - point.y) < 6)
      return this.start;
    return point;
  }

  calc(){
    throw new Error("must implement this method");
  }

   asInfoObjectForInfo(info) {
     throw new Error("must implement this method");
  }

  doShift(shift) {
    throw new Error("must implement this method");
  }
}