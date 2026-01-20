import {Request, Response, NextFunction} from 'express';

export interface ParseRequest {
  text: string;
  context: {
    shapes: any[];
    recentActions: string[];
  };
}

/**
 * 验证解析请求
 */
export const validateParseRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {text, context} = req.body;

  // 验证必需字段
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'text is required and must be a non-empty string',
    });
  }

  if (!context || typeof context !== 'object') {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'context is required and must be an object',
    });
  }

  if (!Array.isArray(context.shapes)) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'context.shapes must be an array',
    });
  }

  if (!Array.isArray(context.recentActions)) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'context.recentActions must be an array',
    });
  }

  next();
};
