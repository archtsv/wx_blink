// pages/book-detail/book-detail.js
import {
  BookModel
} from '../../models/book';
import {
  LikeModel
} from '../../models/like';
const bookModel = new BookModel();
const likeModel = new LikeModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    detail: null,
    likeStatus: 0,
    likeCount: 0,
    posting: false,
  },

  onLike(event) {
    const like_or_cancel = event.detail.behavior;
    likeModel.like(like_or_cancel, this.data.detail.id, 400);
  },

  onFakePost() {
    this.setData({
      posting: true
    })
  },

  onCancel() {
    this.setData({
      posting: false
    })
  },

  onPost(event) {
    const comment = event.detail.text || event.detail.value;

    if(comment.length > 12) {
      wx.showToast({
        title: '短评最多12个字',
        icon: 'none'
      })
      return
    }

    bookModel.postComment(this.data.detail.id, comment)
      .then(res => {
        wx.showToast({
          title: '+ 1',
          icon: 'none'
        })

        this.data.comments.unshift({
          content: comment,
          nums: 1
        })

        this.setData({
          comments: this.data.comments,
          posting: false
        })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    const bid = options.bid;
    const detail = bookModel.getDetail(bid);
    const comments = bookModel.getComments(bid);
    const likeStatus = bookModel.getLikeStatus(bid);

    // Promise.all，当全部执行完之后才会执行下一步，所需时间为执行时间最长的那个回调函数执行完毕所用时间
    // Promise.race，有一个promise执行完毕就立即执行下一步所需时间为执行之间最短的那个回调函数执行完毕所用时间
    Promise.all([detail, comments, likeStatus])
      .then(res => {
        this.setData({
          detail: res[0],
          comments: res[1].comments,
          likeStatus: res[2].like_status,
          likeCount: res[2].fav_nums
        });
        wx.hideLoading();
      });

    // detail.then(res => {
    //   this.setData({
    //     detail: res,
    //   })
    // });
    // comments.then(res => {
    //   this.setData({
    //     comments: res.comments,
    //   })
    // });
    // likeStatus.then(res => {
    //   this.setData({
    //     likeStatus: res.like_status,
    //     likeCount: res.fav_nums,
    //   })
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})