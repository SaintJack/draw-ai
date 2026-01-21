import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Dialog, TextInput as PaperTextInput, Portal} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {DrawingCanvas, DrawingToolbar} from '../components/Canvas';
import {VoiceInputPanel} from '../components/VoiceInput';
import {useDrawingStore} from '../store/drawingStore';
import {DrawingService} from '../services/drawingService';
import {storageService} from '../services/storageService';
import {Drawing} from '../models/Drawing';

type DrawingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Drawing'
>;

type DrawingScreenRouteProp = RouteProp<RootStackParamList, 'Drawing'>;

const DrawingScreen: React.FC = () => {
  const navigation = useNavigation<DrawingScreenNavigationProp>();
  const route = useRoute<DrawingScreenRouteProp>();
  const {shapes, setShapes, clearShapes, currentDrawingId} = useDrawingStore();
  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('未命名作品');
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);

  // 初始化数据库
  useEffect(() => {
    const init = async () => {
      try {
        await storageService.initDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    init();
  }, []);

  // 加载作品（如果有 drawingId）
  useEffect(() => {
    const loadDrawing = async () => {
      const drawingId = route.params?.drawingId;
      if (drawingId) {
        try {
          const loaded = await DrawingService.loadDrawing(drawingId);
          if (loaded) {
            setCurrentDrawing(loaded.drawing);
            setDrawingTitle(loaded.drawing.title);
            setShapes(loaded.shapes);
          }
        } catch (error) {
          console.error('Failed to load drawing:', error);
          Alert.alert('错误', '加载作品失败');
        }
      }
    };
    loadDrawing();
  }, [route.params?.drawingId, setShapes]);

  const handleSave = async () => {
    if (shapes.length === 0) {
      Alert.alert('提示', '画布为空，无法保存');
      return;
    }

    setSaveDialogVisible(true);
  };

  const confirmSave = async () => {
    try {
      if (currentDrawing) {
        // 更新现有作品
        await DrawingService.updateDrawing(currentDrawing.id, shapes, {
          title: drawingTitle,
        });
        Alert.alert('成功', '作品已更新');
      } else {
        // 创建新作品
        const newDrawing = await DrawingService.saveDrawing(
          shapes,
          drawingTitle,
        );
        setCurrentDrawing(newDrawing);
        Alert.alert('成功', '作品已保存');
      }
      setSaveDialogVisible(false);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('错误', '保存失败');
    }
  };

  const handleNewDrawing = () => {
    Alert.alert('新建作品', '确定要创建新作品吗？当前作品将丢失。', [
      {text: '取消', style: 'cancel'},
      {
        text: '确定',
        onPress: () => {
          clearShapes();
          setCurrentDrawing(null);
          setDrawingTitle('未命名作品');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <DrawingCanvas />
      </View>
      <View style={styles.toolbar}>
        <DrawingToolbar />
      </View>
      <View style={styles.inputArea}>
        <VoiceInputPanel />
      </View>
      <View style={styles.bottomBar}>
        <Button
          mode="outlined"
          onPress={handleNewDrawing}
          style={styles.button}
          icon="file-plus">
          新建
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          icon="content-save"
          disabled={shapes.length === 0}>
          保存
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Gallery')}
          style={styles.button}
          icon="folder">
          作品集
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={saveDialogVisible}
          onDismiss={() => setSaveDialogVisible(false)}>
          <Dialog.Title>保存作品</Dialog.Title>
          <Dialog.Content>
            <PaperTextInput
              label="作品名称"
              value={drawingTitle}
              onChangeText={setDrawingTitle}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSaveDialogVisible(false)}>取消</Button>
            <Button onPress={confirmSave}>保存</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  inputArea: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});

export default DrawingScreen;
