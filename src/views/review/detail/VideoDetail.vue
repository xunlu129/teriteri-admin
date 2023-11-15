<template>
    <div class="flex-fill">
        <div class="v-container">
            <div class="video-detail__layout">
                <div class="left">
                    <div id="player" class="player">
                        <video :src="video.videoUrl" controls></video>
                    </div>
                    <div class="v-card options">
                        <div class="options-top">
                            <div class="status" v-if="video.status === 0">
                                <i class="iconfont icon-shenhezhong"></i>
                                <span>待审核</span>
                            </div>
                            <div class="status" v-if="video.status === 1">
                                <i class="iconfont icon-wancheng"></i>
                                <span>已通过</span>
                            </div>
                            <div class="status" v-if="video.status === 2">
                                <i class="iconfont icon-shibai"></i>
                                <span>未通过</span>
                            </div>
                            <div class="items">
                                <el-button type="success" plain class="options-item pass" @click="updateVideoStatus(1)">
                                    <el-icon v-if="isMiniWidth"><Select /></el-icon>
                                    <span v-else>通过审核</span>
                                </el-button>
                                <el-button type="warning" plain class="options-item no-pass" @click="updateVideoStatus(2)">
                                    <el-icon v-if="isMiniWidth"><CloseBold /></el-icon>
                                    <span v-else>不予过审</span>
                                </el-button>
                                <el-button type="danger" plain class="options-item ban" @click="beforeDelete">
                                    <el-icon v-if="isMiniWidth"><Delete /></el-icon>
                                    <span v-else>永久删除</span>
                                </el-button>
                            </div>                            
                        </div>
                    </div>
                </div>                
                <div class="detail">
                    <div class="v-card detail-card">
                        <div class="detail-item">
                            <div class="item-title">标题</div>
                            <div class="item-content">{{ video.title }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="item-title">类型</div>
                            <div class="item-content">
                                <span class="type" v-if="video.type === 1">自制</span>
                                <span class="type" v-if="video.type === 2">转载</span>
                                <div class="auth" v-if="video.type === 1 && video.auth === 1">
                                    <i class="iconfont icon-jinzhi"></i>
                                    <span>未经授权 禁止转载</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-title">分区</div>
                            <div class="item-content">
                                {{ category.mcName }} &nbsp;→&nbsp; {{ category.scName }}
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-title">标签</div>
                            <div class="item-content">
                                <div class="tag-container" v-for="(item, index) in tags" :key="index">
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-title">简介</div>
                            <div class="item-content"><span class="v-text descr" v-html="formatText(video.descr)"></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { linkify } from '@/utils/utils.js';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: "VideoDetail",
    data() {
        return {
            video: {},  // 视频信息
            user: {},   // 投稿用户信息
            category: {},   // 视频分区信息
            tags: [],   // 投稿标签
            isMiniWidth: false, // 判断是否小窗
        }
    },
    methods: {
        // 请求
        // 获取视频详细信息
        async getVideoDetail() {
            const res = await this.$get('/review/video/getone', {
                params: {
                    vid: this.$route.params.vid,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("teri_token"),
                },
            });
            if (res.data.data) {
                // console.log("视频详情: ", res.data.data);
                this.video = res.data.data.video;
                this.user = res.data.data.user;
                this.category = res.data.data.category;
                this.tags = res.data.data.video.tags.split("\r\n").filter(tag => tag.trim() !== "");
            }
        },

        // 更新视频状态
        async updateVideoStatus(vstatus) {
            this.$store.state.isLoading = true;
            const formData = new FormData();
            formData.append('vid', this.$route.params.vid);
            formData.append('status', vstatus);
            const res = await this.$post('/video/change/status', formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("teri_token"),
                }
            });
            if (!res.data) {
                ElMessage.error("特丽丽被玩坏了(¯﹃¯)");
                this.$store.state.isLoading = false;
            }
            if (res.data.code === 200) {
                if (vstatus === 3) {
                    this.$router.push('/review/video/form');
                    this.$store.state.isLoading = false;
                } else {
                    await this.getVideoDetail();
                    this.$store.state.isLoading = false;
                }                
            } else {
                this.$store.state.isLoading = false;
            }
        },

        // 事件
        // 窗口大小改变时更新 player 的高度
        updatePlayerHeight() {
            const playerElement = document.getElementById('player');
            const playerWidth = playerElement.offsetWidth;
            const playerHeight = playerWidth * (9 / 16);
            playerElement.style.height = `${playerHeight}px`;
        },

        // 判断是否窗
        // 判断是否小窗
        changeWidth() {
            if (window.innerWidth < 480) {
                this.isMiniWidth = true;
            } else {
                this.isMiniWidth = false;
            }
        },

        // 将文本中的链接格式化成超链接
        formatText(text) {
            return linkify(text);
        },

        // 取消上传前的最后通牒
        beforeDelete() {
            ElMessageBox.confirm(
                '该操作会删除视频源文件，无法复原，确定删除吗？',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.updateVideoStatus(3);
            })
            .catch(() => {})
        },
    },
    async created() {
        this.changeWidth();
        await this.getVideoDetail();
    },
    mounted() {
        this.updatePlayerHeight();
        window.addEventListener('resize', this.updatePlayerHeight);
        window.addEventListener('resize', this.changeWidth);
    },
    unmounted() {
        window.removeEventListener('resize', this.updatePlayerHeight);
        window.removeEventListener('resize', this.changeWidth);
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

.left {
    width: 66%;
    max-width: 672px;
}

.player {
    box-shadow: 2px 2px 10px #0000003f;
    background-color: black;
    width: 100%;
}

.player video {
    width: 100%;
    height: 100%;
}

.options {
    margin-top: 16px;
}

.options-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 0 16px;
}

.status {
    display: flex;
    align-items: center;
}

.status .iconfont {
    font-size: 12px;
    margin-right: 5px;
}

.icon-shenhezhong {
    color: var(--pay_yellow);
}

.icon-wancheng {
    color: var(--success_green);
}

.icon-shibai {
    color: var(--stress_red);
}

.options-item {
    padding: 0 10px;
}

.detail {
    flex: 1;
    margin: 0 0 0 16px;
    min-width: 400px;
    color: var(--text2);
}

.detail-card {
    padding: 0 16px 30px 20px;
}

.detail-item {
    display: flex;
    margin-top: 20px;
    min-height: 25px;
}

.item-title {
    flex: 0 0 auto;
    width: 70px;
    color: var(--text1);
    font-size: 16px;
    font-weight: 600;
}

.item-content {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
}

.type {
    flex: 0 0 auto;
    width: 45px;
}

.icon-jinzhi {
    font-size: 14px;
    color: var(--stress_red);
    margin-right: 4px;
}

.tag-container {
    text-align: center;
    padding: 0 12px;
    margin: 0px 12px 12px 0;
    height: 25px;
    border-radius: 14px;
    background: #f1f2f3;
    font-size: 12px;
    line-height: 25px;
    border: none;
}

.descr {
    width: 100%;
    padding: 10px;
    background-color: #fafafa;
    border: 1px solid #eee;
    border-radius: 8px;
}

@media (max-width: 700px) {
    .video-detail__layout {
        flex-direction: column;
    }

    .left {
        width: auto;
    }

    .detail {
        margin: 16px 0 0 0;
        min-width: auto;
    }
    
    .item-title {
        width: 50px;
    }
}

@media (min-width: 700.1px) and (max-width: 800px) {
    .detail {
        min-width: 300px;
    }

    .item-title {
        width: 50px;
    }
}
</style>