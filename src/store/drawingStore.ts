import {create} from 'zustand';
import {Shape, Point} from '../models/Shape';

interface DrawingState {
  // 当前画布状态
  shapes: Shape[];
  currentDrawingId: string | null;

  // 历史记录
  history: Array<{
    type: 'add' | 'update' | 'delete';
    shape?: Shape;
    shapeId?: string;
  }>;
  historyIndex: number;

  // 操作方法
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  updateShapePosition: (id: string, position: Point) => void;
  deleteShape: (id: string) => void;
  setShapes: (shapes: Shape[]) => void;
  clearShapes: () => void;

  // 历史操作
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  shapes: [],
  currentDrawingId: null,
  history: [],
  historyIndex: -1,

  addShape: (shape) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({type: 'add', shape});
      return {
        shapes: [...state.shapes, shape],
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  updateShape: (id, updates) => {
    set((state) => {
      const shape = state.shapes.find((s) => s.id === id);
      if (!shape) return state;

      const updatedShape = {...shape, ...updates};
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({type: 'update', shape: updatedShape, shapeId: id});

      return {
        shapes: state.shapes.map((s) => (s.id === id ? updatedShape : s)),
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  updateShapePosition: (id, position) => {
    set((state) => {
      const shape = state.shapes.find((s) => s.id === id);
      if (!shape) return state;

      const updatedShape = {...shape, position};
      // 拖动时不记录历史（性能优化）
      return {
        shapes: state.shapes.map((s) => (s.id === id ? updatedShape : s)),
      };
    });
  },

  deleteShape: (id) => {
    set((state) => {
      const shape = state.shapes.find((s) => s.id === id);
      if (!shape) return state;

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({type: 'delete', shapeId: id});

      return {
        shapes: state.shapes.filter((s) => s.id !== id),
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setShapes: (shapes) => {
    set({shapes});
  },

  clearShapes: () => {
    set({
      shapes: [],
      history: [],
      historyIndex: -1,
    });
  },

  undo: () => {
    const state = get();
    if (!state.canUndo()) return;

    // TODO: 实现撤销逻辑
    console.log('Undo not implemented yet');
  },

  redo: () => {
    const state = get();
    if (!state.canRedo()) return;

    // TODO: 实现重做逻辑
    console.log('Redo not implemented yet');
  },

  canUndo: () => {
    const state = get();
    return state.historyIndex >= 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
}));
