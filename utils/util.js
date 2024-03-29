const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
/**
 * 打开等待盖层
 */
const openloading = function openloading(that, e) {
  that.setData({
    loging: true
  });
  wx.showLoading({
    title: e,
  });
}
/**
 * 关闭等待盖层
 */
const closeloading = function closeloading(that) {
  that.setData({
    loging: false
  });
  wx.hideLoading();
}
/**
   * 提示文字
   */
const Opact = function Opact(txt) {
  wx.showToast({
    title: txt,
    mask: false,
    icon: "none",
    duration: 2000
  });
}
/**
 * 提示文字
 */
const alert = function alert(txt) {
  wx.showToast({
    title: txt,
    mask: false,
    icon: "none",
    duration: 2000
  });
}
// 暴露出去
module.exports = {
  Opact: Opact,
  alert: alert
}
/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
function formatRichText(html){
  let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
      match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
      match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
      return match;
  });
  // newContent = newContent.replace(/<br[^>]*\/>/gi, '');
  newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"');
  return newContent;
}


// 模块出口
module.exports = {
  formatRichText,
};