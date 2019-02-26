
const api = "https://free-api.heweather.net/s6";
const apiAir ="https://api.heweather.net/s6"
const wxRequest = (params, method = 'GET', url, header = {}) => {
  wx.request({
    url,
    method,
    header: {
      'Content-Type': 'application/json',
      ...header,
    },
    success: res => {
      params.success && params.success(res)
    },
    fail: res => {
      
      console.log("网络异常，请稍候重试!") 
      
      params.fail && params.fail(res)
    },
    complete: res => {
      params.loading && wx.hideLoading();
      params.complete && params.complete(res)
    }
  })
}

module.exports = {
  
  wether: (params) => wxRequest(params, 'GET', `${api}/weather?location=${params.data.location}&key=${params.data.key}`),
  air: (params) => wxRequest(params, 'GET', `${api}/air/now?location=${params.data.location}&key=${params.data.key}`),
}