import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput as PaperTextInput, Button} from 'react-native-paper';
import {useDrawingStore} from '../../store/drawingStore';
import {aiService} from '../../services/aiService';
import {InstructionExecutor} from '../../utils/instructionExecutor';
import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

/**
 * 文本输入组件
 * 支持输入自然语言，AI 解析后自动绘制
 */
export const TextInputComponent: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const {shapes, addShape, updateShape, deleteShape, history} =
    useDrawingStore();

  const handleSubmit = async () => {
    if (!text.trim() || loading) {
      return;
    }

    setLoading(true);
    const inputText = text.trim();
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
        text: inputText,
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

  return (
    <View style={styles.container}>
      <PaperTextInput
        label="说点什么来画画..."
        value={text}
        onChangeText={setText}
        mode="outlined"
        style={styles.input}
        disabled={loading}
        onSubmitEditing={handleSubmit}
        returnKeyType="send"
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !text.trim()}
        style={styles.button}
        icon="send">
        {loading ? '解析中...' : '发送'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  button: {
    minWidth: 80,
  },
});
