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

  change(whaxy){
    const c = this.clone();
    c.x += whaxy.x;
    c.y += whaxy.y;
    c.w *= whaxy.w;
    c.h *= whaxy.h;
    c.angle += whaxy.angle;
    return c;
  }

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

  getVisualValues(){
    return {
      w: this.w,
      h: this.h,
      angle: this.getAngle(),
      x:this.x,
      y: this.y
    };
  }

  static generateId() {
    return ShapeInfoObject.__sessionID++;
  }
}
ShapeInfoObject.__sessionID = new Date().getTime();