import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type GalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gallery'
>;

const GalleryScreen: React.FC = () => {
  const navigation = useNavigation<GalleryScreenNavigationProp>();

  // TODO: 从状态管理获取作品列表
  const drawings: any[] = [];

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
          drawings.map((drawing, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium">{drawing.title || '未命名作品'}</Text>
                <Text variant="bodySmall" style={styles.dateText}>
                  {new Date(drawing.createdAt).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
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
  card: {
    marginBottom: 12,
  },
  dateText: {
    marginTop: 4,
    color: '#666',
  },
});

export default GalleryScreen;
