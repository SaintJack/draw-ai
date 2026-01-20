import {ParseResponse} from '../services/aiService';
import {Shape} from '../models/Shape';
import {DrawingEngine} from './drawingEngine';
import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

/**
 * 指令执行引擎
 * 负责将 AI 解析的指令转换为图形操作
 */
export class InstructionExecutor {
  /**
   * 执行绘图指令
   */
  static executeInstruction(
    instruction: ParseResponse,
    currentShapes: Shape[],
    canvasSize: {width: number; height: number} = {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
  ):
    | {
        shape?: Shape;
        targetId?: string;
        updates?: Partial<Shape>;
        action: 'add' | 'update' | 'delete';
      }
    | null {
    switch (instruction.action) {
      case 'add':
        return this.executeAdd(instruction, canvasSize);

      case 'update':
        return this.executeUpdate(instruction, currentShapes);

      case 'delete':
        return this.executeDelete(instruction, currentShapes);

      default:
        console.warn('Unknown action:', instruction.action);
        return null;
    }
  }

  /**
   * 执行添加操作
   */
  private static executeAdd(
    instruction: ParseResponse,
    canvasSize: {width: number; height: number},
  ): {shape: Shape; action: 'add'} | null {
    if (!instruction.shape) {
      return null;
    }

    const shape = DrawingEngine.createShapeFromInstruction(
      instruction,
      canvasSize,
    );

    if (!shape) {
      return null;
    }

    return {
      shape,
      action: 'add',
    };
  }

  /**
   * 执行更新操作
   */
  private static executeUpdate(
    instruction: ParseResponse,
    currentShapes: Shape[],
  ): {targetId: string; updates: Partial<Shape>; action: 'update'} | null {
    let targetId = instruction.targetId;
    if (!targetId) {
      // 如果没有指定 targetId，使用最后一个图形
      if (currentShapes.length === 0) {
        return null;
      }
      targetId = currentShapes[currentShapes.length - 1].id;
    }

    const targetShape = currentShapes.find(s => s.id === targetId);
    if (!targetShape) {
      console.warn('Target shape not found:', instruction.targetId);
      return null;
    }

    const updates: Partial<Shape> = {};

    // 根据指令更新图形属性
    if (instruction.shape) {
      // 更新大小
      if (instruction.shape.properties.radius !== undefined) {
        if (targetShape.type === 'circle') {
          (updates as any).radius = instruction.shape.properties.radius;
        }
      }

      if (instruction.shape.properties.width !== undefined) {
        if (targetShape.type === 'rectangle') {
          (updates as any).width = instruction.shape.properties.width;
        }
      }

      if (instruction.shape.properties.height !== undefined) {
        if (targetShape.type === 'rectangle') {
          (updates as any).height = instruction.shape.properties.height;
        }
      }

      // 更新类型（如果指定）
      if (instruction.shape.type && instruction.shape.type !== targetShape.type) {
        // 类型转换需要重新创建图形
        return null;
      }
    }

    return {
      targetId: targetId,
      updates,
      action: 'update',
    };
  }

  /**
   * 执行删除操作
   */
  private static executeDelete(
    instruction: ParseResponse,
    currentShapes: Shape[],
  ): {targetId: string; action: 'delete'} | null {
    let targetId = instruction.targetId;
    
    if (!targetId) {
      // 如果没有指定 targetId，删除最后一个图形
      if (currentShapes.length === 0) {
        return null;
      }
      targetId = currentShapes[currentShapes.length - 1].id;
    }

    const targetShape = currentShapes.find(s => s.id === targetId);
    if (!targetShape) {
      console.warn('Target shape not found:', targetId);
      return null;
    }

    return {
      targetId: targetId,
      action: 'delete',
    };
  }
}
