Component({
  properties: {
    taskIndex: Number
  },
  data: {
    yesterdayPickerArray: ['未开始', '进行中', '已完成', 'delay'],
    yesterdayPickerChooseIndex: 0,
    yesterdayCaseRadioItems: [
      {
        value: 1,
        name: '需要'
      },
      {
        value: 0,
        name: '不需要'
      }
    ],
    delayWarnItems: [
      {
        value: 1,
        name: '有'
      },
      {
        value: 0,
        name: '没有'
      }
    ],
    showcaseShowBlock: false,
    showcasePeopleBlock: false,
    delayReasonBlock: false,
    delayWarnBlock: false,
    delayWarnReasonBlock: false,
    needHelpBlock: false, // 1 -> 约人
    task: {
      common: {
        workName: ''
      },
      0: {},
      1: {
        delayWarn: 0, // 是否有delay风险
        needHelp: 0, // 是否需要人员协调
        delayWarnReason: '' // delay风险原因
      },
      2: {
        showcaseStatus: 0, // 是否需要showcase
        showcasePeople: '' // showcase相关人员
      },
      3: {
        delayReason: '' // delay原因
      }
    }
  },
  methods: {
    yesterdayPickerChange(e) {
      if (e.detail.value === '2') {
        this.setData({
          showcaseShowBlock: true,
          delayWarnBlock: false,
          needHelpBlock: false,
          delayReasonBlock: false,
          needHelpBlock: false,
          delayWarnReasonBlock: false
        })
      } else if (e.detail.value === '1') {
        this.setData({
          showcaseShowBlock: false,
          delayWarnBlock: true,
          needHelpBlock: true,
          delayReasonBlock: false,
          showcasePeopleBlock: false
        })
      } else if (e.detail.value === '3') {
        this.setData({
          showcaseShowBlock: false,
          delayWarnBlock: false,
          needHelpBlock: false,
          delayReasonBlock: true,
          needHelpBlock: false,
          showcasePeopleBlock: false,
          delayWarnReasonBlock: false
        })
      } else {
        this.setData({
          showcaseShowBlock: false,
          delayWarnBlock: false,
          needHelpBlock: false,
          delayReasonBlock: false,
          needHelpBlock: false,
          showcasePeopleBlock: false,
          delayWarnReasonBlock: false
        })
      }
      this.setData(
        {
          yesterdayPickerChooseIndex: e.detail.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    },
    yesterdayPickerCancel() {},
    onCaseEvent(e) {
      // 自定义组件触发事件时提供的detail对象
      const currentCaseStatus = e.detail.items.find((v) => v.checked)
      this.setData(
        {
          showcasePeopleBlock: !!currentCaseStatus.value,
          showcaseStatus: currentCaseStatus.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    },
    onDelayEvent(e) {
      const delayWarnReasonStatus = e.detail.items.find((v) => v.checked)
      this.setData(
        {
          delayWarnReasonBlock: !!delayWarnReasonStatus.value,
          'task.1.delayWarn': delayWarnReasonStatus.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    },
    onHelpEvent(e) {
      const needHelpStatus = e.detail.items.find((v) => v.checked)
      this.setData(
        {
          'task.1.needHelp': needHelpStatus.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    },
    handleWorkName(e) {
      console.log(e.detail.value)
      console.log(this.data.task)
      this.setData(
        {
          'task.common.workName': e.detail.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    },
    handleDelayWarnReason(e) {
      this.setData(
        {
          'task.1.delayWarnReason': e.detail.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    },
    handleDelayReason(e) {
      this.setData(
        {
          'task.3.delayReason': e.detail.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    },
    handleShowcasePeople(e) {
      this.setData(
        {
          'task.2.showcasePeople': e.detail.value
        },
        function () {
          this.triggerEvent('myevent', {
            task: this.data.task,
            taskIndex: this.data.taskIndex
          })
        }
      )
    }
  }
})
