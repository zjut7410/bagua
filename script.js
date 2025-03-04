const guaDatabase = [
    {
        name: "乾卦",
        image: "images/gua/qian.png",
        description: "乾为天，\n刚健中正，自强不息。\n如天行健，君子以自强不息。\n大道在上，光明坦荡，\n万物生发，前程似锦。"
    },
    {
        name: "坤卦",
        image: "images/gua/kun.png",
        description: "坤为地，\n厚德载物，包容万象。\n如地势坤，君子以厚德载物。\n大地深厚，滋养万物，\n静待花开，硕果累累。"
    },
    {
        name: "震卦",
        image: "images/gua/zhen.png",
        description: "震为雷，\n震动警醒，开启新程。\n如雷震响，君子以恐惧修省。\n春雷激荡，万物复苏，\n变革创新，扶摇直上。"
    },
    {
        name: "巽卦",
        image: "images/gua/xun.png",
        description: "巽为风，\n谦逊顺势，柔中带刚。\n如风行地上，君子以谦逊进德。\n和风细雨，润物无声，\n顺势而为，智慧致胜。"
    },
    {
        name: "坎卦",
        image: "images/gua/kan.png",
        description: "坎为水，\n险中有机，明哲保身。\n如水流深，君子以行险而顺。\n水性通达，柔韧不屈，\n守正不移，柳暗花明。"
    },
    {
        name: "离卦",
        image: "images/gua/li.png",
        description: "离为火，\n光明睿智，文明永昌。\n如日之升，君子以明德慎行。\n火光通明，照耀四方，\n智慧光明，前途璀璨。"
    },
    {
        name: "艮卦",
        image: "images/gua/gen.png",
        description: "艮为山，\n稳重安静，止于至善。\n如山之止，君子以思不出位。\n山岳巍峨，静若太古，\n厚积薄发，成就非凡。"
    },
    {
        name: "兑卦",
        image: "images/gua/dui.png",
        description: "兑为泽，\n喜悦和顺，润泽万物。\n如泽气浸，君子以朋友讲习。\n秋水盈盈，喜乐安康，\n心想事成，万事亨通。"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const video = document.getElementById('baguaVideo');
    const baguaContainer = document.querySelector('.bagua-container');
    const tapHint = document.querySelector('.tap-hint');
    
    if (!video) return;

    let videoPlayed = false;
    const waitThreeSeconds = () => new Promise(resolve => setTimeout(resolve, 1000));

    // 检测是否是微信浏览器
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    // 检测是否是移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 预加载图片
    function preloadImages() {
        const loadedImages = [];
        guaDatabase.forEach(gua => {
            const img = new Image();
            img.onload = () => console.log(`图片加载成功: ${gua.image}`);
            img.onerror = () => console.error(`图片加载失败: ${gua.image}`);
            img.src = gua.image;
            loadedImages.push(img);
        });
        return loadedImages;
    }

    async function handleVideoEnd() {
        if (!videoPlayed) {
            videoPlayed = true;
            baguaContainer.classList.add('hide');
            await waitThreeSeconds();
            showRandomGua();
        }
    }

    async function initVideo() {
        try {
            // 设置视频预加载
            if (!video.src) {
                video.src = 'bagua.mp4';
            }
            video.preload = 'auto';
            
            // 开始预加载
            const preloadPromise = new Promise((resolve, reject) => {
                video.addEventListener('canplaythrough', resolve, { once: true });
                video.addEventListener('error', reject, { once: true });
                setTimeout(resolve, 3000); // 3秒超时
            });

            // 等待预加载完成或超时
            await preloadPromise;
            
            // 重置视频状态
            video.currentTime = 0;
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('x5-playsinline', 'true');
            video.setAttribute('x5-video-player-type', 'h5');
            video.setAttribute('x5-video-player-fullscreen', 'true');
            
            // 针对微信浏览器的特殊处理
            if (isWechat) {
                document.addEventListener("WeixinJSBridgeReady", function () {
                    video.play();
                }, false);
            }
            
            // 监听视频结束
            video.addEventListener('ended', handleVideoEnd);
            
            // 移动设备或微信浏览器等待用户交互
            if (isMobile || isWechat) {
                handleUserInteraction();
            } else {
                tryAutoPlay();
            }
        } catch (error) {
            console.log('视频初始化失败');
            handleUserInteraction();
        }
    }

    async function tryAutoPlay() {
        try {
            await video.play();
            tapHint.style.display = 'none';
        } catch (error) {
            console.log('自动播放失败，等待用户交互');
            handleUserInteraction();
        }
    }

    function handleUserInteraction() {
        tapHint.style.display = 'block';
        
        const startVideo = async (event) => {
            event.preventDefault();
            if (videoPlayed) return;
            
            tapHint.style.display = 'none';
            
            try {
                // 确保视频已加载
                if (video.readyState === 0) {
                    await video.load();
                }
                video.currentTime = 0;
                await video.play();
            } catch (error) {
                console.log('用户交互播放失败');
                handleVideoEnd();
            }
        };

        // 添加多个事件监听以提高响应性
        ['touchstart', 'click', 'touchend'].forEach(event => {
            baguaContainer.addEventListener(event, startVideo, { once: true });
        });
    }

    // 视频加载完成后隐藏加载动画
    video.addEventListener('loadeddata', () => {
        loadingOverlay.style.display = 'none';
    });

    // 如果视频加载时间过长，设置超时
    setTimeout(() => {
        if (loadingOverlay.style.display !== 'none') {
            loadingOverlay.style.display = 'none';
        }
    }, 5000);

    // 预加载图片
    preloadImages();

    // 初始化视频
    initVideo();

    // 视频错误处理
    video.addEventListener('error', handleVideoEnd);
});

function showRandomGua() {
    const randomIndex = Math.floor(Math.random() * guaDatabase.length);
    const selectedGua = guaDatabase[randomIndex];

    const result = document.getElementById('result');
    const resultContent = document.querySelector('.result-content');
    
    // 清空之前的内容并添加新内容
    resultContent.innerHTML = `
        <img src="${selectedGua.image}" 
            alt="${selectedGua.name}" 
            class="gua-image"
            onerror="this.onerror=null; this.src='images/gua/default.png';">
        <h2>${selectedGua.name}</h2>
        <p>${selectedGua.description.replace(/\n/g, '<br>')}</p>
    `;

    // 确保元素可见
    result.style.display = 'flex';
    result.style.visibility = 'visible';
    
    // 使用 setTimeout 确保过渡效果正常显示
    setTimeout(() => {
        result.classList.add('show');
    }, 100);
}
