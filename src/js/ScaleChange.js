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
    this.newPoint = MatrixChange.doStartSnap(newPoint, this.start);
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

  applyToShapeInfoObject(info) {
    let c = ScaleChange._moveInScaledBox(this.percentX, this.percentY, this.box, this.direction, info);
    return ScaleChange._scaleInRotatedBox(this.percentX, this.percentY, c);
  }

  static rotateAng(x, y, a) {
    let nx = (Math.cos(a) * x) + (Math.sin(a) * y);
    let ny = (Math.cos(a) * y) - (Math.sin(a) * x);
    return [nx, ny];
  }

  static _scaleInRotatedBox(xPercent, yPercent, info) {
    const c = info.clone();
    let newVector = ScaleChange.rotateAng(xPercent, yPercent, c.angle);
    c.h *= (1 + newVector[0]);
    c.w *= (1 + newVector[1]);
    return c;
  }

  static _moveInScaledBox(xPercent, yPercent, box, direction, info) {
    const c = info.clone();
    if (direction.indexOf("s") >= 0)
      c.y += (c.y - box.top) * yPercent;
    else if (direction.indexOf("n") >= 0)
      c.y -= (box.bottom - c.y) * yPercent;
    if (direction.indexOf("e") >= 0)
      c.x += (c.x - box.left) * xPercent;
    else if (direction.indexOf("w") >= 0)
      c.x -= (box.right - c.x) * xPercent;
    return c;
  }

  getMatrix() {
    return [
      1 + this.percentX,
      0,
      0,
      1 + this.percentY,
      this.xMove,
      this.yMove];
  }

  subdueMatrix(matrix) {
    return MatrixChange.multiMatrixTom(matrix, this.getMatrix());
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