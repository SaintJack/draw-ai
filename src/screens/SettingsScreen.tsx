import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, List, Divider} from 'react-native-paper';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <List.Section>
          <List.Subheader>应用信息</List.Subheader>
          <List.Item
            title="版本"
            description="1.0.0 (MVP)"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="关于"
            description="儿童简笔画 AI 画图应用"
            left={props => <List.Icon {...props} icon="help-circle" />}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>功能</List.Subheader>
          <List.Item
            title="语音输入"
            description="支持语音识别输入"
            left={props => <List.Icon {...props} icon="microphone" />}
          />
          <Divider />
          <List.Item
            title="作品管理"
            description="保存和管理你的作品"
            left={props => <List.Icon {...props} icon="folder" />}
          />
        </List.Section>
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
});

export default SettingsScreen;
