class ScaleChange {
  constructor(startPoint, center) {
    this.start = startPoint;
    this.xDistStart = this.start.x - center.x;
    this.yDistStart = this.start.y - center.y;
    this.center = {};
    this.center.x = center.x - this.xDistStart;
    this.center.y = center.y - this.yDistStart;
    this.xDistStart *= 2;
    this.yDistStart *= 2;
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

  changeForPoint(x, y, angle) {
    let whaxy = {w: this.w, h: this.h, angle: 0, x: this.x, y: this.y};
    let xDistPoint = x - this.center.x;
    let yDistPoint = y - this.center.y;
    whaxy.x = (xDistPoint * (this.w - 1));
    whaxy.y = (yDistPoint * (this.h - 1));
    if (!angle)
      return whaxy;

    let sqrt = Math.sqrt(whaxy.h*whaxy.h+whaxy.w*whaxy.w);
    console.log(sqrt);
    whaxy.w = Math.abs(Math.cos(angle) * this.w);
    whaxy.h = Math.abs(Math.sin(angle) * this.w);
    whaxy.h += Math.abs(Math.cos(-angle) * this.h);
    whaxy.w += Math.abs(Math.sin(-angle) * this.h);
    let sqrt2 = Math.sqrt(whaxy.h*whaxy.h+whaxy.w*whaxy.w);
    console.log(sqrt2);
    return whaxy;
  }
}