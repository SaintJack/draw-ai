import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Dimensions, GestureResponderEvent} from 'react-native';
import Svg from 'react-native-svg';
import {useDrawingStore} from '../../store/drawingStore';
import {ShapeRenderer} from './ShapeRenderer';
import {Point} from '../../models/Shape';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface DrawingCanvasProps {
  onShapePress?: (shapeId: string) => void;
}

/**
 * 画布主组件
 * 负责渲染所有图形和处理交互
 */
export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onShapePress,
}) => {
  const {shapes, updateShapePosition, deleteShape} = useDrawingStore();
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [draggingShapeId, setDraggingShapeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({x: 0, y: 0});

  // 处理图形点击
  const handleShapePress = useCallback(
    (shapeId: string) => {
      setSelectedShapeId(shapeId);
      if (onShapePress) {
        onShapePress(shapeId);
      }
    },
    [onShapePress],
  );

  // 处理触摸开始（开始拖动）
  const handleTouchStart = useCallback(
    (event: GestureResponderEvent) => {
      const {locationX, locationY} = event.nativeEvent;

      // 查找点击的图形（从后往前，优先选择最上层的）
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (isPointInShape({x: locationX, y: locationY}, shape)) {
          setDraggingShapeId(shape.id);
          setSelectedShapeId(shape.id);

          // 计算拖动偏移量
          const offset = calculateDragOffset(
            {x: locationX, y: locationY},
            shape,
          );
          setDragOffset(offset);
          break;
        }
      }
    },
    [shapes],
  );

  // 处理触摸移动（拖动中）
  const handleTouchMove = useCallback(
    (event: GestureResponderEvent) => {
      if (!draggingShapeId) {
        return;
      }

      const {locationX, locationY} = event.nativeEvent;
      const newPosition: Point = {
        x: locationX - dragOffset.x,
        y: locationY - dragOffset.y,
      };

      updateShapePosition(draggingShapeId, newPosition);
    },
    [draggingShapeId, dragOffset, updateShapePosition],
  );

  // 处理触摸结束（拖动结束）
  const handleTouchEnd = useCallback(() => {
    setDraggingShapeId(null);
    setDragOffset({x: 0, y: 0});
  }, []);

  // 判断点是否在图形内
  const isPointInShape = (point: Point, shape: any): boolean => {
    switch (shape.type) {
      case 'circle': {
        const dx = point.x - shape.position.x;
        const dy = point.y - shape.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= shape.radius + 10; // 增加 10px 的点击区域
      }

      case 'rectangle': {
        return (
          point.x >= shape.position.x &&
          point.x <= shape.position.x + shape.width &&
          point.y >= shape.position.y &&
          point.y <= shape.position.y + shape.height
        );
      }

      case 'line': {
        // 线的点击检测：计算点到线的距离
        if (shape.points.length < 2) {
          return false;
        }
        const p1 = shape.points[0];
        const p2 = shape.points[1];
        const distance = pointToLineDistance(point, p1, p2);
        return distance <= 10; // 10px 的点击区域
      }

      case 'point': {
        const dx = point.x - shape.position.x;
        const dy = point.y - shape.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= 10; // 10px 的点击区域
      }

      default:
        return false;
    }
  };

  // 计算点到线的距离
  const pointToLineDistance = (
    point: Point,
    lineStart: Point,
    lineEnd: Point,
  ): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx: number;
    let yy: number;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 计算拖动偏移量
  const calculateDragOffset = (touchPoint: Point, shape: any): Point => {
    switch (shape.type) {
      case 'circle':
      case 'point':
        return {
          x: touchPoint.x - shape.position.x,
          y: touchPoint.y - shape.position.y,
        };

      case 'rectangle':
        return {
          x: touchPoint.x - shape.position.x,
          y: touchPoint.y - shape.position.y,
        };

      case 'line':
        // 线的拖动：选择最近的点
        if (shape.points.length < 2) {
          return {x: 0, y: 0};
        }
        const dist1 = Math.sqrt(
          Math.pow(touchPoint.x - shape.points[0].x, 2) +
            Math.pow(touchPoint.y - shape.points[0].y, 2),
        );
        const dist2 = Math.sqrt(
          Math.pow(touchPoint.x - shape.points[1].x, 2) +
            Math.pow(touchPoint.y - shape.points[1].y, 2),
        );
        const nearestPoint = dist1 < dist2 ? shape.points[0] : shape.points[1];
        return {
          x: touchPoint.x - nearestPoint.x,
          y: touchPoint.y - nearestPoint.y,
        };

      default:
        return {x: 0, y: 0};
    }
  };

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={styles.svg}
        viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
        {shapes.map(shape => (
          <ShapeRenderer
            key={shape.id}
            shape={shape}
            selected={selectedShapeId === shape.id}
            onPress={handleShapePress}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  svg: {
    flex: 1,
  },
});
