import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Text, IconButton, Menu} from 'react-native-paper';
import {Drawing} from '../../models/Drawing';

interface DrawingItemProps {
  drawing: Drawing;
  onPress: (drawing: Drawing) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

/**
 * 作品列表项组件
 */
export const DrawingItem: React.FC<DrawingItemProps> = ({
  drawing,
  onPress,
  onDelete,
  onExport,
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.card} onPress={() => onPress(drawing)}>
      <Card.Content>
        <View style={styles.content}>
          <View style={styles.info}>
            <Text variant="titleMedium" numberOfLines={1}>
              {drawing.title || '未命名作品'}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {formatDate(drawing.updatedAt)}
            </Text>
          </View>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(true)}
              />
            }>
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                onExport(drawing.id);
              }}
              title="导出"
              leadingIcon="download"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                onDelete(drawing.id);
              }}
              title="删除"
              leadingIcon="delete"
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  date: {
    marginTop: 4,
    color: '#666',
  },
});
