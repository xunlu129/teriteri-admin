<template>
    <div class="flex-fill">
        <div class="v-container">
            <div class="video-detail__layout">
                <div id="player" class="player">
                    <video src="" controls></video>
                </div>
                <div class="detail">
                    <div class="v-card" style="height: 250px;">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "VideoDetail",
    data() {
        return {
            video: {},  // 视频信息
            user: {},   // 投稿用户信息
            category: {},   // 视频分区信息
        }
    },
    methods: {
        // 请求
        // 获取视频详细信息
        async getVideoDetail() {
            const res = await this.$get('review/video/getone', {
                params: {
                    vid: this.$route.params.vid,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("teri_token"),
                },
            });
            if (res.data.data) {
                console.log("视频详情: ", res.data.data);
                this.video = res.data.data.video;
                this.user = res.data.data.user;
                this.category = res.data.data.category;
            }
        },

        // 事件
        // 窗口大小改变时更新 player 的高度
        updatePlayerHeight() {
            const playerElement = document.getElementById('player');
            const playerWidth = playerElement.offsetWidth;
            const playerHeight = playerWidth * (9 / 16);
            playerElement.style.height = `${playerHeight}px`;
        }
    },
    async created() {
        await this.getVideoDetail();
    },
    mounted() {
        this.updatePlayerHeight();
        window.addEventListener('resize', this.updatePlayerHeight);
    },
    unmounted() {
        window.removeEventListener('resize', this.updatePlayerHeight);
    }
}
</script>

<style scoped>
.v-container {
    position: relative;
}

.video-detail__layout {
    position: relative;
    width: 100%;
    display: flex;
}

.player {
    box-shadow: 2px 2px 10px #0000003f;
    background-color: dimgray;
    width: 66%;
    max-width: 672px;
}

.player video {
    width: 100%;
    height: 100%;
}

.detail {
    flex: 1;
    margin: 0 0 0 16px;
    min-width: 400px;
}

@media (max-width: 700px) {
    .video-detail__layout {
        flex-direction: column;
    }

    .player {
        width: auto;
    }

    .detail {
        margin: 16px 0 0 0;
        min-width: auto;
    }
}

@media (min-width: 700.1px) and (max-width: 800px) {
    .detail {
        min-width: 300px;
    }
}
</style>