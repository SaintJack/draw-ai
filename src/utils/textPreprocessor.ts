/**
 * 文本预处理工具
 * 处理儿童语音识别的特殊需求：
 * - 不完整句子
 * - 重复和停顿
 * - 模糊表达
 */

export class TextPreprocessor {
  /**
   * 清理文本
   * 移除多余空格、标点符号等
   */
  static clean(text: string): string {
    if (!text) {
      return '';
    }

    // 移除多余空格
    let cleaned = text.trim().replace(/\s+/g, ' ');

    // 移除常见的语音识别错误标记
    cleaned = cleaned.replace(/\[.*?\]/g, ''); // 移除 [语音]
    cleaned = cleaned.replace(/\(.*?\)/g, ''); // 移除 (语音)

    // 移除重复的标点符号
    cleaned = cleaned.replace(/[。，、]{2,}/g, '，');

    return cleaned.trim();
  }

  /**
   * 处理不完整句子
   * 尝试补全常见的省略表达
   */
  static completeSentence(text: string): string {
    if (!text) {
      return '';
    }

    let completed = text;

    // 如果只有单个词，尝试补全为完整指令
    const singleWordPatterns: Record<string, string> = {
      '圆': '画一个圆',
      '圈': '画一个圆',
      '方': '画一个方',
      '矩形': '画一个矩形',
      '线': '画一条线',
      '点': '画一个点',
      '太阳': '画一个太阳',
      '眼睛': '画眼睛',
    };

    // 检查是否是单个词
    const words = completed.split(/\s+/);
    if (words.length === 1 && singleWordPatterns[words[0]]) {
      completed = singleWordPatterns[words[0]];
    }

    // 如果缺少动词，添加"画"
    if (!completed.includes('画') && !completed.includes('添加')) {
      if (completed.length <= 4) {
        // 短文本，可能是省略了"画"
        completed = `画${completed}`;
      }
    }

    return completed;
  }

  /**
   * 处理重复和停顿
   * 移除重复的词语和停顿标记
   */
  static removeRepetition(text: string): string {
    if (!text) {
      return '';
    }

    let processed = text;

    // 移除常见的停顿标记
    processed = processed.replace(/[嗯、啊、呃、那个、这个]{1,}/g, ' ');

    // 移除重复的词语（连续出现2次以上）
    const words = processed.split(/\s+/);
    const uniqueWords: string[] = [];
    let lastWord = '';

    for (const word of words) {
      if (word !== lastWord || uniqueWords.length === 0) {
        uniqueWords.push(word);
        lastWord = word;
      }
    }

    processed = uniqueWords.join(' ');

    return processed.trim();
  }

  /**
   * 处理模糊指代
   * 将"这个"、"那个"等替换为更明确的表达
   */
  static resolveReferences(text: string, context?: {recentShapes?: string[]}): string {
    if (!text) {
      return '';
    }

    let resolved = text;

    // 替换"这个"、"那个"为"最近的"
    resolved = resolved.replace(/这个|那个/g, '最近的');

    // 如果上下文中有最近的操作，可以进一步优化
    if (context?.recentShapes && context.recentShapes.length > 0) {
      // 可以替换为具体的图形类型
      const lastShape = context.recentShapes[context.recentShapes.length - 1];
      resolved = resolved.replace(/最近的/g, lastShape);
    }

    return resolved;
  }

  /**
   * 综合预处理
   * 应用所有预处理步骤
   */
  static preprocess(
    text: string,
    options: {
      complete?: boolean;
      removeRepetition?: boolean;
      resolveReferences?: boolean;
      context?: {recentShapes?: string[]};
    } = {},
  ): string {
    if (!text) {
      return '';
    }

    let processed = text;

    // 1. 清理
    processed = this.clean(processed);

    // 2. 移除重复
    if (options.removeRepetition !== false) {
      processed = this.removeRepetition(processed);
    }

    // 3. 补全句子
    if (options.complete !== false) {
      processed = this.completeSentence(processed);
    }

    // 4. 处理模糊指代
    if (options.resolveReferences !== false) {
      processed = this.resolveReferences(processed, options.context);
    }

    return processed.trim();
  }

  /**
   * 验证文本是否有效
   * 过滤掉无意义的识别结果
   */
  static isValid(text: string): boolean {
    if (!text || text.trim().length === 0) {
      return false;
    }

    // 移除空格后检查长度
    const cleaned = text.replace(/\s+/g, '');
    if (cleaned.length < 1) {
      return false;
    }

    // 检查是否只包含标点符号
    const onlyPunctuation = /^[，。、！？；：""''（）【】]+$/.test(cleaned);
    if (onlyPunctuation) {
      return false;
    }

    return true;
  }
}
