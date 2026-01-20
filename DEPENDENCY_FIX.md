# 依赖修复说明

## 问题

安装依赖时遇到错误：
```
npm error notarget No matching version found for @react-native-voice/voice@^4.0.0
```

## 解决方案

已将语音识别包从 `@react-native-voice/voice@^4.0.0` 更改为 `@react-native-community/voice@^1.1.9`。

### 修改内容

1. **package.json**
   - 旧：`"@react-native-voice/voice": "^4.0.0"`
   - 新：`"@react-native-community/voice": "^1.1.9"`

2. **jest.config.js**
   - 更新了 transformIgnorePatterns 中的包名引用

## 使用说明

### 导入方式

在使用语音识别功能时，请使用以下导入方式：

```typescript
import Voice from '@react-native-community/voice';
```

### API 使用

`@react-native-community/voice` 的 API 与之前的包类似，但有一些差异。主要用法：

```typescript
import Voice from '@react-native-community/voice';

// 启动语音识别
Voice.start('zh-CN');

// 监听结果
Voice.onSpeechResults = (e) => {
  console.log(e.value); // 识别结果数组
};

// 停止识别
Voice.stop();
```

详细文档请参考：[@react-native-community/voice](https://github.com/react-native-community/react-native-voice)

## 安装状态

✅ **依赖已成功安装**

虽然有一些警告（deprecated packages），但这些是正常的，因为 React Native 0.72 使用了一些较旧的依赖。这些警告不会影响项目运行。

## 安全漏洞

检测到 5 个高危漏洞，建议运行：

```bash
npm audit fix
```

如果 `npm audit fix` 无法自动修复，可以查看详细信息：

```bash
npm audit
```

**注意**：某些漏洞可能来自 React Native 的依赖，需要等待上游修复。

## 下一步

1. ✅ 依赖已安装完成
2. 配置 Android 开发环境（参考 `ANDROID_SETUP.md`）
3. 运行 `npm start` 启动 Metro bundler
4. 运行 `npm run android` 启动应用

## 注意事项

- `@react-native-community/voice` 需要原生链接，在 Android 上可能需要额外配置
- 如果使用 iOS，需要运行 `cd ios && pod install`
- 语音识别功能需要相应的权限配置（已在 AndroidManifest.xml 中声明）
