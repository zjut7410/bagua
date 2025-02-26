const guaDatabase = [
    {
        name: "乾卦",
        description: "乾为天，刚健中正，自强不息。象征着领导者的品格，表示事业兴旺发达，前途光明。"
    },
    {
        name: "坤卦",
        description: "坤为地，包容万物，厚德载物。象征着包容与奉献，意味着务实稳重，循序渐进。"
    },
    {
        name: "震卦",
        description: "震为雷，震动警醒。象征着新生与行动，预示着事物将有新的变化和发展。"
    },
    {
        name: "巽卦",
        description: "巽为风，谦逊顺势。象征着谦虚和顺从，暗示着以柔克刚，以智取胜。"
    },
    {
        name: "坎卦",
        description: "坎为水，险中有机。象征着困境与机遇，提醒着在危机中也蕴含着转机。"
    },
    {
        name: "离卦",
        description: "离为火，光明文明。象征着智慧与光明，预示着前途光明，智慧增长。"
    },
    {
        name: "艮卦",
        description: "艮为山，稳重安静。象征着停止与安定，提示需要静心修养，稳扎稳打。"
    },
    {
        name: "兑卦",
        description: "兑为泽，喜悦和顺。象征着愉快与和谐，预示着好运将至，心想事成。"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('baguaVideo');
    const baguaContainer = document.querySelector('.bagua-container');
    
    if (!video) return;

    // 检测是否是微信浏览器
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        document.body.classList.add('wx');
    }

    const waitThreeSeconds = () => new Promise(resolve => setTimeout(resolve, 3000));

    async function initVideo() {
        try {
            video.muted = true;
            video.defaultMuted = true;
            
            // 强制从开始播放
            video.currentTime = 0;
            
            // 尝试立即播放
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(async () => {
                    console.log('视频开始播放');
                    await waitThreeSeconds();
                    video.pause();
                    baguaContainer.classList.add('hide');
                    showRandomGua();
                }).catch(async (error) => {
                    console.log('自动播放失败，尝试用户触发播放');
                    await waitForUserInteraction();
                });
            }
        } catch (error) {
            console.log('视频播放出错，等待用户交互');
            await waitForUserInteraction();
        }
    }

    async function waitForUserInteraction() {
        const playVideo = async () => {
            try {
                await video.play();
                await waitThreeSeconds();
                video.pause();
                baguaContainer.classList.add('hide');
                showRandomGua();
            } catch (error) {
                console.log('用户触发播放失败，直接显示结果');
                baguaContainer.classList.add('hide');
                showRandomGua();
            }
        };

        // 监听多种用户交互事件
        ['touchstart', 'click', 'touchend'].forEach(event => {
            document.addEventListener(event, playVideo, { once: true });
        });
    }

    // 视频加载完成后初始化
    video.addEventListener('loadedmetadata', initVideo);

    // 如果视频已经加载完成，直接初始化
    if (video.readyState >= 2) {
        initVideo();
    }

    // 视频错误处理
    video.addEventListener('error', async function() {
        console.log('视频加载错误，等待3秒后显示结果');
        await waitThreeSeconds();
        baguaContainer.classList.add('hide');
        showRandomGua();
    });
});

function showRandomGua() {
    const randomIndex = Math.floor(Math.random() * guaDatabase.length);
    const selectedGua = guaDatabase[randomIndex];

    const result = document.getElementById('result');
    const guaTitle = document.getElementById('guaTitle');
    const guaDescription = document.getElementById('guaDescription');

    if (!result || !guaTitle || !guaDescription) {
        console.error('找不到必要的DOM元素');
        return;
    }

    guaTitle.textContent = selectedGua.name;
    guaDescription.textContent = selectedGua.description;

    result.style.display = 'block';
    
    requestAnimationFrame(() => {
        result.classList.add('show');
    });
}
