# 抖音视频解析工具

一个简单的抖音视频解析工具，支持解析抖音分享链接中的视频、图文和混合内容。在线体验：[https://dy.hhhb.de](https://dy.hhhb.de)

## 功能特性

- 支持解析抖音短链接
- 支持解析视频ID
- 支持解析视频、图文和混合内容
- 支持自动识别内容类型
- 提供视频/图片封面预览
- 支持一键下载资源
- 支持图文内容轮播展示
- 响应式设计，移动端友好

## 技术栈

- Node.js (>=18.0.0)
- Express.js - Web服务框架
- Axios - HTTP客户端
- Swiper - 轮播图组件
- Vercel - 部署平台

## 本地开发

1. 克隆项目到本地：
```bash
git clone https://github.com/627157746/douyin-video-parse.git
cd douyin-video-parse
```

2. 安装依赖：
```bash
npm install
```

3. 启动服务：
```bash
npm start
```

4. 打开浏览器访问：`http://localhost:3000`

## Vercel部署

1. Fork本项目到你的GitHub账号
2. 在Vercel中导入该项目
3. 确保使用Node.js 18+版本
4. 点击Deploy按钮开始部署

部署完成后，Vercel会自动分配一个域名，你也可以绑定自己的自定义域名。

## 使用说明

1. 在输入框中粘贴抖音分享链接或视频ID
   - 支持短链接格式：https://v.douyin.com/xxxxxx/
   - 支持纯视频ID格式：1234567890
   - 支持从分享文本中自动提取链接
2. 点击解析按钮或粘贴后自动解析
3. 等待解析完成后：
   - 视频内容：点击"下载视频"按钮下载
   - 图文内容：使用轮播查看所有图片，点击"下载图片"按钮下载
   - 混合内容：分别提供图片和视频的下载按钮
4. 可以随时清空输入框重新解析

## API说明

解析接口：`/parse`

请求方法：POST

请求参数：
```json
{
  "videoUrl": "抖音短链接或视频ID"
}
```

响应格式：
```json
{
  "data": {
    "type": "video|images|mixed",
    "coverUrl": "封面URL",
    "urlList": [...],  // 视频类型
    "imageList": [...],  // 图片类型
    "items": [...]     // 混合类型
  }
}
```

## 注意事项

- 仅供学习和参考使用
- 请勿用于商业用途
- 遵守相关法律法规
- 尊重原创内容版权
