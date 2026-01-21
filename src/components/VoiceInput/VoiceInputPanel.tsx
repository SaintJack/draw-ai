import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput as PaperTextInput, Button, IconButton} from 'react-native-paper';
import {VoiceButton} from './VoiceButton';
import {useDrawingStore} from '../../store/drawingStore';
import {aiService} from '../../services/aiService';
import {InstructionExecutor} from '../../utils/instructionExecutor';
import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

/**
 * 语音输入面板组件
 * 整合文本输入和语音输入功能
 */
export const VoiceInputPanel: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const {shapes, addShape, updateShape, deleteShape, history} =
    useDrawingStore();

  // 处理文本提交（来自文本输入或语音识别）
  const handleSubmit = async (inputText?: string) => {
    const submitText = inputText || text.trim();
    if (!submitText || loading) {
      return;
    }

    setLoading(true);
    setText(''); // 清空输入框

    try {
      // 准备上下文
      const context = {
        shapes: shapes,
        recentActions: history
          .slice(-5)
          .map(h => h.type)
          .filter(Boolean) as string[],
      };

      // 调用 AI 解析
      const instruction = await aiService.parseCommand({
        text: submitText,
        context,
      });

      // 执行指令
      const result = InstructionExecutor.executeInstruction(
        instruction,
        shapes,
        {width: SCREEN_WIDTH, height: SCREEN_HEIGHT},
      );

      if (result) {
        switch (result.action) {
          case 'add':
            if (result.shape) {
              addShape(result.shape);
            }
            break;

          case 'update':
            if (result.targetId && result.updates) {
              updateShape(result.targetId, result.updates);
            }
            break;

          case 'delete':
            if (result.targetId) {
              deleteShape(result.targetId);
            }
            break;
        }
      }
    } catch (error) {
      console.error('Failed to execute instruction:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理语音识别结果
  const handleVoiceResult = (voiceText: string) => {
    setText(voiceText);
    // 自动提交（可选，也可以让用户确认）
    // handleSubmit(voiceText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <PaperTextInput
          label="说点什么来画画..."
          value={text}
          onChangeText={setText}
          mode="outlined"
          style={styles.input}
          disabled={loading}
          onSubmitEditing={() => handleSubmit()}
          returnKeyType="send"
          right={
            <PaperTextInput.Icon
              icon="microphone"
              onPress={() => {
                // 语音按钮在外部
              }}
            />
          }
        />
        <VoiceButton
          onResult={handleVoiceResult}
          disabled={loading}
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={() => handleSubmit()}
          loading={loading}
          disabled={loading || !text.trim()}
          style={styles.submitButton}
          icon="send">
          {loading ? '解析中...' : '发送'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButton: {
    minWidth: 100,
  },
});
