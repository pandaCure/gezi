Page({
  data: {
    yesterdayFinishedWorkArray: [0],
    yesterdayFormData: [],
    robotGroupsList: [],
    chooseGroupRobotId: '',
    tbTaskList: [],
    username: '',
    taskTipRadioItems: [
      {
        value: 1,
        name: '需要'
      },
      {
        value: 0,
        name: '不需要'
      }
    ],
    currentTaskTip: 0
  },
  createYesterdayEvent: function () {
    const index = this.data.yesterdayFinishedWorkArray.length
    this.data.yesterdayFinishedWorkArray.push(index)
    this.setData({
      yesterdayFinishedWorkArray: [...this.data.yesterdayFinishedWorkArray]
    })
  },
  submit: function () {
    const params = {
      robotId: this.data.chooseGroupRobotId,
      result: this.data.yesterdayFormData,
      username: this.data.username,
      currentTaskTip: this.data.currentTaskTip
    }
    tt.request({
      url: `https://teambition-task.yc345.tv/message/card/${this.data.chooseGroupRobotId}`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        ...params
      },
      success(res) {
        console.log('机器人 上传成功')
      },
      fail(res) {
        console.log(`机器人 调用失败`)
      }
    })
  },
  onFormEvent: function (e) {
    this.data.yesterdayFormData[e.detail.taskIndex] = {
      ...e.detail.task[e.detail.yesterdayPickerChooseIndex],
      ...e.detail.task.common,
      taskStatus: Number(e.detail.yesterdayPickerChooseIndex)
    }
    this.setData({
      yesterdayFormData: [...this.data.yesterdayFormData]
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
    tt.request({
      url: 'https://open.feishu.cn/open-apis/chat/v4/list',
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${tenantAccessToken}`
      },
      success(res) {
        that.setData({
          robotGroupsList: res.data.data.groups
        })
      },
      fail(res) {
        console.log(`request 调用失败`)
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
        that.setData({
          username: res.data.data.user_infos[0].name
        })
        that.getTaskInfo(email)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  },
  getTaskInfo: function (email) {
    const that = this
    tt.request({
      url: `https://teambition-task.yc345.tv/teambition/task/${email}`,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        const tbTaskList = res.data.result
        that.setData({
          tbTaskList
        })
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  },
  handleModalRobotId: function (e) {
    this.setData({
      chooseGroupRobotId: e.detail.chooseRobot
    })
  },
  onTaskTipEvent: function (e) {
    const currentTaskTip = e.detail.items.find((v) => v.checked)
    console.log(e)
    this.setData({
      currentTaskTip
    })
  }
})
