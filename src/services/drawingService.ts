import {storageService} from './storageService';
import {Drawing} from '../models/Drawing';
import {Shape} from '../models/Shape';
import {HistoryEntry} from '../models/History';
import {generateId} from '../utils/helpers';

/**
 * 作品管理服务
 * 提供作品保存、加载、删除、导出等功能
 */
export class DrawingService {
  /**
   * 保存当前画布为作品
   */
  static async saveDrawing(
    shapes: Shape[],
    title: string = '未命名作品',
    thumbnailPath?: string,
  ): Promise<Drawing> {
    const drawing: Drawing = {
      id: generateId(),
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      thumbnailPath,
    };

    // 保存作品信息
    await storageService.saveDrawing(drawing);

    // 保存图形
    await storageService.saveShapes(drawing.id, shapes);

    return drawing;
  }

  /**
   * 更新作品
   */
  static async updateDrawing(
    drawingId: string,
    shapes: Shape[],
    updates?: Partial<Drawing>,
  ): Promise<void> {
    // 更新作品信息
    if (updates) {
      await storageService.updateDrawing(drawingId, {
        ...updates,
        updatedAt: Date.now(),
      });
    } else {
      await storageService.updateDrawing(drawingId, {
        updatedAt: Date.now(),
      });
    }

    // 更新图形
    await storageService.saveShapes(drawingId, shapes);
  }

  /**
   * 加载作品
   */
  static async loadDrawing(drawingId: string): Promise<{
    drawing: Drawing;
    shapes: Shape[];
  } | null> {
    const drawing = await storageService.getDrawingById(drawingId);
    if (!drawing) {
      return null;
    }

    const shapes = await storageService.getShapes(drawingId);

    return {
      drawing,
      shapes,
    };
  }

  /**
   * 获取所有作品列表
   */
  static async getAllDrawings(): Promise<Drawing[]> {
    return await storageService.getDrawings();
  }

  /**
   * 删除作品
   */
  static async deleteDrawing(drawingId: string): Promise<void> {
    await storageService.deleteDrawing(drawingId);
  }

  /**
   * 保存历史记录
   */
  static async saveHistoryEntry(
    drawingId: string,
    action: 'add' | 'update' | 'delete' | 'manual',
    shapeId?: string,
    data?: any,
  ): Promise<void> {
    const entry: HistoryEntry = {
      id: generateId(),
      drawingId,
      action,
      shapeId,
      timestamp: Date.now(),
      data,
    };

    await storageService.saveHistory(entry);
  }

  /**
   * 获取作品历史记录
   */
  static async getHistory(drawingId: string): Promise<HistoryEntry[]> {
    return await storageService.getHistory(drawingId);
  }
}
