class MatrixChange {

  static doStartSnap(point, start) {
    let nearStartingPoint = Math.abs(start.x - point.x) < 6 && Math.abs(start.y - point.y) < 6;
    return nearStartingPoint ? start : point;
  }

  static multiMatrixTom(A, B) {
    A = [
      [A[0], A[2], A[4]],
      [A[1], A[3], A[5]],
      [0, 0, 1]
    ];
    B = [
      [B[0], B[2], B[4]],
      [B[1], B[3], B[5]],
      [0, 0, 1]
    ];
    const arr = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let ai = 0; ai < A.length; ai++) {
      for (let bj = 0; bj < B[0].length; bj++) {
        for (let aj = 0; aj < A[0].length; aj++) {
          for (let bi = 0; bi < B.length; bi++) {
            if (aj === bi) {
              arr[ai][bj] += A[ai][aj] * B[bi][bj];
            }
          }
        }
      }
    }
    return [arr[0][0], arr[1][0], arr[0][1], arr[1][1], arr[0][2], arr[1][2]];
  }

  static toMatrix(w, h, angle, x, y) {
    return [w * Math.cos(angle), w * Math.sin(angle), -h * Math.sin(angle), h * Math.cos(angle), x, y];
  }

  static toCss(obj) {
    const matrix = MatrixChange.toMatrix(obj.w, obj.h, obj.angle, obj.x, obj.y);
    return "matrix(" + matrix.join(",") + ")";
  }

  static mergeInfoObjects(a, b) {
    return {h: a.h * b.h, w: a.w * b.w, angle: a.angle + b.angle, x: a.x + b.x, y: a.y + b.y};
  }
}