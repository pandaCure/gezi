Component({
  data: {
    index: 0
  },
  properties: {
    robotGroupsList: Array
  },
  methods: {
    chooseGroupChange: function (e) {
      console.log('chooseGroupChange', e.detail.value)
    },
    chooseGroupCancel: function (e) {
      console.log('chooseGroupCancel', e)
    }
  }
})
