// src/utils/timeUtils.js
export function getTimer(stringTime) {
    const now = new Date();
    let inputDate = new Date(stringTime);

    if (isNaN(inputDate.getTime())) {
        console.error("无效的时间格式！");
        return;
    }

    const diff = now.getTime() - inputDate.getTime();

    if (diff < 0) {
        console.error("设置的时间不能早于当前时间！");
        return;
    }

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const monthApprox = day * 30; // 注意，这里只是近似值

    let result = null;
    if (diff >= monthApprox) {
        result = Math.floor(diff / monthApprox) + "月前";
    } else if (diff >= week) {
        result = Math.floor(diff / week) + "周前";
    } else if (diff >= day) {
        result = Math.floor(diff / day) + "天前";
    } else if (diff >= hour) {
        result = Math.floor(diff / hour) + "小时前";
    } else if (diff >= minute) {
        result = Math.floor(diff / minute) + "分钟前";
    } else {
        result = "刚刚";
    }

    return result;
}