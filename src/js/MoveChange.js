class MoveChange {
  constructor(startPoint) {
    this.start = startPoint;
  }

  update(newPoint, shift) {
    this.newPoint = MatrixChange.doStartSnap(newPoint, this.start);
    this.xMove = this.newPoint.x - this.start.x;
    this.yMove = this.newPoint.y - this.start.y;
  }

  applyToShapeInfoObject(info){
    return info.move(this.getX(), this.getY());
  }

  getX(){
    return this.xMove || 0;
  }

  getY(){
    return this.yMove || 0;
  }

  getMatrix() {
//        if (shift)
//          this.yMove = 0;
//        if (ctrl)
//          this.xMove = 0;
    return [1, 0, 0, 1, this.getX(), this.getY()];
  }

  subdueMatrix(matrix) {
    return MatrixChange.multiMatrixTom(this.getMatrix(), matrix);
  }

  static makeMoveChange(start,end){
    let c = new MoveChange(start);
    c.update(end, false);
    return c;
  }
}