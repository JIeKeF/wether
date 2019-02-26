//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
import {
  wether, air
} from '../../utils/confing.js'
Page({
  data: {
    city: '',
    now: {},
    tomorrow: {},
    today: {},
    todayImg: '',
    tomorrowImg: '',
    hourly: [],
    daily_forecast:[],
    drsg:{},
    flu:{},
    sport:{},
    trav:{},
    cw:{},
    comf:{},
    aqi:'',
    qlty:'',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // onLoad: function() {

  // },
  onLoad: function() {
    var _this = this;
    //调用定位方法
    _this.getUserLocation();
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    if (app.globalData.defaultCity){
      console.log(app)
      const data={
        location: `${app.globalData.defaultCounty},${app.globalData.defaultCity.split('市')[0]}`,
        key: "8d73ff5f14304b65ac9d5907436478c7"
      }
      const date={
        location: `${app.globalData.defaultCity.split('市')[0]}`,
        key: "8d73ff5f14304b65ac9d5907436478c7"
      }
       this.getWether(data)
       this.getair(date)
       this.setData({
         city: `${app.globalData.defaultCity}${app.globalData.defaultCounty}`
       })
    }
  },
  //定位方法
  getUserLocation: function() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        console.log(res)
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    console.log(1)
                    console.log(res)
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.geo();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.geo();
        } else {
          // console.log('授权成功')
          //调用wx.getLocation的API
          _this.geo();
        }
      }
    })

  },
  addUrl: function(arr, num) {
    if (num == 1) {
      arr.forEach(item => {
        if (item.cond_code) {
          item.cond_code = `../image/${item.cond_code}.png`;
          item.time = item.time.split(" ")[1]
        }
      })
      this.setData({
        hourly: arr
      })
    }else{
      arr.forEach(item => {
        if (item.cond_code_n) {
          item.cond_code_n = `../image/${item.cond_code_n}.png`;
          item.date = `${item.date.split("-")[1]} / ${item.date.split("-")[2]}`
        }
      })
      this.setData({
        daily_forecast: arr
      })
    }


  },
  // 获取定位城市
  geo: function() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        // 引入SDK核心类

        // 实例化API核心类
        var qqmapsdk = new QQMapWX({
          key: 'BJCBZ-3PCLQ-Q2T5P-GVDGY-TZWFF-CVFAH' // 必填
        });
        qqmapsdk.reverseGeocoder({
          //位置坐标，默认获取当前位置，非必须参数
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) { //成功后的回调
            console.log(res.result.address_component.city);
            _this.setData({
              city: res.result.address_component.city
            })
            const data = {
              location: res.result.address_component.city,
              key: "8d73ff5f14304b65ac9d5907436478c7"
            }
            _this.getWether(data)
            _this.getair(data)
            app.city = res.result.address_component.city
          },
          fail: function(error) {
            console.error(error);
          },
          complete: function(res) {
            console.log(res);
          }
        })
      }
    })
  },
  getWether:function(data){
    let _this = this;
    wether({
      data,
      success: res => {
        console.log(res)
        _this.setData({
          now: res.data.HeWeather6[0].now,
          tomorrow: res.data.HeWeather6[0].daily_forecast[1],
          today: res.data.HeWeather6[0].daily_forecast[0],
          todayImg: `../image/${res.data.HeWeather6[0].now.cond_code}.png`,
          tomorrowImg: `../image/${res.data.HeWeather6[0].daily_forecast[1].cond_code_n}.png`,
          comf: res.data.HeWeather6[0].lifestyle[0],
          drsg: res.data.HeWeather6[0].lifestyle[1],
          flu: res.data.HeWeather6[0].lifestyle[2],
          sport: res.data.HeWeather6[0].lifestyle[3],
          trav: res.data.HeWeather6[0].lifestyle[4],
          cw: res.data.HeWeather6[0].lifestyle[6],
        })
        _this.addUrl(res.data.HeWeather6[0].hourly, 1)
        _this.addUrl(res.data.HeWeather6[0].daily_forecast, 2)
      }
    })
  },
  getair:function(data){
    air({
      data,
      success:res=>{
        this.setData({
          qlty:res.data.HeWeather6[0].air_now_city.qlty,
          aqi: res.data.HeWeather6[0].air_now_city.aqi,
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})