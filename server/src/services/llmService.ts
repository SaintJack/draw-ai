import axios from 'axios';

const LLM_API_URL =
  process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-3.5-turbo';

export interface DrawingContext {
  shapes: any[];
  recentActions: string[];
}

export interface DrawingInstruction {
  action: 'add' | 'update' | 'delete';
  shape?: {
    type: 'circle' | 'rectangle' | 'line' | 'point';
    properties: Record<string, any>;
  };
  targetId?: string;
}

/**
 * LLM 服务
 * 负责调用大语言模型 API，将自然语言转换为绘图指令
 */
export const llmService = {
  /**
   * 解析自然语言为绘图指令
   */
  async parseToDrawingInstruction(
    text: string,
    context: DrawingContext,
  ): Promise<DrawingInstruction> {
    if (!LLM_API_KEY) {
      console.warn('LLM_API_KEY not configured, using fallback');
      return this.getFallbackInstruction(text);
    }

    try {
      const prompt = this.buildPrompt(text, context);

      const response = await axios.post(
        LLM_API_URL,
        {
          model: LLM_MODEL,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${LLM_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      const content = response.data.choices[0].message.content.trim();
      return this.parseLLMResponse(content, context);
    } catch (error: any) {
      console.error('LLM API error:', error.message);
      return this.getFallbackInstruction(text);
    }
  },

  /**
   * 构建系统提示词
   */
  getSystemPrompt(): string {
    return `你是一个简笔画助手，专门将儿童的自然语言转换为绘图指令。
你只能输出 JSON 格式的绘图指令，不能输出其他内容。
指令格式：
{
  "action": "add" | "update" | "delete",
  "shape": {
    "type": "circle" | "rectangle" | "line" | "point",
    "properties": {...}
  },
  "targetId": "..." (仅用于 update/delete)
}`;
  },

  /**
   * 构建用户提示词
   */
  buildPrompt(text: string, context: DrawingContext): string {
    const shapesInfo = context.shapes
      .map((shape, index) => {
        return `${index + 1}. ${shape.type} (id: ${shape.id})`;
      })
      .join('\n');

    return `用户说："${text}"

当前画布上的图形：
${shapesInfo || '（空画布）'}

最近的操作：
${context.recentActions.join(', ') || '无'}

请将用户的描述转换为绘图指令。注意：
- 如果用户说"这个"、"那个"，请根据最近的操作或图形推断
- 如果用户说"大一点"、"小一点"，使用 update 动作
- 如果用户说"不要"、"删除"，使用 delete 动作
- 其他情况使用 add 动作添加新图形

只返回 JSON，不要其他内容。`;
  },

  /**
   * 解析 LLM 响应
   */
  parseLLMResponse(
    content: string,
    context: DrawingContext,
  ): DrawingInstruction {
    try {
      // 尝试提取 JSON（可能包含 markdown 代码块）
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      if (jsonStr.startsWith('{')) {
        jsonStr = jsonStr.substring(jsonStr.indexOf('{'));
      }
      if (jsonStr.endsWith('}')) {
        jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);
      }

      const instruction = JSON.parse(jsonStr);

      // 验证指令格式
      if (!['add', 'update', 'delete'].includes(instruction.action)) {
        throw new Error('Invalid action');
      }

      // 处理模糊指代
      if (instruction.targetId === 'this' || instruction.targetId === 'that') {
        instruction.targetId = this.resolveReference(context);
      }

      return instruction;
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return this.getFallbackInstruction('');
    }
  },

  /**
   * 解析模糊指代（"这个"、"那个"）
   */
  resolveReference(context: DrawingContext): string | undefined {
    // 返回最近添加的图形 ID
    if (context.shapes.length > 0) {
      return context.shapes[context.shapes.length - 1].id;
    }
    return undefined;
  },

  /**
   * 降级处理：返回默认指令
   */
  getFallbackInstruction(text: string): DrawingInstruction {
    // 简单的关键词匹配
    const lowerText = text.toLowerCase();

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
};
