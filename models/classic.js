import { HTTP } from '../util/http.js'

// 缓存的思路，有缓存就去缓存中取，没有或者有更新就去服务器取，并把取得的结果缓存起来

class ClassicModel extends HTTP {
  getLatest(sCallback) {
    this.request({
      url: 'classic/latest',
      success: (res) => {
        sCallback(res)
        this._setLatestIndex(res.index)
        let key = this._getKey(res.index)
        wx.setStorageSync(key, res)
      }
    })
  }

  getClassic(index, nextOrPrevious, sCallback) {
    let key = nextOrPrevious == 'next' ? this._getKey(index + 1) : this._getKey(index - 1)
    let classic = wx.getStorageSync(key)
    if(!classic) {
      this.request({
        url: `classic/${index}/${nextOrPrevious}`,
        success: (res) => {
          wx.setStorageSync(this._getKey(res.index), res)
          sCallback(res)
        }
      })
    } else {
      sCallback(classic)
    }
    
  }

  isFirst(index) {
    return index === 1 ? true : false
  }

  isLatest(index) {
    const latestIndex = this._getLatestIndex()
    return index === latestIndex ? true : false
  }

  _setLatestIndex(index) {
    wx.setStorageSync('latestIndex', index)
  }

  _getLatestIndex() {
    const index = wx.getStorageSync('latestIndex')
    return index
  }

  // 获取缓存的key
  _getKey(index) {
    const key = `classic-${index}`
    return key
  }
}

export { ClassicModel }