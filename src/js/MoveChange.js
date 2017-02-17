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

  asInfoObject(){
    return {w:1, h:1, angle: 0, x: this.getX(), y: this.getY()};
  }

  static makeMoveChange(start,end){
    let c = new MoveChange(start);
    c.update(end, false);
    return c;
  }
}