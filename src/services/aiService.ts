import axios from 'axios';
import {Shape} from '../models/Shape';
import {debounce} from '../utils/helpers';

import {API_CONFIG} from '../config/api';

// API 基础 URL
const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ParseRequest {
  text: string;
  context: {
    shapes: Shape[];
    recentActions: string[];
  };
}

export interface ParseResponse {
  action: 'add' | 'update' | 'delete';
  shape?: {
    type: 'circle' | 'rectangle' | 'line' | 'point';
    properties: Record<string, any>;
  };
  targetId?: string; // 用于 update/delete
}

// 请求缓存（简单的内存缓存）
const requestCache = new Map<string, {response: ParseResponse; timestamp: number}>();
const CACHE_TTL = 60000; // 1 分钟缓存

/**
 * AI 解析服务
 */
export const aiService = {
  /**
   * 解析自然语言为绘图指令
   */
  async parseCommand(request: ParseRequest): Promise<ParseResponse> {
    // 检查缓存
    const cacheKey = this.getCacheKey(request);
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.response;
    }

    try {
      const response = await axios.post<ParseResponse>(
        `${API_BASE_URL}/v1/parse`,
        request,
        {
          timeout: 10000, // 增加到 10 秒
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // 缓存响应
      requestCache.set(cacheKey, {
        response: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (error: any) {
      console.error('AI parse error:', error.message);
      // 降级处理：返回默认图形
      const fallback = this.getFallbackResponse(request.text);
      return fallback;
    }
  },

  /**
   * 生成缓存键
   */
  getCacheKey(request: ParseRequest): string {
    return `${request.text}_${request.context.shapes.length}`;
  },

  /**
   * 降级处理：返回默认响应
   */
  getFallbackResponse(text: string): ParseResponse {
    const lowerText = text.toLowerCase();

    // 简单的关键词匹配
    if (lowerText.includes('删除') || lowerText.includes('不要')) {
      return {
        action: 'delete',
      };
    }

    if (lowerText.includes('圆') || lowerText.includes('圈')) {
      return {
        action: 'add',
        shape: {
          type: 'circle',
          properties: {radius: 50},
        },
      };
    }

    if (lowerText.includes('方') || lowerText.includes('矩形')) {
      return {
        action: 'add',
        shape: {
          type: 'rectangle',
          properties: {width: 100, height: 100},
        },
      };
    }

    if (lowerText.includes('线')) {
      return {
        action: 'add',
        shape: {
          type: 'line',
          properties: {startX: 0, startY: 0, endX: 100, endY: 100},
        },
      };
    }

    // 默认返回圆形
    return {
      action: 'add',
      shape: {
        type: 'circle',
        properties: {radius: 50},
      },
    };
  },

  /**
   * 清除缓存
   */
  clearCache(): void {
    requestCache.clear();
  },
};

