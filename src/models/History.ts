export interface HistoryEntry {
  id: string;
  drawingId: string;
  action: 'add' | 'update' | 'delete' | 'manual';
  shapeId?: string;
  timestamp: number;
  data?: any; // 操作数据快照
}
