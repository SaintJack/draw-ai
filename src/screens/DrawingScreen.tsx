import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {DrawingCanvas, DrawingToolbar} from '../components/Canvas';
import {TextInputComponent} from '../components/VoiceInput';

type DrawingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Drawing'
>;

const DrawingScreen: React.FC = () => {
  const navigation = useNavigation<DrawingScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <DrawingCanvas />
      </View>
      <View style={styles.toolbar}>
        <DrawingToolbar />
      </View>
      <View style={styles.inputArea}>
        <TextInputComponent />
      </View>
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Gallery')}
          style={styles.button}
          icon="folder">
          作品集
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Settings')}
          style={styles.button}
          icon="cog">
          设置
        </Button>
      </View>
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
