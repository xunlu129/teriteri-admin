<template>
    <div>
        视频审核
    </div>
</template>

<script>
export default {
    name: "VideoReview",
    data() {
        return {
            videos: [],
        }
    },
    methods: {
        async getUnderReviewVideos() {
            const res = await this.$get('/review/video/getall', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("teri_token"),
                },
            });
            if (res.data.data) {
                this.videos = res.data.data;
            } else {
                this.videos = [];
            }
        }
    },
    async created() {
        await this.getUnderReviewVideos();
        console.log("待审核视频列表: ",  this.videos);
    }
}
</script>

<style scoped>

</style>