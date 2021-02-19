/**
 * 验证器
 * 错误信息尽量在 30个字符以内
 */

import { isPromise } from '@/utils/util'

/**
 * 字母开头，数字
 * @param { String } 值
 * @param { * } 验证参数
 */

export function isAlphanumericWithAlphaBegin (value, options = {}) {
  const { min = 0, max = 16 } = options
  const pattern = RegExp(`^[a-zA-Z]\\w{${min},${max > 0 ? max : ''}}$`)
  const valid = pattern.test(value)
  let error = null
  if (!valid) {
    if (max) {
      error = `名称只能包含字母，数字，且以字母开头，长度在${min}-${max}之间！`
    } else {
      error = `名称只能包含字母，数字，且以字母开头，！`
    }
  }
  return { valid, error }
}

/**
 * 字母
 * @param { String } 值
 * @param { * } 验证参数
 */
export function isAlpha (value, options = {}) {
  const { min = 0, max = 16 } = options
  const pattern = RegExp(`^[a-zA-Z]{${min},${max > 0 ? max : ''}}$`)
  const valid = pattern.test(value)
  let error = null
  if (!valid) {
    if (max) {
      error = `名称只能包含字母，且长度在${min}-${max}之间！`
    } else {
      error = `名称只能包含字母！`
    }
  }
  return { valid, error }
}

/**
 * 字母，数字
 * @param { String } 值
 * @param { * } 验证参数
 */
export function isAlphanumeric (value, options = {}) {
  const { min = 0, max = 16 } = options
  const pattern = RegExp(`^[a-zA-Z0-9]{${min},${max > 0 ? max : ''}}$`)
  const valid = pattern.test(value)
  let error = null
  if (!valid) {
    if (max) {
      error = `名称只能包含字母，数字，且长度在${min}-${max}之间！`
    } else {
      error = `名称只能包含字母，数字！`
    }
  }
  return { valid, error }
}

/**
 * 字母，数字，任何非空白字符
 * @param { String } 值
 * @param { * } 验证参数
 */
export function isAlphanumericWithSymbol (value, options = {}) {
  const { min = 0, max = 16 } = options
  const pattern = RegExp(`^[a-zA-Z0-9\\S]{${min},${max > 0 ? max : ''}}$`)
  const valid = pattern.test(value)
  let error = null
  if (!valid) {
    if (max) {
      error = `名称不能有空格，且长度在${min}-${max}之间！`
    } else {
      error = `名称不能有空格！`
    }
  }
  return { valid, error }
}

/**
 * 长度
 * @param { String } 值
 * @param {*} 验证参数
 */
export function isExceed (value, options = {}) {
  const { min = 0, max = 16 } = options
  const valid = !RegExp(`^.{${min},${max > 0 ? max - 1 : ''}}$`).test(value)
  return { valid }
}

/**
 * 正整数
 * @param { String } 值
 * @param {*} 验证参数
 */
export function isPositiveInteger (value, options = {}) {
  const valid = /^[0-9]*[1-9][0-9]*$/.test(value)
  let error = ''
  if (!valid) {
    error = '请输入正整数！'
  }
  return { valid, error }
}

/**
 * ip
 * @param { String } 值
 * @param {*} 验证参数
 */
export function isIP (value, options = {}) {
  const valid = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(value)
  let error = ''
  if (!valid) {
    error = '请输入 IP！'
  }
  return { valid, error }
}

/**
 * 是否重复
 * @param { String } 值
 * @param {*} 验证参数
 */
export async function isRepeat (value, options = {}) {
  const { initialValue, fetchData = () => {}, message = '名称已存在，请重新输入！' } = options
  const valid = true
  const error = null
  if (value === initialValue) {
    return { valid, error }
  }
  const f = fetchData()
  if (isPromise(f)) {
    try {
      const res = await f
      if (res.length > 0) {
        return { valid: false, error: message }
      }
    } catch (error) {
    }
  }
  return { valid, error }
}
