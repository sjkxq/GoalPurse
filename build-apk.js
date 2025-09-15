#!/usr/bin/env node

/**
 * 构建 GoalPurse APK 的脚本
 * 
 * 使用说明:
 * 1. 确保已安装 Android Studio 和 Android SDK
 * 2. 确保已设置 ANDROID_HOME 环境变量
 * 3. 运行: node build-apk.js
 * 
 * 支持的命令行参数:
 * --release - 构建发布版本 (需要先配置签名)
 * --clean - 清理之前构建的文件
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import path from 'path';

const projectRoot = path.resolve('.');
const androidProjectPath = path.join(projectRoot, 'android');
const args = process.argv.slice(2);

console.log('开始构建 GoalPurse APK...');

// 检查是否需要构建发布版本
const isRelease = args.includes('--release');
// 检查是否需要清理
const shouldClean = args.includes('--clean');

try {
  // 检查必要工具是否已安装
  console.log('检查必要工具...');
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    execSync('npx cap --version', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('请确保已安装 pnpm 和 @capacitor/cli');
  }

  // 清理旧的构建文件
  if (shouldClean) {
    console.log('清理旧的构建文件...');
    const buildDir = path.join(androidProjectPath, 'app', 'build');
    if (existsSync(buildDir)) {
      rmSync(buildDir, { recursive: true, force: true });
      console.log('已清理构建目录');
    }
  }

  // 1. 构建 Web 项目
  console.log('1. 构建 Vue 项目...');
  execSync('pnpm build', { cwd: projectRoot, stdio: 'inherit' });
  
  // 2. 同步到 Android 项目
  console.log('2. 同步到 Android 项目...');
  execSync('npx cap sync', { cwd: projectRoot, stdio: 'inherit' });
  
  // 3. 检查 Android 项目是否存在
  if (!existsSync(androidProjectPath)) {
    throw new Error('Android 项目不存在，请先运行 npx cap add android');
  }
  
  // 4. 构建 APK
  console.log(`3. 构建 ${isRelease ? '发布' : '调试'} APK...`);
  const gradleTask = isRelease ? 'assembleRelease' : 'assembleDebug';
  
  // 根据操作系统选择正确的 gradlew 命令
  const isWindows = process.platform === 'win32';
  const gradleCommand = isWindows ? '.\\gradlew' : './gradlew';
  
  execSync(`${gradleCommand} ${gradleTask}`, { 
    cwd: androidProjectPath, 
    stdio: 'inherit',
    shell: true
  });
  
  const apkType = isRelease ? 'release' : 'debug';
  const apkPath = path.join('android', 'app', 'build', 'outputs', 'apk', apkType, `app-${apkType}.apk`);
  
  console.log('\n✅ APK 构建完成！');
  console.log(`APK 位置: ${apkPath}`);
  
  // 提供安装说明
  if (!isRelease) {
    console.log('\n💡 安装 APK 到设备:');
    console.log('  1. 连接 Android 设备并启用 USB 调试');
    console.log('  2. 运行: adb install ' + apkPath);
  }
  
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  if (error.stderr) {
    console.error('详细错误信息:', error.stderr.toString());
  }
  process.exit(1);
}