export interface Point {
  x: number;
  y: number;
}

export interface ShapeStyle {
  strokeWidth: number;
  strokeColor: string;
  jitter: number; // 抖动系数
}

export type ShapeType = 'circle' | 'rectangle' | 'line' | 'point';

export interface BaseShape {
  id: string;
  type: ShapeType;
  position: Point;
  style: ShapeStyle;
}

export interface Circle extends BaseShape {
  type: 'circle';
  radius: number;
}

export interface Rectangle extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface Line extends BaseShape {
  type: 'line';
  points: Point[];
}

export interface PointShape extends BaseShape {
  type: 'point';
}

export type Shape = Circle | Rectangle | Line | PointShape;

// 默认样式
export const defaultShapeStyle: ShapeStyle = {
  strokeWidth: 3,
  strokeColor: '#000000',
  jitter: 0.02,
};
