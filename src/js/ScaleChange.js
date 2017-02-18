class ScaleChange {
  constructor(startPoint, center, direction, box) {
    this.start = startPoint;
    this.center = center;
    let xMove = this.start.x - center.x;
    let yMove = this.start.y - center.y;
    this.boxWidth = Math.abs(xMove) * 2;
    this.boxHeight = Math.abs(yMove) * 2;
    this.direction = direction;
    this.box = box;
    this.percentX = 0;
    this.percentY = 0;
    this.xMove = 0;
    this.yMove = 0;
  }

  update(newPoint, shift) {
    newPoint = MatrixChange.doStartSnap(newPoint, this.start);
    let xMove = newPoint.x - this.start.x;
    let yMove = newPoint.y - this.start.y;

    if (this.direction.indexOf("n") < 0 && this.direction.indexOf("s") < 0)
      yMove = 0;
    if (this.direction.indexOf("e") < 0 && this.direction.indexOf("w") < 0)
      xMove = 0;

    this.percentX = xMove / this.boxWidth;
    this.percentY = yMove / this.boxHeight;
    this.yMove = this.percentY * this.boxHeight / 2;
    this.xMove = this.percentX * this.boxWidth / 2;
    if (this.direction.indexOf("n") >= 0)
      this.percentY *= -1;
    if (this.direction.indexOf("w") >= 0)
      this.percentX *= -1;
  }

   changeForPoint(x, y) {
    let c = this.asInfoObject();
    if (this.direction.indexOf("s") >= 0)
      c.y = (y - this.box.top) * this.percentY;
    else if (this.direction.indexOf("n") >= 0)
      c.y = (this.box.bottom - y) * -this.percentY;
    if (this.direction.indexOf("e") >= 0)
      c.x = (x - this.box.left) * this.percentX;
    else if (this.direction.indexOf("w") >= 0)
      c.x = (this.box.right - x) * -this.percentX;
    return c;
  }

  asInfoObject() {
    return {w: 1 + this.percentX, h: 1 + this.percentY, angle: 0, x: this.xMove, y: this.yMove};
  }

  shift() {
    this.percentX = 0;
    // this.xMove = a little less or more?
  }

  ctrl() {
    this.percentY = 0;
    // this.yMove = a little less or more?
  }
}