import {View, Dimensions, Platform, PermissionsAndroid} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

/**
 * 图片导出工具
 * 支持导出画布为 PNG/JPG 格式
 */
export class ImageExporter {
  /**
   * 导出画布为图片
   */
  static async exportCanvas(
    canvasRef: React.RefObject<View>,
    format: 'png' | 'jpg' = 'png',
    quality: number = 0.9,
  ): Promise<string | null> {
    if (!canvasRef.current) {
      console.error('Canvas ref not available');
      return null;
    }

    try {
      // 请求存储权限（Android）
      if (Platform.OS === 'android') {
        const hasPermission = await this.requestStoragePermission();
        if (!hasPermission) {
          throw new Error('Storage permission denied');
        }
      }

      // 捕获画布
      const uri = await captureRef(canvasRef.current, {
        format,
        quality,
        result: 'tmpfile',
      });

      // 保存到相册/文件系统
      const savedPath = await this.saveToGallery(uri, format);

      return savedPath;
    } catch (error) {
      console.error('Export error:', error);
      return null;
    }
  }

  /**
   * 请求存储权限
   */
  private static async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        // Android 13+
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 及以下
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }

  /**
   * 保存图片到相册
   */
  private static async saveToGallery(
    uri: string,
    format: 'png' | 'jpg',
  ): Promise<string> {
    const timestamp = Date.now();
    const filename = `draw_ai_${timestamp}.${format}`;

    if (Platform.OS === 'android') {
      // Android: 保存到 Pictures 目录
      const picturesPath = RNFS.PicturesDirectoryPath;
      const destPath = `${picturesPath}/${filename}`;

      await RNFS.copyFile(uri, destPath);
      return destPath;
    } else {
      // iOS: 保存到相册（需要 react-native-camera-roll 或类似库）
      // 这里先返回临时路径
      return uri;
    }
  }

  /**
   * 生成缩略图
   */
  static async generateThumbnail(
    canvasRef: React.RefObject<View>,
    size: number = 200,
  ): Promise<string | null> {
    if (!canvasRef.current) {
      return null;
    }

    try {
      const uri = await captureRef(canvasRef.current, {
        format: 'png',
        quality: 0.8,
        width: size,
        height: size,
        result: 'tmpfile',
      });

      return uri;
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return null;
    }
  }
}
