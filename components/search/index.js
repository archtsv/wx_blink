// components/search/index.js
import {
  KeywordModel
} from '../../models/keyword';
import {
  BookModel
} from '../../models/book';

import { paginationBev } from '../behaviors/pagination';

const keywordModel = new KeywordModel();
const bookModel = new BookModel();

Component({
  /**
   * 组件的属性列表
   */
  behaviors: [paginationBev],
  properties: {
    more: {
      type: String,
      observer: '_load_more'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    hotWords:[],
    searching: false,
    q: '',
    loading: false,
  },

  attached() {
    this.setData({
      historyWords: keywordModel.getHistory()
    })
    keywordModel.getHot().then(res => {
      this.setData({
        hotWords: res.hot
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _load_more() {
      if(!this.data.q) {
        return
      }
      if(this.data.loading) {
        return
      }
      this.data.loading = true;
      if(this.hasMore()) {
        bookModel.search(this.getCurrentStart(), this.data.q)
        .then(res => {
          const tempArray = this.data.dataArray.concat(res.books);
          this.setMoreData(res.books);
          this.setData({
            loading: false,
          })
        })
      }
    },
    onCancel() {
      this.triggerEvent('cancel', {}, {});
    },
    onConfirm(event) {
      this.setData({
        searching: true,
      })
      const q = event.detail.value || event.detail.text;
      bookModel.search(0, q)
      .then(res => {
        this.setMoreData(res.books);
        this.setTotal(res.total);
        this.setData({
          q
        });
        keywordModel.addToHistory(q);
      });
    },
    onDelete() {
      this.setData({
        searching: false,
      })
    }
  }
})
