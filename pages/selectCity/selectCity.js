// pages/selectCity/selectCity.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'BJCBZ-3PCLQ-Q2T5P-GVDGY-TZWFF-CVFAH' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList:true,
    nowcity:'获取失败',
    province:'',
    city:'',
    district:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(app.city)
    this.setData({
      nowcity: app.city
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  cityInput:function(e){
    this.nearby_search(e.detail.value)
  },
  nearby_search: function(address) {
      var _this = this;
      // 调用接口
    qqmapsdk.getSuggestion({
        keyword: address,  //搜索关键词
        // location: '39.980014,116.313972',  //设置周边搜索中心点
        success: function (res) { //搜索成功后的回调
        console.log(res.data[0].province)
        console.log(res.data[0].city)
        console.log(res.data[0].district)
        console.log(res)
        _this.setData({
          province: res.data[0].province,
          city:res.data[0].city,
        })
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    }
})