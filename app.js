App({
  onLaunch: function () {
    // 获取tenant_access_token
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
        // this.getUserRobotList(tenantAccessToken)
      },
      fail(res) {
        console.log(`request 调用失败`)
      }
    })
  }
})
