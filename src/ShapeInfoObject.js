//This "is" an Immutable object, don't change its fields, you only get copies when you make changes.
class ShapeInfoObject {
  constructor(x, y) {
    this.number = ShapeInfoObject.generateId();
    this.style = "no";
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.angle = 0;
    this.zIndex = 1000;
    this.centered = true;
  }

  clone() {
    return Object.assign(new ShapeInfoObject(0, 0), this);
  }

  static from(pojo) {
    return Object.assign(new ShapeInfoObject(0, 0), pojo);
  }

  makeCopy() {
    const c = this.clone();
    c.number = ShapeInfoObject.generateId();
    return c;
  }

  //2*PI = 360gr
  rotate(radian) {
    const c = this.clone();
    c.angle += radian;
    return c;
  }

  //todo i can take the ShapeInfoObject and place it into the ItemMarker instead.
  //todo that means making the item-marker hold the shapeInfoObjects as a subunit, and so when I apply the matrix to them,
  //todo they automatically change with the css.
  //todo BUT can i take out the x,y coordinates at any point??
  change(change){
    if (change instanceof ScaleChange)
      return this.scaleInBox(change);
    if (change instanceof RotateChange)
      return this.rotatePositionFromExternalPoint(change);
    if (change instanceof MoveChange)
      return this.move(change);
  }

  move(change) {
    const c = this.clone();
    c.x += change.getX();
    c.y += change.getY();
    return c;
  }

  rotatePositionFromExternalPoint(change) {
    const newPos = this.calcNewSatelitePosition(change.getCenter(), change.getAngle());
    const c = this.rotate(change.getAngle());
    c.x = newPos.x;
    c.y = newPos.y;
    return c;
  }

  calcNewSatelitePosition(center, angleChange) {
    const x = this.x - center.x;           //the center of this group = {0,0}. The position of the shape from this center = {x,y}.
    const y = this.y - center.y;
    const radius = Math.sqrt(x * x + y * y);    //the length of the radius from the center of the group to the center of the shape.
    const oldAngle = Math.atan2(y, x);          //the angle between the vertical (horisontal?) line and to the shape, from 0->2PI
    const newAngle = oldAngle + angleChange;    //adds the angle change
    const newX = Math.cos(newAngle) * radius;   //calculates the new x and y coordinates to where the shape should move.
    const newY = Math.sin(newAngle) * radius;
    return {x: center.x + newX, y: center.y + newY};  //returns the new position positioned against the underlying map again.
  }
  //todo does not work in rotated space start
  scaleInBox(change) {
    const c = this.clone();
    c._moveInScaledBox(change.percentX, change.percentY, change.box, change.direction);
    c._scaleInRotatedBox(change.percentX, change.percentY);
    return c;
  }

  _moveInScaledBox(xPercent, yPercent, box, direction) {
    if (direction.indexOf("s") >= 0)
      this.y += (this.y - box.top) * yPercent;
    else if (direction.indexOf("n") >= 0)
      this.y -= (box.bottom - this.y) * yPercent;
    if (direction.indexOf("e") >= 0)
      this.x += (this.x - box.left) * xPercent;
    else if (direction.indexOf("w") >= 0)
      this.x -= (box.right - this.x) * xPercent;
  }

  static rotateAng(x,y,a) {
    let nx = (Math.cos(a)*x)+(Math.sin(a)*y);
    let ny = (Math.cos(a)*y)-(Math.sin(a)*x);
    return [nx,ny];
  }

  _scaleInRotatedBox(xPercent, yPercent) {
    let newVector = ShapeInfoObject.rotateAng(xPercent, yPercent, this.angle);
    this.h *= (1+newVector[0]);
    this.w *= (1+newVector[1]);
  }
  //todo does not work in rotated space end
  mirror() {
    const c = this.clone();
    c.w *= -1;
    return c;
  }

  center() {
    const c = this.clone();
    c.centered = !c.centered;
    return c;
  }

  zUp() {
    const c = this.clone();
    c.zIndex += 1;
    return c;
  }

  zDown() {
    const c = this.clone();
    c.zIndex -= 1;
    return c;
  }

  setStyle(styleName) {
    const c = this.clone();
    c.style = styleName;
    return c;
  }

  update(value) {
    return Object.assign(this.clone(), value);
  }

  getAngle() {
    return this.style.startsWith("tone") ? 0 : this.angle;
  }

  getMatrix(){
    const angle = this.getAngle();
    return [
      this.w * Math.cos(angle),
      this.w * Math.sin(angle),
      -this.h * Math.sin(angle),
      this.h * Math.cos(angle),
      this.x,
      this.y];
  }

  cssMatrix() {
    return "matrix(" + this.getMatrix().join(',') + ")";
  }

  static generateId() {
    return ShapeInfoObject.__sessionID++;
  }
}
ShapeInfoObject.__sessionID = new Date().getTime();