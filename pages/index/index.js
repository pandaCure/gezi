Page({
  data: {
    yesterdayFinishedWorkArray: [0],
    yesterdayFormData: [],
    robotGroupsList: []
  },
  createYesterdayEvent: function () {
    const index = this.data.yesterdayFinishedWorkArray.length
    this.data.yesterdayFinishedWorkArray.push(index)
    this.setData({
      yesterdayFinishedWorkArray: this.data.yesterdayFinishedWorkArray
    })
  },
  submit: function () {
    console.log(this.data.yesterdayFormData)
  },
  onFormEvent: function (e) {
    const yesterdayFormData = []
    yesterdayFormData[e.detail.taskIndex] = e.detail.task
    this.setData({
      yesterdayFormData: yesterdayFormData
    })
  },
  onLoad: function () {
    // 获取tenant_access_token
    const that = this
    this.getAppAccessToken()
    // this.getUserRobotList()
  },
  getTenantAccessToken: function (openId) {
    const that = this
    tt.request({
      url:
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/',
      data: {
        app_id: 'cli_9fe7dbb70c2ed00c',
        app_secret: 'bpFGhz14WWnQNQcogjS97eQ6CCfz2BNZ'
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`request 调用成功 ${res}`)
        const tenantAccessToken = res.data.tenant_access_token
        that.getUserRobotList(tenantAccessToken)
        // that.getUserLogin(tenantAccessToken)
        that.getBatchEnforceUserInfo(openId, tenantAccessToken)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  },
  getAppAccessToken: function () {
    const that = this
    tt.request({
      url:
        'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal/',
      data: {
        app_id: 'cli_9fe7dbb70c2ed00c',
        app_secret: 'bpFGhz14WWnQNQcogjS97eQ6CCfz2BNZ'
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`获取 app_access_token`)
        const appAccessToken = res.data.app_access_token
        that.getUserLogin(appAccessToken)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  },
  getUserRobotList: function (tenantAccessToken) {
    const that = this
    // 获取用户token
    let task = tt.request({
      url: 'https://open.feishu.cn/open-apis/chat/v4/list',
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${tenantAccessToken}`
      },
      success(res) {
        console.log(`获取机器人群列表 调用成功 ${res}`)
        console.log(res)
        that.setData({
          robotGroupsList: res.data.data.groups
        })
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
    console.log(task)
  },
  getUserInfo: function () {
    tt.getUserInfo({
      success(res) {
        console.log(`getUserInfo 调用成功 ${res.userInfo}`)
        console.log(res)
      },
      fail(res) {
        console.log(res)
        console.log(`getUserInfo 调用失败`)
      }
    })
  },
  getUserLogin: function (tenantAccessToken) {
    const that = this
    tt.login({
      success(res) {
        console.log(`login 调用成功 ${res.code} `)
        console.log(res)
        // that.getUserInfo(tenantAccessToken, res.code)
        that.getTokenLoginValidate(tenantAccessToken, res.code)
      },
      fail(res) {
        console.log(`login 调用失败`)
      }
    })
  },
  authorizeWithGuide: function (params) {
    tt.getSetting({
      success(res) {
        let scopeValue = res.authSetting[params.scope]
        if (undefined === scopeValue || null === scopeValue || scopeValue) {
          params.success()
        } else {
          tt.showModal({
            content: params.guideTips,
            confirmText: '去设置',
            success(res) {
              if (res.confirm) {
                tt.openSetting({
                  success(res) {
                    if (res.authSetting[params.scope]) {
                      params.success()
                    } else {
                      params.fail()
                    }
                  }
                })
              } else {
                params.fail()
              }
            }
          })
        }
      }
    })
  },
  getEnforceUserInfo: function (tenantAccessToken, code) {
    console.log(tenantAccessToken)
    console.log(code)
    tt.request({
      url: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
      data: {
        user_access_token: tenantAccessToken,
        grant_type: 'authorization_code',
        code
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`-------> 来了老弟`)
        console.log(res)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  },
  getTokenLoginValidate: function (appAccessToken, code) {
    const that = this
    tt.request({
      url: 'https://open.feishu.cn/open-apis/mina/v2/tokenLoginValidate',
      data: {
        token: appAccessToken,
        code
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${appAccessToken}`
      },
      success(res) {
        console.log(`获取 getTokenLoginValidate userInfo`)
        console.log(res)
        const openId = res.data.data.employee_id
        that.getTenantAccessToken(openId)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  },
  getBatchEnforceUserInfo: function (openId, tenantAccessToken) {
    const that = this
    tt.request({
      url: `https://open.feishu.cn/open-apis/contact/v1/user/batch_get?employee_ids=${openId}`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${tenantAccessToken}`
      },
      success(res) {
        console.log(`获取 getBatchEnforceUserInfo userInfo`)
        console.log(res)
        const email = res.data.data.user_infos[0].email
        console.log(email)
        that.getTaskInfo(email)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  },
  getTaskInfo: function (email) {
    tt.request({
      url: `https://teambition-task.yc345.tv/teambition/task/${email}`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`获取 getBatchEnforceUserInfo userInfo`)
        console.log(res)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  }
})
