Component({
  properties: {
    items: Array
  },
  methods: {
    radioChange: function (e) {
      console.log('Radio 发生 change 事件，value 值为：', e.detail.value)
      var items = this.data.items
      for (var i = 0, len = items.length; i < len; ++i) {
        items[i].checked = items[i].value == e.detail.value
      }
      this.setData({
        items: items
      })
      this.triggerEvent('myevent', { items })
    }
  }
})
