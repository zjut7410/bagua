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
    const result = document.getElementById('result');
    
    if (!video) return;

    let videoPlayed = false;
    let videoLoaded = false;
    let videoStarted = false;
    let userInteracted = false;
    const waitThreeSeconds = () => new Promise(resolve => setTimeout(resolve, 1000));

    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
            if (!video.src) {
                video.src = 'bagua.mp4';
            }

            if (isMobile || isWechat) {
                video.load();
                await new Promise((resolve) => {
                    const loadCheck = () => {
                        if (video.readyState >= 2) {
                            resolve();
                        } else {
                            requestAnimationFrame(loadCheck);
                        }
                    };
                    loadCheck();
                    setTimeout(resolve, 3000);
                });
            }

            video.currentTime = 0;
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;

            video.addEventListener('ended', handleVideoEnd);

            if (isMobile || isWechat) {
                loadingOverlay.style.display = 'none';
                handleUserInteraction();
            } else {
                await tryAutoPlay();
            }
        } catch (error) {
            console.log('视频初始化失败', error);
            loadingOverlay.style.display = 'none';
            handleUserInteraction();
        }
    }

    async function tryAutoPlay() {
        try {
            if (!videoStarted && !videoPlayed) {
                videoStarted = true;
                await video.play();
                tapHint.style.display = 'none';
            }
        } catch (error) {
            console.log('自动播放失败，等待用户交互');
            handleUserInteraction();
        }
    }

    function handleUserInteraction() {
        if (userInteracted || videoPlayed) return;
        userInteracted = true;

        tapHint.style.display = 'block';
        
        const startVideo = async (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            if (videoPlayed || videoStarted) return;
            
            tapHint.style.display = 'none';
            
            try {
                video.load();
                await video.play();
                videoStarted = true;
            } catch (error) {
                console.log('播放失败', error);
                handleVideoEnd();
            }
        };

        ['touchstart', 'click'].forEach(event => {
            baguaContainer.addEventListener(event, startVideo, { 
                once: true,
                capture: true,
                passive: false
            });
        });
    }

    video.addEventListener('loadeddata', () => {
        videoLoaded = true;
        loadingOverlay.style.display = 'none';
    });

    setTimeout(() => {
        if (!videoLoaded && loadingOverlay.style.display !== 'none') {
            loadingOverlay.style.display = 'none';
            if (!userInteracted && !videoPlayed) {
                handleUserInteraction();
            }
        }
    }, 5000);

    preloadImages();
    initVideo();

    video.addEventListener('error', () => {
        console.log('视频加载出错');
        loadingOverlay.style.display = 'none';
        if (!videoPlayed) {
            handleVideoEnd();
        }
    });

    window.addEventListener('beforeunload', () => {
        video.pause();
    });
});

function showRandomGua() {
    const randomIndex = Math.floor(Math.random() * guaDatabase.length);
    const selectedGua = guaDatabase[randomIndex];

    const result = document.getElementById('result');
    const resultContent = document.querySelector('.result-content');
    
    resultContent.innerHTML = `
        <img src="${selectedGua.image}" 
            alt="${selectedGua.name}" 
            class="gua-image"
            onerror="this.onerror=null; this.src='images/gua/default.png';">
        <h2>${selectedGua.name}</h2>
        <p>${selectedGua.description.replace(/\n/g, '<br>')}</p>
    `;

    result.style.display = 'flex';
    result.style.visibility = 'visible';
    
    setTimeout(() => {
        result.classList.add('show');
    }, 100);
}
