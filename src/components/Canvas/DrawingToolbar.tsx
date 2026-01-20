import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {useDrawingStore} from '../../store/drawingStore';
import {DrawingEngine} from '../../utils/drawingEngine';
import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

/**
 * 绘图工具栏组件
 * 提供添加图形、撤销、重做等功能
 */
export const DrawingToolbar: React.FC = () => {
  const {addShape, clearShapes, undo, redo, canUndo, canRedo, shapes} =
    useDrawingStore();

  const handleAddCircle = () => {
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;
    const circle = DrawingEngine.createDefaultCircle(
      {x: centerX, y: centerY},
      50,
    );
    addShape(circle);
  };

  const handleAddRectangle = () => {
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;
    const rect = DrawingEngine.createDefaultRectangle(
      {x: centerX - 50, y: centerY - 50},
      100,
      100,
    );
    addShape(rect);
  };

  const handleAddLine = () => {
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;
    const line = DrawingEngine.createDefaultLine(
      {x: centerX - 50, y: centerY},
      {x: centerX + 50, y: centerY},
    );
    addShape(line);
  };

  const handleAddPoint = () => {
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;
    const point = DrawingEngine.createDefaultPoint({x: centerX, y: centerY});
    addShape(point);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <IconButton
          icon="circle-outline"
          size={24}
          onPress={handleAddCircle}
          mode="contained"
        />
        <IconButton
          icon="square-outline"
          size={24}
          onPress={handleAddRectangle}
          mode="contained"
        />
        <IconButton
          icon="minus"
          size={24}
          onPress={handleAddLine}
          mode="contained"
        />
        <IconButton
          icon="circle"
          size={24}
          onPress={handleAddPoint}
          mode="contained"
        />
      </View>

      <View style={styles.buttonGroup}>
        <IconButton
          icon="undo"
          size={24}
          onPress={undo}
          disabled={!canUndo()}
          mode="outlined"
        />
        <IconButton
          icon="redo"
          size={24}
          onPress={redo}
          disabled={!canRedo()}
          mode="outlined"
        />
        <IconButton
          icon="delete"
          size={24}
          onPress={clearShapes}
          disabled={shapes.length === 0}
          mode="outlined"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 4,
  },
});
