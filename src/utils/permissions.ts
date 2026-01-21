import {Platform, PermissionsAndroid, Alert} from 'react-native';

/**
 * 权限管理工具
 */
export class PermissionManager {
  /**
   * 请求录音权限
   */
  static async requestRecordAudioPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      // iOS 权限在 Info.plist 中配置
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: '需要录音权限',
          message: '应用需要录音权限才能使用语音输入功能',
          buttonNeutral: '稍后询问',
          buttonNegative: '拒绝',
          buttonPositive: '允许',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          '权限被拒绝',
          '需要录音权限才能使用语音功能。请在设置中授予权限。',
          [{text: '确定'}],
        );
        return false;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }

  /**
   * 检查录音权限状态
   */
  static async checkRecordAudioPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return result;
    } catch (err) {
      console.warn('Permission check error:', err);
      return false;
    }
  }

  /**
   * 请求所有必要权限
   */
  static async requestAllPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ];

      // Android 13+ 需要 READ_MEDIA_IMAGES，旧版本需要 WRITE_EXTERNAL_STORAGE
      if (Platform.Version >= 33) {
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
      } else {
        permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      }

      const results = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (!allGranted) {
        Alert.alert(
          '权限被拒绝',
          '部分权限被拒绝，可能影响应用功能。请在设置中授予权限。',
          [{text: '确定'}],
        );
      }

      return allGranted;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
}
