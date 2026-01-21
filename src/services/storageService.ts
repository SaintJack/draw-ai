import SQLite from 'react-native-sqlite-storage';
import {Drawing} from '../models/Drawing';
import {Shape} from '../models/Shape';
import {HistoryEntry} from '../models/History';

// 初始化数据库
SQLite.DEBUG(false); // 生产环境设为 false
SQLite.enablePromise(true);

const DATABASE_NAME = 'DrawAI.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAYNAME = 'DrawAI SQLite Database';
const DATABASE_SIZE = 200000;

/**
 * 存储服务
 * 负责所有本地数据存储操作
 */
export class StorageService {
  private static instance: StorageService;
  private db: SQLite.SQLiteDatabase | null = null;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * 初始化数据库
   */
  async initDatabase(): Promise<void> {
    if (this.initialized && this.db) {
      return;
    }

    try {
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
      });

      // 创建表
      await this.createTables();
      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database init error:', error);
      throw error;
    }
  }

  /**
   * 创建数据库表
   */
  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // 创建 drawings 表
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS drawings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        thumbnailPath TEXT
      )
    `);

    // 创建 shapes 表
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS shapes (
        id TEXT PRIMARY KEY,
        drawingId TEXT NOT NULL,
        type TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        zIndex INTEGER DEFAULT 0,
        FOREIGN KEY (drawingId) REFERENCES drawings(id) ON DELETE CASCADE
      )
    `);

    // 创建 history 表
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        drawingId TEXT NOT NULL,
        action TEXT NOT NULL,
        shapeId TEXT,
        timestamp INTEGER NOT NULL,
        data TEXT,
        FOREIGN KEY (drawingId) REFERENCES drawings(id) ON DELETE CASCADE
      )
    `);

    // 创建索引
    await this.db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_shapes_drawingId ON shapes(drawingId)
    `);

    await this.db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_history_drawingId ON history(drawingId)
    `);
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initDatabase();
    }
    if (!this.db) {
      throw new Error('Database not available');
    }
  }

  // ==================== Drawing 操作 ====================

  /**
   * 保存作品
   */
  async saveDrawing(drawing: Drawing): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      `INSERT OR REPLACE INTO drawings (id, title, createdAt, updatedAt, thumbnailPath)
       VALUES (?, ?, ?, ?, ?)`,
      [
        drawing.id,
        drawing.title,
        drawing.createdAt,
        drawing.updatedAt,
        drawing.thumbnailPath || null,
      ],
    );
  }

  /**
   * 获取所有作品
   */
  async getDrawings(): Promise<Drawing[]> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM drawings ORDER BY updatedAt DESC',
    );
    const drawings: Drawing[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      drawings.push(results.rows.item(i));
    }

    return drawings;
  }

  /**
   * 根据 ID 获取作品
   */
  async getDrawingById(id: string): Promise<Drawing | null> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM drawings WHERE id = ?',
      [id],
    );

    if (results.rows.length > 0) {
      return results.rows.item(0);
    }

    return null;
  }

  /**
   * 删除作品
   */
  async deleteDrawing(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    // 使用事务确保数据一致性
    await this.db.transaction(async tx => {
      await tx.executeSql('DELETE FROM history WHERE drawingId = ?', [id]);
      await tx.executeSql('DELETE FROM shapes WHERE drawingId = ?', [id]);
      await tx.executeSql('DELETE FROM drawings WHERE id = ?', [id]);
    });
  }

  /**
   * 更新作品
   */
  async updateDrawing(id: string, updates: Partial<Drawing>): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.updatedAt !== undefined) {
      fields.push('updatedAt = ?');
      values.push(updates.updatedAt);
    }
    if (updates.thumbnailPath !== undefined) {
      fields.push('thumbnailPath = ?');
      values.push(updates.thumbnailPath);
    }

    if (fields.length === 0) {
      return;
    }

    values.push(id);

    await this.db.executeSql(
      `UPDATE drawings SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
  }

  // ==================== Shape 操作 ====================

  /**
   * 保存图形的所有图形
   */
  async saveShapes(drawingId: string, shapes: Shape[]): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    // 使用事务
    await this.db.transaction(async tx => {
      // 先删除旧的 shapes
      await tx.executeSql('DELETE FROM shapes WHERE drawingId = ?', [drawingId]);

      // 插入新的 shapes
      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        await tx.executeSql(
          `INSERT INTO shapes (id, drawingId, type, data, createdAt, zIndex)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            shape.id,
            drawingId,
            shape.type,
            JSON.stringify(shape),
            Date.now(),
            i, // 使用索引作为 zIndex
          ],
        );
      }
    });
  }

  /**
   * 获取作品的所有图形
   */
  async getShapes(drawingId: string): Promise<Shape[]> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM shapes WHERE drawingId = ? ORDER BY zIndex',
      [drawingId],
    );

    const shapes: Shape[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      try {
        const shape = JSON.parse(row.data);
        shapes.push(shape);
      } catch (error) {
        console.error('Failed to parse shape data:', error);
      }
    }

    return shapes;
  }

  // ==================== History 操作 ====================

  /**
   * 保存历史记录
   */
  async saveHistory(entry: HistoryEntry): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      `INSERT INTO history (id, drawingId, action, shapeId, timestamp, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.drawingId,
        entry.action,
        entry.shapeId || null,
        entry.timestamp,
        entry.data ? JSON.stringify(entry.data) : null,
      ],
    );

    // 限制历史记录数量（最多 20 条）
    await this.limitHistoryEntries(entry.drawingId, 20);
  }

  /**
   * 获取作品的历史记录
   */
  async getHistory(drawingId: string, limit: number = 20): Promise<HistoryEntry[]> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM history WHERE drawingId = ? ORDER BY timestamp DESC LIMIT ?',
      [drawingId, limit],
    );

    const history: HistoryEntry[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      history.push({
        id: row.id,
        drawingId: row.drawingId,
        action: row.action,
        shapeId: row.shapeId,
        timestamp: row.timestamp,
        data: row.data ? JSON.parse(row.data) : undefined,
      });
    }

    return history.reverse(); // 按时间正序返回
  }

  /**
   * 限制历史记录数量
   */
  private async limitHistoryEntries(
    drawingId: string,
    maxEntries: number,
  ): Promise<void> {
    if (!this.db) return;

    // 删除超出限制的旧记录
    await this.db.executeSql(
      `DELETE FROM history 
       WHERE drawingId = ? 
       AND id NOT IN (
         SELECT id FROM history 
         WHERE drawingId = ? 
         ORDER BY timestamp DESC 
         LIMIT ?
       )`,
      [drawingId, drawingId, maxEntries],
    );
  }

  /**
   * 删除作品的所有历史记录
   */
  async deleteHistory(drawingId: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql('DELETE FROM history WHERE drawingId = ?', [
      drawingId,
    ]);
  }

  // ==================== 工具方法 ====================

  /**
   * 关闭数据库连接
   */
  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }

  /**
   * 清空所有数据（用于测试）
   */
  async clearAllData(): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.transaction(async tx => {
      await tx.executeSql('DELETE FROM history');
      await tx.executeSql('DELETE FROM shapes');
      await tx.executeSql('DELETE FROM drawings');
    });
  }
}

// 导出单例
export const storageService = StorageService.getInstance();
