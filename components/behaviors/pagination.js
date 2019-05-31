const paginationBev = Behavior({
  data: {
    dataArray: [],
    total: 0,
  },

  methods: {
    setMoreData(dataArray) {
      const tempArray = this.data.dataArray.concat(dataArray);
      this.setData({
        dataArray: tempArray
      })
    },

    getCurrentStart() {
      return this.data.dataArray.length;
    },

    setTotal(total) {
      this.setData({
        total
      })
    },

    hasMore() {
      if(this.data.dataArray.length >= this.data.total) {
        return false;
      }
      return true;
    }
  },
})

export { paginationBev }