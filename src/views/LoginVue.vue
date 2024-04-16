<template>
    <div class="login">
        <vue-particles id="tsparticles" :particlesInit="particlesInit" :options="options" />
        <div class="login-wrapper">
            <div class="login-header" :style="isMiniWidth ? `transform: scale(${zoom});` : ''">
                <h2>Administrator</h2>
            </div>
            <div class="login-container">
                <div class="form-box">
                    <div class="input-box">
                        <i class="iconfont icon-zhanghao"></i>
                        <input type="text" v-model="username">
                        <label :class="username.length != 0 ? 'label-up' : ''">账号</label>
                    </div>
                    <div class="input-box">
                        <i class="iconfont icon-mima"></i>
                        <input type="password" v-model="password">
                        <label :class="password.length != 0 ? 'label-up' : ''">密码</label>
                    </div>
                    <el-button class="login-btn" @click="login" color="#224560" :dark="isDark" plain>登录</el-button>
                    <div class="tips">
                        不是管理员？<a href="http://localhost:8787" target="_blank">主站</a>请走这边，如需权限请<a>联系管理员</a>申请
                    </div>
                </div>
            </div>
        </div>        
    </div>
</template>

<script>
import { loadFull } from "tsparticles";
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
    name: "LoginVue",
    data() {
        return {
            username: "",
            password: "",
            isMiniWidth: false, // 是否小窗
            zoom: 1,    // 小窗下，h2的缩放比例
            options: {
                background: {
                    image: "url(" + require('@/assets/img/login-bg.jpg') + ")",
                    position: "center", // 图像位置，可以根据需要调整
                    repeat: "no-repeat", // 图像不重复
                    size: "cover",
                },
                particles: {
                    number: {
                        value: 60,
                        density: {
                            enable: true,
                            value_area: 631.3280775270874
                        }
                    },
                    color: {
                        value: "#fff"
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        },
                        polygon: {
                            nb_sides: 5
                        },
                        image: {
                            src: "img/github.svg",
                            width: 100,
                            height: 100
                        }
                    },
                    opacity: {
                        value: 0.7,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 5,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: false,
                        distance: 500,
                        color: "#ffffff",
                        opacity: 0.4,
                        width: 2
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "bottom",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: false,
                            mode: "bubble"
                        },
                        onclick: {
                            enable: true,
                            mode: "repulse"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 0.5
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 4,
                            duration: 0.3,
                            opacity: 1,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            }
        }
    },
    methods: {
        // 初始化粒子特效
        particlesInit(engine) {
            return loadFull(engine);
        },
        // 登录
        async login() {
            if (this.username.length == 0) {
                ElMessage.error("请输入账号");
                return;
            }
            if (this.password.length == 0) {
                ElMessage.error("请输入密码");
                return;
            }
            this.$store.state.isLoading = true;
            // 这里为了更方便捕捉到错误后给出提示，就不使用封装的函数了
            const result = await axios.post("/api/admin/account/login", {
                username: this.username,
                password: this.password,
            }).catch(() => {
                ElMessage.error("用户名或密码错误");
                this.$store.state.isLoading = false;
            });
            if (!result) {
                this.$store.state.isLoading = false;
                return;
            }
            if (result.data.code !== 200) {
                ElMessage.error(result.data.message);
                this.$store.state.isLoading = false;
            }
            if (result.data.code === 200) {
                localStorage.setItem("teri_token", result.data.data.token); // 浏览器缓存token
                this.$store.commit("updateUser", result.data.data.user);    // 更新vuex中当前用户信息
                ElMessage.success(result.data.message);
                this.$store.commit("updateIsLogin", true);  // 修改在线状态
                this.$router.push("/"); // 跳转首页
                this.$store.state.isLoading = false;
            }
        },

        // 判断是否小窗
        changeWidth() {
            if (window.innerWidth < 444) {
                this.zoom = window.innerWidth * 0.9 / 400;
                this.isMiniWidth = true;
            } else {
                this.isMiniWidth = false;
            }
        },
    },
    mounted() {
        // 监听窗口大小变化，判断是否小窗
        window.addEventListener('resize', this.changeWidth);
    },
    unmounted() {
        window.removeEventListener('resize', this.changeWidth);
    }
}
</script>

<style scoped>
.login-wrapper {
    position: absolute;
    width: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(15px);
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5);
}

.login-header {
    position: relative;
}

.login-header h2 {
    position: absolute;
    top: -70px;
    left: 50%;
    font-weight: 600;
    transform: translateX(-50%);
    font-size: 3em;
    color: #fff;
    text-shadow: 0 10px 15px rgb(0, 0, 0);
}

.login-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-box {
    width: 100%;
    padding: 10px 40px 40px 40px;
}

.input-box {
    position: relative;
    width: 100%;
    height: 50px;
    border-bottom: 2px solid #162938;
    margin: 30px 0;
}

.input-box label {
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);
    font-size: 1em;
    color: #162938;
    pointer-events: none;
    transition: .5s;
}

.input-box input:focus~label, .label-up {
    top: -5px !important;
}

.input-box input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1em;
    color: #162938;
    font-weight: 600;
    padding: 0 35px 0 5px;
}

.input-box .iconfont {
    position: absolute;
    right: 0px;
    padding-right: 8px;
    font-size: 1.2em;
    color: #162938;
    line-height: 48px;
}

.login-btn {
    width: 100%;
    height: 45px;
    border-radius: 6px;
    font-size: 1.1em;
}

.tips {
    font-size: .9em;
    color: rgb(31, 61, 84);
    margin-top: 20px;
}

.tips a {
    cursor: pointer;
    color: var(--Pi6_u);
    text-decoration: none;
}

.tips a:hover {
    text-decoration: underline;
}

@media (max-width: 444px) {
    .form-box {
        padding: 10px 40px 20px 40px;
    }

    .login-wrapper {
        width: 90vw;
    }

    .input-box {
        margin: 18px 0;
        height: 40px;
    }
    
    .login-btn {
        height: 40px;
    }
}
</style>