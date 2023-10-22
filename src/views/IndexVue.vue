<template>
    <div class="index">
        <header class="admin-header" :style="`transform: translateX(${left}px); width: calc(100% - ${left}px);`">
            <div class="menu-btn" @click="changeAsideStatus">
                <el-icon size="24"><Expand v-if="asideStatus == 0" /><Fold v-else /></el-icon>
            </div>
            <div class="avatar">
                <img :src="user.avatar_url" :alt="`${user.nickname}的头像`">
            </div>
        </header>
        <aside
            class="admin-aside"
            :style="asideStatus == 0 ? `transform: translateX(-110%); transition: transform 0.3s;`
                    : asideStatus == 1 ? `transform: translateX(0%); transition: transform 0.3s;`
                    : `transform: translateX(${asideOffsetX}px);`"
        >

        </aside>
        <div class="masking" @click="changeAsideStatus"
            :style="asideStatus == 0 ? `display: ${maskingDisplay}; opacity: 0; transition: opacity 0.3s;`
                    : asideStatus == 1 && isMiniWidth ? `display: ${maskingDisplay}; opacity: 1; transition: opacity 0.3s;`
                    : asideStatus == 1 && !isMiniWidth ? `display: ${maskingDisplay}; opacity: 0; transition: opacity 0.3s;`
                    : `display: ${maskingDisplay}; opacity: ${maskingOpacity};`"
        ></div>
        <main class="admin-main" :style="`padding-left: ${left}px;`">
            内容
        </main>
    </div>
</template>

<script>
let hideTimer;

export default {
    name: "IndexVue",
    data() {
        return {
            // 默认是大窗数值
            left: 256,  // 左边侧栏展开时宽度
            isMiniWidth: false, // 是否窄窗宽
            asideStatus: 1, // 0关闭 1打开 2移动中
            asideOffsetX: 0,    // 移动偏移量 -256~0
            // 蒙版的显隐
            maskingDisplay: "none",
            maskingOpacity: 0,
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        initSlide() {
            let direct = 0; // 0未定方向 1上下 2左右
            let startX, startY, currentX, currentY, offsetX, offsetY, lastX;
            this.touchStartHandler = (e) => {
                if (this.asideStatus != 1) return;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                lastX = e.touches[0].clientX;
            }
            this.touchMoveHandler = (e) => {
                if (this.asideStatus == 0 || direct == 1) return;
                if (currentX != null) lastX = currentX;
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
                offsetX = Math.abs(currentX - startX);
                offsetY = Math.abs(currentY - startY);
                if (direct != 2 && offsetY >= 5) {
                    direct = 1;
                    // console.log("纵向滑动");
                    return;
                }
                if (offsetX >= 5) {
                    direct = 2;
                    this.asideStatus = 2;
                    // console.log("横向滑动");
                    e.preventDefault();
                }
                if (direct == 2) {
                    this.asideOffsetX += currentX - lastX;
                    this.asideOffsetX = Math.min(0, this.asideOffsetX);
                    this.asideOffsetX = Math.max(-256, this.asideOffsetX);
                    this.maskingOpacity = 1 - (this.asideOffsetX / (-256));
                }
            }
            this.touchEndHandler = () => {
                if (direct == 2 && currentX - lastX > 0) {
                    // 打开
                    this.asideStatus = 1;
                    this.asideOffsetX = 0;
                    this.maskingOpacity = 1;
                    this.show();
                } else if (direct == 2 && currentX - lastX <= 0) {
                    // 关闭
                    this.asideStatus = 0;
                    this.asideOffsetX = -256;
                    this.maskingOpacity = 0;
                    this.hide();
                }
                direct = 0;
                currentX = null;
            }
            document.addEventListener('touchstart', this.touchStartHandler);
            document.addEventListener('touchmove', this.touchMoveHandler, {passive: false});
            document.addEventListener('touchend', this.touchEndHandler);
        },

        // 蒙版的显隐
        show() {
            this.maskingDisplay = "";
        },
        hide() {
            hideTimer = setTimeout(() => {
                this.maskingDisplay = "none";
            }, 300);
        },

        // 打开或关闭侧栏
        changeAsideStatus() {
            if (this.asideStatus == 0) {
                // 打开菜单栏
                this.asideStatus = 1;
                if (!this.isMiniWidth) {
                    this.left = 256;
                } else {
                    clearTimeout(hideTimer);    // 清除计时器，防抖
                    this.asideOffsetX = 0;
                    this.maskingOpacity = 1;
                    this.show();
                }
            } else if (this.asideStatus == 1) {
                // 关闭菜单栏
                this.asideStatus = 0;
                if (!this.isMiniWidth) {
                    this.left = 0;
                } else {
                    this.asideOffsetX = -256;
                    this.maskingOpacity = 0;
                    this.hide();
                }
            }
        },

        // 判断是否小窗
        changeWidth() {
            if (window.innerWidth < 1265) {
                this.isMiniWidth = true;
            } else {
                this.isMiniWidth = false;
            }
        }
    },
    created() {
        // 初始化数据，如果是小窗的话
        if (window.innerWidth < 1265) {
            this.isMiniWidth = true;
            this.left = 0;
            this.asideStatus = 0;
            this.asideOffsetX = -256;
        }
    },
    mounted() {
        this.initSlide();
        // 监听窗口大小变化，判断是否小窗
        window.addEventListener('resize', this.changeWidth);
    },
    unmounted() {
        document.removeEventListener('touchstart', this.touchStartHandler);
        document.removeEventListener('touchmove', this.touchMoveHandler, { passive: false });
        document.removeEventListener('touchend', this.touchEndHandler);
        window.removeEventListener('resize', this.changeWidth);
    },
    watch: {
        "isMiniWidth"(current, last) {
            if (current && !last && this.asideStatus == 1) {
                // 从大屏转小屏并且菜单栏正在打开中，就关闭菜单栏和蒙版
                this.left = 0;
                this.asideStatus = 0;
                this.asideOffsetX = -256;
                this.maskingOpacity = 0;
                this.hide();
            } else if (!current && last && this.asideStatus == 1) {
                // 从小屏转大屏并且菜单栏正在打开中，就关闭蒙版
                this.left = 256;
                this.maskingOpacity = 0;
                this.hide();
            }
        }
    }
}
</script>

<style scoped>
.index {
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    max-width: 100%;
    min-height: 100dvh;
    position: relative;
}

.admin-header {
    position: fixed;
    top: 0px;
    z-index: 1005;
    height: 64px;
    background-color: #fff;
    box-shadow: 0 2px 30px -1px #55555514, 0 4px 30px #5555550f, 0 1px 30px #55555508;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    color: var(--text1);
    transition: width 0.3s, transform 0.3s;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.menu-btn {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--text2);
    cursor: pointer;
}

.menu-btn:hover {
    background-color: var(--graph_bg_thin);
}

.avatar {
    height: 40px;
    width: 40px;
    margin: 0 8px;
    border-radius: 50%;
    cursor: pointer;
}

.avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.admin-aside {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1008;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 2px 10px -1px #55555514,0 1px 10px #5555550f,0 1px 30px #55555508;
    width: 256px;
}

.masking {
    position: absolute;
    z-index: 1007;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.3);
}

.admin-main {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    max-width: 100%;
    padding-top: 64px;
    transition: padding-left 0.3s;
    background-color: #fafafa;
}
</style>