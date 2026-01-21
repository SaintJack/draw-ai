import Voice from '@react-native-community/voice';
import {useEffect, useState, useCallback} from 'react';

export interface VoiceRecognitionResult {
  isRecording: boolean;
  result: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  cancelListening: () => Promise<void>;
}

/**
 * 语音识别 Hook
 * 封装 @react-native-community/voice 的功能
 */
export const useVoiceRecognition = (): VoiceRecognitionResult => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初始化语音识别监听器
    Voice.onSpeechStart = () => {
      setIsRecording(true);
      setError(null);
      setResult('');
    };

    Voice.onSpeechEnd = () => {
      setIsRecording(false);
    };

    Voice.onSpeechResults = (e: any) => {
      if (e.value && e.value.length > 0) {
        // 取第一个识别结果（通常是最准确的）
        setResult(e.value[0]);
      }
      setIsRecording(false);
    };

    Voice.onSpeechError = (e: any) => {
      console.error('Speech error:', e);
      setError(e.error?.message || '语音识别错误');
      setIsRecording(false);
    };

    Voice.onSpeechPartialResults = (e: any) => {
      // 实时显示部分结果
      if (e.value && e.value.length > 0) {
        setResult(e.value[0]);
      }
    };

    // 清理函数
    return () => {
      Voice.destroy()
        .then(() => {
          Voice.removeAllListeners();
        })
        .catch(err => {
          console.error('Error destroying voice:', err);
        });
    };
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setResult('');
      await Voice.start('zh-CN');
    } catch (err: any) {
      console.error('Start listening error:', err);
      setError(err?.message || '无法启动语音识别');
      setIsRecording(false);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (err: any) {
      console.error('Stop listening error:', err);
      setError(err?.message || '停止录音失败');
    }
  }, []);

  const cancelListening = useCallback(async () => {
    try {
      await Voice.cancel();
      setIsRecording(false);
      setResult('');
    } catch (err: any) {
      console.error('Cancel listening error:', err);
    }
  }, []);

  return {
    isRecording,
    result,
    error,
    startListening,
    stopListening,
    cancelListening,
  };
};
