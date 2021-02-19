import Vue from 'vue'
import { convert } from './util'

Vue.filter('convert', (value, filter, config) => convert(value, filter, config))
