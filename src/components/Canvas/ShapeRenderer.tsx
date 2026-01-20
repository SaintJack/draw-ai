import React from 'react';
import {Circle, Rect, Line, Circle as SVGCircle} from 'react-native-svg';
import {Shape, Circle, Rectangle, Line as LineShape, PointShape} from '../../models/Shape';
import {DrawingEngine} from '../../utils/drawingEngine';

interface ShapeRendererProps {
  shape: Shape;
  onPress?: (shapeId: string) => void;
  selected?: boolean;
}

/**
 * 图形渲染器组件
 * 负责将 Shape 数据模型渲染为 SVG 元素
 */
export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shape,
  onPress,
  selected = false,
}) => {
  const baseProps = {
    stroke: selected ? '#2196F3' : shape.style.strokeColor,
    strokeWidth: shape.style.strokeWidth,
    fill: 'none',
    onPress: onPress ? () => onPress(shape.id) : undefined,
  };

  switch (shape.type) {
    case 'circle': {
      const circle = shape as Circle;
      // 应用抖动效果
      const cx = DrawingEngine.applyJitter(
        circle.position.x,
        circle.style.jitter,
      );
      const cy = DrawingEngine.applyJitter(
        circle.position.y,
        circle.style.jitter,
      );
      const radius = DrawingEngine.applyJitter(
        circle.radius,
        circle.style.jitter,
      );

      return (
        <SVGCircle
          key={shape.id}
          cx={cx}
          cy={cy}
          r={radius}
          {...baseProps}
        />
      );
    }

    case 'rectangle': {
      const rect = shape as Rectangle;
      // 应用抖动效果
      const x = DrawingEngine.applyJitter(
        rect.position.x,
        rect.style.jitter,
      );
      const y = DrawingEngine.applyJitter(
        rect.position.y,
        rect.style.jitter,
      );
      const width = DrawingEngine.applyJitter(
        rect.width,
        rect.style.jitter,
      );
      const height = DrawingEngine.applyJitter(
        rect.height,
        rect.style.jitter,
      );

      return (
        <Rect
          key={shape.id}
          x={x}
          y={y}
          width={width}
          height={height}
          {...baseProps}
        />
      );
    }

    case 'line': {
      const line = shape as LineShape;
      if (line.points.length < 2) {
        return null;
      }

      // 应用抖动效果
      const start = DrawingEngine.applyJitterToPoint(
        line.points[0],
        line.style.jitter,
      );
      const end = DrawingEngine.applyJitterToPoint(
        line.points[1],
        line.style.jitter,
      );

      return (
        <Line
          key={shape.id}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          {...baseProps}
        />
      );
    }

    case 'point': {
      const point = shape as PointShape;
      // 点渲染为小圆
      const cx = DrawingEngine.applyJitter(
        point.position.x,
        point.style.jitter,
      );
      const cy = DrawingEngine.applyJitter(
        point.position.y,
        point.style.jitter,
      );

      return (
        <SVGCircle
          key={shape.id}
          cx={cx}
          cy={cy}
          r={3}
          {...baseProps}
          fill={baseProps.stroke}
        />
      );
    }

    default:
      return null;
  }
};
