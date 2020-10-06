Page({
  data: {
    yesterdayFinishedWorkArray: [0],
    yesterdayFormData: []
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
  }
})
