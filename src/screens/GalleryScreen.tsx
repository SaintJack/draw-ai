import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Button, FAB} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {DrawingService} from '../services/drawingService';
import {Drawing} from '../models/Drawing';
import {DrawingItem} from '../components/Gallery/DrawingItem';
import {storageService} from '../services/storageService';

type GalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gallery'
>;

const GalleryScreen: React.FC = () => {
  const navigation = useNavigation<GalleryScreenNavigationProp>();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化数据库
  useEffect(() => {
    const init = async () => {
      try {
        await storageService.initDatabase();
        await loadDrawings();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 每次进入页面时刷新列表
  useFocusEffect(
    React.useCallback(() => {
      loadDrawings();
    }, []),
  );

  const loadDrawings = async () => {
    try {
      const allDrawings = await DrawingService.getAllDrawings();
      setDrawings(allDrawings);
    } catch (error) {
      console.error('Failed to load drawings:', error);
    }
  };

  const handleDrawingPress = async (drawing: Drawing) => {
    // 加载作品并导航到画布
    const loaded = await DrawingService.loadDrawing(drawing.id);
    if (loaded) {
      // TODO: 将作品数据传递给 DrawingScreen
      navigation.navigate('Drawing', {drawingId: drawing.id});
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('删除作品', '确定要删除这个作品吗？', [
      {text: '取消', style: 'cancel'},
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await DrawingService.deleteDrawing(id);
            await loadDrawings();
          } catch (error) {
            Alert.alert('错误', '删除失败');
          }
        },
      },
    ]);
  };

  const handleExport = async (id: string) => {
    // TODO: 实现导出功能
    Alert.alert('提示', '导出功能开发中');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {drawings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              还没有作品
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              开始创作你的第一幅画吧！
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Drawing')}
              style={styles.createButton}>
              开始创作
            </Button>
          </View>
        ) : (
          drawings.map(drawing => (
            <DrawingItem
              key={drawing.id}
              drawing={drawing}
              onPress={handleDrawingPress}
              onDelete={handleDelete}
              onExport={handleExport}
            />
          ))
        )}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Drawing')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  createButton: {
    minWidth: 120,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default GalleryScreen;
