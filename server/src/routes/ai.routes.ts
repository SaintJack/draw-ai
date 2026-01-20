import express from 'express';
import {llmService} from '../services/llmService';
import {validateParseRequest} from '../middleware/validation';

const router = express.Router();

/**
 * POST /api/v1/parse
 * 解析自然语言为绘图指令
 */
router.post('/parse', validateParseRequest, async (req, res) => {
  try {
    const {text, context} = req.body;

    // 调用 LLM 服务解析
    const instruction = await llmService.parseToDrawingInstruction(text, context);

    res.json(instruction);
  } catch (error: any) {
    console.error('Parse error:', error);

    // 返回默认指令，不暴露错误详情
    res.json({
      action: 'add',
      shape: {
        type: 'circle',
        properties: {radius: 50},
      },
    });
  }
});

export default router;
