Component({
  data: {
    index: 0,
    isShowModal: true,
    chooseRobot: ''
  },
  properties: {
    robotGroupsList: {
      type: Array,
      observer: function (newVal, oldVal, changedPath) {
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        if (newVal[this.data.index] && newVal[this.data.index].chat_id) {
          this.setData({
            chooseRobot: newVal[this.data.index].chat_id
          })
        }
      }
    }
  },
  methods: {
    chooseGroupChange: function (e) {
      console.log('chooseGroupChange', e.detail.value)
      const chooseRobot = this.data.robotGroupsList[e.detail.value].chat_id
      this.setData({
        chooseRobot
      })
    },
    chooseGroupCancel: function (e) {
      console.log('chooseGroupCancel', e)
    },
    handleModalEvent: function () {
      console.log('获取选择的机器人ID', this.data.chooseRobot)
      this.setData({
        isShowModal: false
      })
      this.triggerEvent('myevent', {
        chooseRobot: this.data.chooseRobot
      })
    }
  },
  onReady: function () {}
})
