# 构建 APK 说明

# 概述

本指南将介绍如何将 GoalPurse Vue.js 项目构建为 Android APK 文件。

# 前提条件

在构建 APK 之前，需要安装以下工具：

1. [Android Studio](https://developer.android.com/studio) - 包含 Android SDK 和构建工具
2. 设置环境变量：
   - `ANDROID_HOME` 指向 Android SDK 安装目录
   - 将 `ANDROID_HOME/tools` 和 `ANDROID_HOME/platform-tools` 添加到 PATH

# 项目结构

构建后的项目结构如下：
```
GoalPurse/
├── android/                 # Android 项目目录
│   ├── app/                 # 应用模块
│   │   ├── src/             # 源代码
│   │   └── build.gradle     # 应用构建配置
│   ├── gradle/              # Gradle 包装器
│   ├── build.gradle         # 项目级构建配置
│   ├── gradle.properties    # Gradle 配置属性
│   └── gradlew              # Gradle 包装器脚本
├── src/                     # Vue.js 源代码
├── dist/                    # 构建后的 Web 资源
└── build-apk.js             # APK 构建脚本
```

# 使用国内镜像加速构建

为了加速在中国大陆地区的构建过程，项目已经配置了腾讯云和阿里云镜像：

1. Gradle Wrapper 使用腾讯云镜像地址
2. Maven 仓库使用腾讯云镜像和阿里云镜像

这些配置已经应用在以下文件中：
- `android/gradle/wrapper/gradle-wrapper.properties` - Gradle 分发包使用腾讯云镜像
- `android/build.gradle` - 项目级仓库配置了国内镜像
- `android/app/build.gradle` - 应用级仓库配置了国内镜像
- `android/gradle.properties` - 系统级配置了镜像参数

如果需要进一步优化构建速度，可以：

1. 在 `android/gradle.properties` 文件中添加额外的镜像配置：
   ```properties
   # 阿里云 Maven 镜像
   ALIYUN_MAVEN_URL=https://maven.aliyun.com/repository/google
   ALIYUN_JCENTER_URL=https://maven.aliyun.com/repository/jcenter
   ```

# 构建步骤

## 自动构建（推荐）

项目包含一个自动构建脚本，可以一键构建 APK：

```bash
# 构建调试版本 APK
pnpm build:apk

# 构建调试版本 APK 并清理之前的构建文件
pnpm build:apk -- --clean

# 构建发布版本 APK（需要先配置签名）
pnpm build:apk -- --release
```

该脚本将执行以下操作：
1. 构建 Vue.js 项目
2. 同步到 Android 项目
3. 构建 Debug APK

构建完成后，APK 文件位于：`android/app/build/outputs/apk/debug/app-debug.apk`

## 手动构建

如果需要更多控制，可以手动执行构建步骤：

1. 构建 Web 项目：
   ```bash
   pnpm build
   ```

2. 同步到 Android 项目：
   ```bash
   npx cap sync
   ```

3. 构建 APK：
   ```bash
   # Windows 系统
   cd android
   .\gradlew assembleDebug
   
   # macOS/Linux 系统
   cd android
   ./gradlew assembleDebug
   ```

# 在 Android Studio 中构建

你也可以在 Android Studio 中打开项目来构建：

1. 打开 Android Studio
2. 选择 "Open an existing Android Studio project"
3. 导航到项目目录下的 `android` 文件夹并打开
4. 在菜单栏选择 Build > Build Bundle(s) / APK(s) > Build APK(s)

# 构建发布版本

要构建用于发布的版本，需要先生成签名密钥：

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```

然后修改 `android/app/build.gradle` 文件，添加签名配置：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../my-release-key.keystore')
            storePassword 'your_store_password'
            keyAlias 'alias_name'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

然后运行：

```bash
# Windows 系统
cd android
.\gradlew assembleRelease

# macOS/Linux 系统
cd android
./gradlew assembleRelease
```

发布版本 APK 将位于：`android/app/build/outputs/apk/release/app-release.apk`

# 安装 APK 到设备

构建完成后，可以通过以下方式安装 APK 到设备：

1. 连接 Android 设备并启用 USB 调试
2. 运行安装命令：
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

# 故障排除

## 常见问题

1. **构建失败：找不到 Android SDK**
   - 确保已安装 Android Studio
   - 检查 `ANDROID_HOME` 环境变量是否正确设置

2. **构建缓慢**
   - 确保已配置国内镜像
   - 检查网络连接

3. **权限错误**
   - 确保对项目目录有读写权限
   - 在 Linux/macOS 上，可能需要运行 `chmod +x android/gradlew`

## 清理构建缓存

如果遇到构建问题，可以尝试清理构建缓存：

```bash
# 清理 Android 构建缓存
cd android
.\gradlew clean

# 或使用构建脚本的清理选项
pnpm build:apk -- --clean
```

# 最佳实践

1. **版本管理**：
   - 在发布新版本前更新 `android/app/build.gradle` 中的 versionCode 和 versionName
   - 遵循语义化版本控制规范

2. **安全性**：
   - 不要将签名密钥文件提交到版本控制系统
   - 在 `android/app/build.gradle` 中使用环境变量存储敏感信息

3. **性能优化**：
   - 启用 ProGuard/R8 代码混淆以减小 APK 大小
   - 使用 APK 分析器检查 APK 组成

4. **测试**：
   - 在多种设备和 Android 版本上测试 APK
   - 使用 Firebase Test Lab 等云测试服务