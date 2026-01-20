# Android 开发环境配置指南

## 前置要求

### 1. 安装 Java JDK

- 下载并安装 JDK 11 或更高版本
- 配置 JAVA_HOME 环境变量

```bash
# macOS / Linux
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# Windows
# 在系统环境变量中设置 JAVA_HOME
```

### 2. 安装 Android Studio

1. 下载并安装 [Android Studio](https://developer.android.com/studio)
2. 打开 Android Studio，完成初始设置
3. 安装 Android SDK：
   - Tools → SDK Manager
   - 选择 Android SDK Platform 21 (Android 5.0) 或更高版本
   - 安装 Android SDK Build-Tools
   - 安装 Android SDK Platform-Tools

### 3. 配置环境变量

```bash
# macOS / Linux (~/.zshrc 或 ~/.bash_profile)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows
# 在系统环境变量中设置：
# ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
# 添加到 PATH: %ANDROID_HOME%\platform-tools
```

### 4. 创建 Android 项目结构

由于这是从零开始的项目，需要初始化 React Native Android 项目：

```bash
# 方法 1: 使用 React Native CLI（推荐）
npx react-native init DrawAITemp --template react-native-template-typescript
# 然后复制 android 文件夹到当前项目

# 方法 2: 手动创建（需要更多配置）
# 参考 React Native 官方文档创建 android 目录结构
```

### 5. Android 项目基本配置

创建 `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## 验证安装

```bash
# 检查 Java 版本
java -version

# 检查 Android SDK
adb version

# 检查环境变量
echo $ANDROID_HOME  # macOS/Linux
echo %ANDROID_HOME% # Windows
```

## 运行应用

```bash
# 1. 启动 Metro bundler
npm start

# 2. 在另一个终端运行 Android
npm run android

# 或者使用 Android Studio
# 打开 android 文件夹，点击 Run 按钮
```

## 常见问题

### 问题 1: 找不到 Android SDK
- 检查 ANDROID_HOME 环境变量是否正确设置
- 在 Android Studio 中确认 SDK 路径

### 问题 2: Gradle 构建失败
- 检查网络连接（Gradle 需要下载依赖）
- 检查 `android/gradle/wrapper/gradle-wrapper.properties` 中的 Gradle 版本

### 问题 3: 模拟器无法启动
- 在 Android Studio 中创建 AVD (Android Virtual Device)
- 确保已安装 HAXM (Intel) 或 Hypervisor (AMD)

## 下一步

完成 Android 环境配置后，继续执行：
1. 运行 `npm install` 安装依赖
2. 运行 `npm start` 启动 Metro
3. 运行 `npm run android` 启动应用
