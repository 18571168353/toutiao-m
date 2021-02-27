import dayjs from 'dayjs'
import Vue from 'vue'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用相对时间的插件
dayjs.extend(relativeTime)

// dayjs默认语言是英文,这里配置为中文
dayjs.locale('zh-cn')

Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

console.log(dayjs().format('mm'))
