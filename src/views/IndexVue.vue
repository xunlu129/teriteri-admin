<template>
    <div class="index">
        <header class="admin-header" :style="`transform: translateX(${left}px); width: calc(100% - ${left}px);`">
            <div class="menu-btn" @click="changeAsideStatus">
                <el-icon size="24"><Expand v-if="asideStatus == 0" /><Fold v-else /></el-icon>
            </div>
            <VPopover class="avatar-wrapper" trigger="click" pop-style="padding-top: 20px; transform: translateX(calc(-100% + 20px));">
                <template #reference>
                    <div class="avatar">
                        <img :src="user.avatar_url" :alt="`${user.nickname}的头像`">
                    </div>
                </template>
                <template #content>
                    <div class="v-pop">
                        <div class="v-pop-top">
                            <div class="v-pop-top-content" @click="noPage">
                                <div class="user-avatar">
                                    <img :src="user.avatar_url" :alt="`${user.nickname}的头像`">
                                </div>
                                <div class="user-text">
                                    <div class="nickname">{{ user.nickname }}</div>
                                    <div class="description">{{ user.description }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="v-pop-middle">
                            <div class="v-pop-item" @click="noPage">
                                <i class="iconfont icon-zhanghu"></i>
                                <span>个人账户</span>
                            </div>
                            <div class="v-pop-item" @click="noPage">
                                <i class="iconfont icon-richeng"></i>
                                <span>日程安排</span>
                            </div>
                            <div class="v-pop-item" @click="noPage">
                                <i class="iconfont icon-tuandui"></i>
                                <span>部门团队</span>
                            </div>
                            <div class="v-pop-item" @click="noPage">
                                <i class="iconfont icon-bangzhu"></i>
                                <span>帮助中心</span>
                            </div>
                        </div>
                        <div class="v-pop-bottom">
                            <div class="v-pop-item" @click="logout">
                                <i class="iconfont icon-dengchu"></i>
                                <span>退出登录</span>
                            </div>
                        </div>
                    </div>
                </template>
            </VPopover>            
        </header>
        <aside
            class="admin-aside"
            :style="asideStatus == 0 ? `transform: translateX(-110%); transition: transform 0.3s;`
                    : asideStatus == 1 ? `transform: translateX(0%); transition: transform 0.3s;`
                    : `transform: translateX(${asideOffsetX}px);`"
        >
            <div class="aside-top">
                <a class="logo" href="http://localhost:8787" target="_blank">
                    <img src="~assets/img/teriteri-pink.png" alt="">
                </a>
            </div>
            <div class="aside-middle">
                <el-menu :default-openeds="defOpenMenu" :default-active="active" class="nav-menu" router="true">
                    <el-menu-item index="/home">
                        <i class="iconfont icon-shouye1"></i>
                        <span>首页</span>
                    </el-menu-item>
                    <el-menu-item index="/data">
                        <i class="iconfont icon-shujuzhongxin"></i>
                        <span>数据中心</span>
                    </el-menu-item>
                    <el-sub-menu index="/content">
                        <template #title>
                            <i class="iconfont icon-caidan"></i>
                            <span>内容管理</span>
                        </template>
                        <el-menu-item index="/content/carousel">
                            <i class="iconfont icon-lunbotu"></i>
                            <span>轮播图管理</span>
                        </el-menu-item>
                        <el-menu-item index="/content/hot-search">
                            <i class="iconfont icon-resou"></i>
                            <span>热搜管理</span>
                        </el-menu-item>
                        <el-menu-item index="/content/ranking">
                            <i class="iconfont icon-paihang"></i>
                            <span>排行管理</span>
                        </el-menu-item>
                        <el-menu-item index="/content/tag">
                            <i class="iconfont icon-biaoqian"></i>
                            <span>标签管理</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="/review">
                        <template #title>
                            <i class="iconfont icon-caidan"></i>
                            <span>审核管理</span>
                        </template>
                        <el-menu-item index="/review/video">
                            <i class="iconfont icon-shipinshenhe"></i>
                            <span>视频审核</span>
                        </el-menu-item>
                        <el-menu-item index="/review/article">
                            <i class="iconfont icon-wenzhang"></i>
                            <span>文章审核</span>
                        </el-menu-item>
                        <el-menu-item index="/review/avatar">
                            <i class="iconfont icon-touxiang"></i>
                            <span>头像审核</span>
                        </el-menu-item>
                        <el-menu-item index="/review/dynamic">
                            <i class="iconfont icon-dongtai"></i>
                            <span>动态审核</span>
                        </el-menu-item>
                        <el-menu-item index="/review/comment">
                            <i class="iconfont icon-pinglun"></i>
                            <span>评论审核</span>
                        </el-menu-item>
                        <el-menu-item index="/review/danmu">
                            <i class="iconfont icon-danmu"></i>
                            <span>弹幕审核</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="/case">
                        <template #title>
                            <i class="iconfont icon-caidan"></i>
                            <span>举报申诉</span>
                        </template>
                        <el-menu-item index="/case/report">
                            <i class="iconfont icon-jubao"></i>
                            <span>举报受理</span>
                        </el-menu-item>
                        <el-menu-item index="/case/appeal">
                            <i class="iconfont icon-shensu"></i>
                            <span>申诉受理</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="/system">
                        <template #title>
                            <i class="iconfont icon-caidan"></i>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item index="/system/user">
                            <i class="iconfont icon-yonghuguanli"></i>
                            <span>用户管理</span>
                        </el-menu-item>
                        <el-menu-item index="/system/role">
                            <i class="iconfont icon-guanliyuan"></i>
                            <span>角色管理(超管专属)</span>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>
            <div class="aside-bottom">

            </div>
        </aside>
        <div class="masking" @click="changeAsideStatus"
            :style="asideStatus == 0 ? `display: ${maskingDisplay}; opacity: 0; transition: opacity 0.3s;`
                    : asideStatus == 1 && isMiniWidth ? `display: ${maskingDisplay}; opacity: 1; transition: opacity 0.3s;`
                    : asideStatus == 1 && !isMiniWidth ? `display: ${maskingDisplay}; opacity: 0; transition: opacity 0.3s;`
                    : `display: ${maskingDisplay}; opacity: ${maskingOpacity};`"
        ></div>
        <main class="admin-main" :style="`padding-left: ${left}px;`">
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
let hideTimer;
import VPopover from '@/components/popover/VPopover.vue';
import { ElMessage } from 'element-plus';

export default {
    name: "IndexVue",
    components: {
        VPopover,
    },
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
            active: "", // 侧栏活动项
            path: ["/home", "/data", "/content/carousel", "/content/hot-search", "/content/ranking", "/review/video",
            "/review/article", "/review/avatar", "/review/dynamic", "/review/comment", "/review/danmu", "/case/report",
            "/case/appeal", "/system/role", "/system/user"],   // 用于判断当前活动页
            defOpenMenu: ["/content", "/review", "/case", "/system"],    // 默认展开的子菜单
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
        },

        // 退出登录
        logout() {
            this.$store.dispatch("logout");
        },

        noPage() {
            ElMessage.warning("该功能暂未开放");
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
        for (let i = 0; i < this.path.length; i++) {
            if (this.$route.path.startsWith(this.path[i])) {
                this.active = this.path[i].slice();
                break;
            }
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

.avatar-wrapper {
    border-radius: 50%;
    margin: 0 8px;
}

.avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    cursor: pointer;
}

.avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.v-pop {
    position: relative;
    width: 230px;
}

.v-pop-top, .v-pop-middle {
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
}

.v-pop-bottom {
    padding: 8px 0;
}

.v-pop-top-content {
    display: flex;
    align-items: center;
    height: 80px;
    cursor: pointer;
    padding: 0 12px 0 16px;
}

.v-pop-top-content:hover {
    background-color: var(--graph_bg_regular);
}

.user-avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    flex: 0 0 auto;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.user-text {
    align-self: center;
    overflow: hidden;
    margin-left: 16px;
}

.nickname {
    color: var(--text1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    line-height: 1.5rem;
    font-weight: 600;
}

.description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text3);
    font-size: 12px;
    line-height: 1.5rem;
}

.v-pop-item {
    height: 38px;
    cursor: pointer;
    color: var(--text2);
    padding: 0 18px;
    display: flex;
    align-items: center;
}

.v-pop-item:hover {
    color: var(--text1);
    background-color: var(--graph_bg_regular);
}

.v-pop-item .iconfont {
    color: var(--text1);
    line-height: 38px;
    margin-right: 18px;
}

.v-pop-item span {
    line-height: 38px;
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
    display: flex;
    flex-direction: column;
}

.aside-top {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 20px -20px #55555514, 0 20px 30px -20px #5555550f, 0 10px 30px -30px #55555508;
    z-index: 2000;
    flex: 1 0 auto;
}

.logo {
    width: 200px;
    cursor: pointer;
}

.logo img {
    width: 100%;
}

.aside-middle {
    flex: 0 1 auto;
    height: 100%;
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 16px 8px;
}

.aside-middle::-webkit-scrollbar {
    width: 4px;
}

.aside-middle::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #ddd;
}

.el-menu-item .iconfont, .el-sub-menu .iconfont {
    font-size: 20px;
    margin-right: 20px;
}

.el-menu-item:not(.is-active) .iconfont {
    color: var(--text2);
}

.masking {
    position: fixed;
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

/* element 导航元素 */
.el-menu {
    border-right: unset !important;
}

.aside-middle {
    --el-menu-active-color: var(--brand_pink);
    --el-menu-level-padding: 40px;
    --el-menu-item-height: 50px;
}

.aside-middle /deep/ .el-sub-menu__title, .el-menu-item {
    height: var(--el-menu-item-height);
    border-radius: 8px;
    margin-bottom: 8px;
}

.el-menu-item.is-active {
    background-color: var(--graph_bg_regular) !important;
}

.aside-middle /deep/ .el-sub-menu__title:hover, .el-menu-item:hover {
    background-color: var(--graph_bg_thin) !important;
}
</style>