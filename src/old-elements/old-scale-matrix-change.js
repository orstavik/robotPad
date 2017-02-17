/**
 * Created by orstavik on 17.02.17.
 */

class ScaleChangeBackup {
  constructor(startPoint, boxWidth, boxHeight, direction, box) {
    this.start = startPoint;
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;
    this.action = "scale";
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

  getMatrix() {
    //        if (shift){
    //          this.percentX = 0;
    //          this.xMove = a little less or more?
    //        }
    //        if (ctrl){
    //          this.percentY = 0;
    //          this.yMove = a little less or more?
    //        }
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
}

