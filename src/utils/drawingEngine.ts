import {Shape, ShapeStyle, Point, Circle, Rectangle, Line, PointShape} from '../models/Shape';
import {ParseResponse} from '../services/aiService';
import {generateId} from './helpers';

/**
 * 绘图引擎工具类
 * 负责图形的创建、转换和样式应用
 */
export class DrawingEngine {
  /**
   * 应用抖动效果（简笔画风格）
   * @param value 原始值
   * @param jitter 抖动系数
   * @returns 抖动后的值
   */
  static applyJitter(value: number, jitter: number): number {
    const randomOffset = (Math.random() - 0.5) * jitter * value;
    return value + randomOffset;
  }

  /**
   * 应用抖动到点坐标
   */
  static applyJitterToPoint(point: Point, jitter: number): Point {
    return {
      x: this.applyJitter(point.x, jitter),
      y: this.applyJitter(point.y, jitter),
    };
  }

  /**
   * 根据 AI 指令创建图形
   */
  static createShapeFromInstruction(
    instruction: ParseResponse,
    canvasSize: {width: number; height: number},
  ): Shape | null {
    if (!instruction.shape) {
      return null;
    }

    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const id = generateId();
    const style: ShapeStyle = {
      strokeWidth: 3,
      strokeColor: '#000000',
      jitter: 0.02,
    };

    switch (instruction.shape.type) {
      case 'circle': {
        const radius = instruction.shape.properties.radius || 50;
        return {
          id,
          type: 'circle',
          position: this.applyJitterToPoint({x: centerX, y: centerY}, 0.1),
          radius: this.applyJitter(radius, 0.05),
          style,
        } as Circle;
      }

      case 'rectangle': {
        const width = instruction.shape.properties.width || 100;
        const height = instruction.shape.properties.height || 100;
        return {
          id,
          type: 'rectangle',
          position: this.applyJitterToPoint(
            {x: centerX - width / 2, y: centerY - height / 2},
            0.1,
          ),
          width: this.applyJitter(width, 0.05),
          height: this.applyJitter(height, 0.05),
          style,
        } as Rectangle;
      }

      case 'line': {
        const startX = instruction.shape.properties.startX ?? centerX - 50;
        const startY = instruction.shape.properties.startY ?? centerY;
        const endX = instruction.shape.properties.endX ?? centerX + 50;
        const endY = instruction.shape.properties.endY ?? centerY;
        return {
          id,
          type: 'line',
          position: {x: 0, y: 0}, // 线不使用 position
          points: [
            this.applyJitterToPoint({x: startX, y: startY}, 0.1),
            this.applyJitterToPoint({x: endX, y: endY}, 0.1),
          ],
          style,
        } as Line;
      }

      case 'point': {
        return {
          id,
          type: 'point',
          position: this.applyJitterToPoint({x: centerX, y: centerY}, 0.1),
          style,
        } as PointShape;
      }

      default:
        return null;
    }
  }

  /**
   * 创建默认圆形
   */
  static createDefaultCircle(
    position: Point,
    radius: number = 50,
  ): Circle {
    return {
      id: generateId(),
      type: 'circle',
      position,
      radius,
      style: {
        strokeWidth: 3,
        strokeColor: '#000000',
        jitter: 0.02,
      },
    };
  }

  /**
   * 创建默认矩形
   */
  static createDefaultRectangle(
    position: Point,
    width: number = 100,
    height: number = 100,
  ): Rectangle {
    return {
      id: generateId(),
      type: 'rectangle',
      position,
      width,
      height,
      style: {
        strokeWidth: 3,
        strokeColor: '#000000',
        jitter: 0.02,
      },
    };
  }

  /**
   * 创建默认直线
   */
  static createDefaultLine(start: Point, end: Point): Line {
    return {
      id: generateId(),
      type: 'line',
      position: {x: 0, y: 0},
      points: [start, end],
      style: {
        strokeWidth: 3,
        strokeColor: '#000000',
        jitter: 0.02,
      },
    };
  }

  /**
   * 创建默认点
   */
  static createDefaultPoint(position: Point): PointShape {
    return {
      id: generateId(),
      type: 'point',
      position,
      style: {
        strokeWidth: 3,
        strokeColor: '#000000',
        jitter: 0.02,
      },
    };
  }
}
