<template>
    <div :id="`map-container-${uniqueId}`" class="map-container"></div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { securityJsCode, key } from "./Configure";
import fire from "../../assets/alarm-icon/Fire.svg";
export default {
    name: "map-view",
    data() {
        return {
            map: null,
            uniqueId: null
        }
    },
    mounted() {
        this.uniqueId = Math.random().toString(36).substr(2, 9);
        this.initAMap();
    },
    unmounted() {
        if (this.map) this.map?.destroy();
    },
    methods: {
        initAMap() {
            window._AMapSecurityConfig = {
                securityJsCode: securityJsCode,
            };
            AMapLoader.load({
                key: key, // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: ['AMap.Scale'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
            })
                .then((AMap) => {
                    this.map = new AMap.Map(`map-container-${this.uniqueId}`, {
                        viewMode: '3D',
                        turboMode: false,
                        showIndoorMap: false,
                        defaultCursor: 'pointer',
                        showBuildingBlock: true,
                        zooms: [10, 25],
                        showLabel: true,
                        zoom: 18,
                        // pitch: 55,
                        // rotation: -45,
                        center: [this.Longitude, this.Latitude], // 初始化地图中心点位置
                        forceVector: true,
                    });
                    var marker = new AMap.Marker({
                        position: this.map.getCenter(),
                        icon: fire,
                        anchor: 'bottom-center',
                        offset: new AMap.Pixel(0, 0)
                    });

                    marker.setMap(this.map);

                    // 设置鼠标划过点标记显示的文字提示
                    marker.setTitle(this.root);

                    // 设置label标签
                    // label默认蓝框白底左上角显示，样式className为：amap-marker-label
                    marker.setLabel({
                        direction: 'right',
                        offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
                        content: `<div class="info" style="boder=none; font-size: 12px; background-color: #fff; color: #000; padding: 5px; border-radius: 3px; box-shadow: 0 0 5px #ccc;">${this.root}</div>`, //设置文本标注内容
                    });
                })
                .catch((e) => {
                    console.log("map-error", e);
                });
        }
    },
    props: ['Longitude', 'Latitude', 'root']
};
</script>
<style scoped>
.map-container {
    width: 100%;
    height: 100%;
}



.map-container>>>.amap-marker-label {
    border: none;
    background: transparent;
}
</style>
