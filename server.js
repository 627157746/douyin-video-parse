const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// 启用CORS
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 静态文件服务
app.use(express.static('.'));

// 添加根路径处理
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

// 处理视频链接解析请求
app.post('/parse', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        
        if (!videoUrl) {
            return res.status(400).json({ error: '请提供视频链接' });
        }

        // 从分享文本中提取抖音链接、视频ID链接或纯视频ID
        let extractedUrl;
        const shortUrlMatch = videoUrl.match(/https:\/\/v\.douyin\.com\/[^\s\u4e00-\u9fa5]+/);
        const pureVideoIdMatch = videoUrl.match(/^\d+$/);
        
        if (shortUrlMatch) {
            extractedUrl = shortUrlMatch[0].trim();
            // 对短链接进行重定向请求
            const firstResponse = await axios.get(extractedUrl, {
                maxRedirects: 0,
                validateStatus: function (status) {
                    return status >= 200 && status < 400;
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
                }
            });

            // 获取重定向URL
            extractedUrl = firstResponse.headers.location || firstResponse.request.res.responseUrl;

            if (!extractedUrl) {
                return res.status(400).json({ error: '无法获取重定向链接' });
            }
        } else if (pureVideoIdMatch) {
            extractedUrl = `https://www.iesdouyin.com/share/video/${videoUrl}`;
        } else {
            return res.status(400).json({ error: '请输入正确的抖音短链接或视频ID' });
        }

        // 验证URL格式
        try {
            new URL(extractedUrl);
        } catch (error) {
            return res.status(400).json({ error: '无效的URL格式' });
        }

        // 检查是否是slides类型的链接
        const slidesMatch = extractedUrl.match(/\/share\/slides\/(\d+)/);
        if (slidesMatch) {
            const slideId = slidesMatch[1];
            const slidesApiUrl = `https://www.iesdouyin.com/web/api/v2/aweme/slidesinfo/?aweme_ids=%5B${slideId}%5D&request_source=200`;
            
            const slidesResponse = await axios.get(slidesApiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
                }
            });

            const slidesData = slidesResponse.data;
            if (!slidesData.aweme_details || slidesData.aweme_details.length === 0) {
                return res.status(400).json({ error: '无法获取图文/视频信息' });
            }

            const itemInfo = slidesData.aweme_details[0];
            const coverUrl = itemInfo.video?.cover?.url_list?.[0];
            
            let responseData = {
                type: 'mixed',
                coverUrl,
                items: []
            };

            // 处理图片
            if (itemInfo.images && itemInfo.images.length > 0) {
                const imageList = itemInfo.images.map(image => ({
                    type: 'image',
                    url: image.url_list[0]
                }));
                responseData.items.push(...imageList);
            }

            // 处理视频
            if (itemInfo.images[0].video && itemInfo.images[0].video.play_addr) {
               
                const videoUrls = itemInfo.images[0].video.play_addr.url_list.map(url => ({
                    type: 'video',
                    url: url.replace('playwm', 'play'),
                    ratio: '720p'
                }));
                responseData.items.push(...videoUrls);
            }

            return res.json({ data: responseData });
        }

        // 处理普通视频链接
        const finalResponse = await axios.get(extractedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
            }
        });

        // 从HTML中提取window._ROUTER_DATA
        const html = finalResponse.data;
        const routerDataMatch = html.match(/window\._ROUTER_DATA = ([\s\S]*?)<\/script>/);
        if (!routerDataMatch) {
            return res.status(400).json({ error: '无法解析视频数据' });
        }

        // 解析JSON数据
        const jsonStr = routerDataMatch[1].replace('video_(id)\\u002Fpage', 'video');
        const jsonData = JSON.parse(jsonStr);

        // 获取内容信息
        const itemInfo = jsonData?.loaderData?.video?.videoInfoRes?.item_list?.[0];
        if (!itemInfo) {
            return res.status(400).json({ error: '无法获取内容信息' });
        }

        let responseData = {};

        // 判断是否为图文类型
        if (itemInfo.aweme_type === 2) {
            // 处理图文内容
            const imageList = itemInfo.images.map(image => ({
                url: image.url_list[0]
            })) || [];

            if (imageList.length === 0) {
                return res.status(400).json({ error: '无法获取图片信息' });
            }

            responseData = {
                type: 'images',
                imageList
            };
        } else {
            // 处理视频内容
            const videoInfo = itemInfo.video;
            if (!videoInfo || !videoInfo.play_addr) {
                return res.status(400).json({ error: '无法获取视频信息' });
            }

            // 获取视频封面URL
            const coverUrl = videoInfo.cover?.url_list?.[0];

            // 获取所有视频URL和分辨率信息
            const urlList = videoInfo.play_addr.url_list.map(url => ({
                url: url.replace('playwm', 'play'),
                ratio: videoInfo.ratio || '720p'
            }));

            if (urlList.length === 0) {
                return res.status(400).json({ error: '无法获取视频地址' });
            }

            responseData = {
                type: 'video',
                urlList,
                coverUrl
            };
        }

        res.json({ data: responseData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: '解析失败',
            details: error.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});