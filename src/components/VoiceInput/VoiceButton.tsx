import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {IconButton, Text, ActivityIndicator} from 'react-native-paper';
import {useVoiceRecognition} from '../../services/voiceService';
import {TextPreprocessor} from '../../utils/textPreprocessor';
import {PermissionManager} from '../../utils/permissions';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

/**
 * 语音输入按钮组件
 * 支持语音识别和文本预处理
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onResult,
  disabled = false,
}) => {
  const {isRecording, result, error, startListening, stopListening} =
    useVoiceRecognition();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [processedResult, setProcessedResult] = useState<string>('');

  // 检查权限
  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await PermissionManager.checkRecordAudioPermission();
      setHasPermission(hasPermission);
    };
    checkPermission();
  }, []);

  // 处理识别结果
  useEffect(() => {
    if (result && !isRecording) {
      // 识别完成，进行预处理
      const processed = TextPreprocessor.preprocess(result, {
        complete: true,
        removeRepetition: true,
        resolveReferences: true,
      });

      if (TextPreprocessor.isValid(processed)) {
        setProcessedResult(processed);
        onResult(processed);
      }
    }
  }, [result, isRecording, onResult]);

  // 处理错误
  useEffect(() => {
    if (error) {
      Alert.alert('语音识别错误', error, [{text: '确定'}]);
    }
  }, [error]);

  const handlePress = async () => {
    if (isRecording) {
      // 停止录音
      await stopListening();
    } else {
      // 检查权限
      if (hasPermission === false) {
        const granted = await PermissionManager.requestRecordAudioPermission();
        if (!granted) {
          return;
        }
        setHasPermission(true);
      }

      // 开始录音
      await startListening();
    }
  };

  const getIcon = () => {
    if (isRecording) {
      return 'microphone';
    }
    return 'microphone-outline';
  };

  const getColor = () => {
    if (isRecording) {
      return '#f44336'; // 红色，表示正在录音
    }
    if (hasPermission === false) {
      return '#9e9e9e'; // 灰色，表示无权限
    }
    return '#2196F3'; // 蓝色，表示可用
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon={getIcon()}
        size={32}
        iconColor={getColor()}
        onPress={handlePress}
        disabled={disabled || hasPermission === false}
        style={[
          styles.button,
          isRecording && styles.buttonRecording,
        ]}
      />
      {isRecording && (
        <View style={styles.indicator}>
          <ActivityIndicator size="small" color="#f44336" />
          <Text variant="bodySmall" style={styles.recordingText}>
            正在录音...
          </Text>
        </View>
      )}
      {processedResult && !isRecording && (
        <Text variant="bodySmall" style={styles.resultText} numberOfLines={1}>
          {processedResult}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 0,
  },
  buttonRecording: {
    backgroundColor: '#ffebee',
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  recordingText: {
    color: '#f44336',
    fontSize: 12,
  },
  resultText: {
    marginTop: 4,
    color: '#666',
    fontSize: 12,
    maxWidth: 150,
  },
});
