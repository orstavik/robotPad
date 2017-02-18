class MoveChange {
  constructor(startPoint) {
    this.start = startPoint;
    this.xMove = 0;
    this.yMove = 0;
  }

  update(newPoint, shift) {
    this.newPoint = MatrixChange.doStartSnap(newPoint, this.start);
    this.xMove = this.newPoint.x - this.start.x;
    this.yMove = this.newPoint.y - this.start.y;
  }

  changeForPoint(x,y){
    return {w: 1, h: 1, angle: 0, x: this.xMove, y: this.yMove};
  }

  asInfoObject(){
    return {w: 1, h: 1, angle: 0, x: this.xMove, y: this.yMove};
  }

  static makeMoveChange(start,end){
    let c = new MoveChange(start);
    c.update(end, false);
    return c;
  }
}