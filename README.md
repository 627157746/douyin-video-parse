# 抖音视频解析工具

一个简单的抖音视频解析工具，支持解析抖音分享链接中的视频和图文内容。在线体验：[https://douyin-video-parse.vercel.app](https://douyin-video-parse.vercel.app)

## 功能特性

- 支持解析抖音短链接
- 支持解析视频ID
- 支持解析视频和图文内容
- 提供视频封面预览
- 支持多种视频质量选择
- 支持一键复制链接
- 支持图文内容轮播展示

## 技术栈

- Node.js (>=18.0.0)
- Express.js - Web服务框架
- Axios - HTTP客户端
- Swiper - 轮播图组件
- Vercel - 部署平台

## 本地开发

1. 克隆项目到本地：
```bash
git clone https://github.com/your-username/douyin-video-parse.git
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
3. 选择默认的构建设置
4. 点击Deploy按钮开始部署

部署完成后，Vercel会自动分配一个域名，你也可以绑定自己的自定义域名。

## 使用说明

1. 在输入框中粘贴抖音分享链接或视频ID（例如：7318669903082338595）
2. 点击解析按钮
3. 等待解析完成后：
   - 视频内容：选择需要的视频质量
   - 图文内容：使用轮播查看所有图片
4. 点击复制按钮即可获取资源链接

## 贡献指南

欢迎提交问题和改进建议！如果你想贡献代码：

1. Fork本项目
2. 创建你的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交你的改动 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 创建一个Pull Request

## 注意事项

- 仅供学习和参考使用
- 请勿用于商业用途
- 遵守相关法律法规

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息