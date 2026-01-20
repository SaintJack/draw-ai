import axios from 'axios';
import {Shape} from '../models/Shape';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

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
    type: string;
    properties: Record<string, any>;
  };
  targetId?: string; // 用于 update/delete
}

export const aiService = {
  async parseCommand(request: ParseRequest): Promise<ParseResponse> {
    try {
      const response = await axios.post<ParseResponse>(
        `${API_BASE_URL}/v1/parse`,
        request,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('AI parse error:', error);
      // 降级处理：返回默认图形
      return {
        action: 'add',
        shape: {
          type: 'circle',
          properties: {radius: 50},
        },
      };
    }
  },
};
