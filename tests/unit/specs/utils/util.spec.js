import { EMPTY_VALUE } from '@/config/constant.config'
import ENUM from '@/config/enum'
import {
  isEmpty,
  isEmptyOfUN,
  deepGet,
  deepSet,
  deepGetFromArray,
  queryBuild,
  columnsBuild,
  requestParamsBuild,
  removeEmptyField,
  uniq,
  getRowSpanCount,
  convert,
  toEnum,
  transformArray
} from '@/utils/util'

describe('util test', () => {
  it('isEmpty', () => {
    expect(isEmpty(false)).toEqual(false)
    expect(isEmpty('')).toEqual(true)
    expect(isEmpty(0)).toEqual(false)
    expect(isEmpty(undefined)).toEqual(true)
    expect(isEmpty(null)).toEqual(true)
    expect(isEmpty([])).toEqual(true)
    expect(isEmpty({})).toEqual(true)
  })

  it('isEmptyOfUN', () => {
    expect(isEmptyOfUN(false)).toEqual(false)
    expect(isEmptyOfUN('')).toEqual(false)
    expect(isEmptyOfUN(0)).toEqual(false)
    expect(isEmptyOfUN(undefined)).toEqual(true)
    expect(isEmptyOfUN(null)).toEqual(true)
    expect(isEmptyOfUN([])).toEqual(false)
    expect(isEmptyOfUN({})).toEqual(false)
  })

  it('deepGet', () => {
    const o = {
      a: 1,
      b: { a: 1, b: 2 },
      c: [1, { a: 1, b: { a: 1 } }]
    }
    expect(deepGet(undefined, 'a')).toEqual(undefined)
    expect(deepGet(o, 'a')).toEqual(1)
    expect(deepGet(o, 'b.a')).toEqual(1)
    expect(deepGet(o, 'c.1.b')).toEqual({ a: 1 })
  })

  it('deepSet', () => {
    expect(deepSet(undefined, 'a', 1)).toEqual({ a: 1 })
    expect(deepSet({ a: { b: 1 } }, 'b.a.0.c', 1)).toEqual({ a: { b: 1 }, b: { a: [{ c: 1 }] } })
    expect(deepSet({ a: 1 }, 'a', 2)).toEqual({ a: 2 })
    expect(deepSet({ a: { b: 1 } }, 'a.1.b', 1)).toEqual({ a: { b: 1, 1: { b: 1 } } })
    expect(deepSet({ a: [ { b: 1 } ] }, 'a.1.b', 1)).toEqual({ a: [{ b: 1 }, { b: 1 }] })
  })

  it('deepGetFromArray', () => {
    const o = {
      a: 1,
      b: { a: 1, b: 2 },
      c: [1, { a: 1, b: { a: 1 } }]
    }
    const _ = {
      a: -1,
      b: { a: -1, b: -2 },
      c: [-1, { a: -1, b: { a: -1 } }]
    }
    expect(deepGetFromArray(o, 'a')).toEqual(1)
    expect(deepGetFromArray([o], 'a')).toEqual(1)
    expect(deepGetFromArray([o, _], 'b.a')).toEqual(1)
    expect(deepGetFromArray([_, o], 'b.a')).toEqual(-1)
  })

  it('queryBuild', () => {
    const _ = {
      a: 1,
      b: 0,
      c: '',
      d: undefined,
      e: [],
      f: {},
      g: () => {}
    }
    expect(queryBuild(_)).toHaveProperty('g')
  })

  it('columnsBuild', () => {
    const _ = [
      { key: 1, modules: 'v1' },
      { key: 2, modules: ['v1'] },
      { key: 3, modules: ['v2'] },
      { key: 4, modules: ['v3'] },
      { key: 5, modules: ['v1', 'v2'] },
      { key: 6, modules: ['v2', 'v3'] },
      { key: 7, modules: ['v1', 'v2', 'v3'] }
    ]
    expect(columnsBuild(_, 'v1')).toEqual([
      { key: 1, modules: 'v1' },
      { key: 2, modules: ['v1'] },
      { key: 5, modules: ['v1', 'v2'] },
      { key: 7, modules: ['v1', 'v2', 'v3'] }
    ])
    expect(columnsBuild(_, ['v1', 'v2'])).toEqual([
      { key: 5, modules: ['v1', 'v2'] },
      { key: 7, modules: ['v1', 'v2', 'v3'] }
    ])
  })

  it('requestParamsBuild', () => {
    const url = '/User'
    const params = {
      a: 0,
      b: [],
      c: {},
      d: false
    }
    expect(requestParamsBuild(url, params)).toEqual('/User?a=0&d=false')
  })

  it('removeEmptyField', () => {
    const _ = {
      a: 1,
      b: 0,
      c: '',
      d: undefined,
      e: [],
      f: {}
    }
    expect(removeEmptyField(_)).toEqual({
      a: 1,
      b: 0
    })
  })

  it('uniq', () => {
    expect(uniq([1, 2, 2, 3, 4, 5, 5])).toEqual([1, 2, 3, 4, 5])
    expect(uniq([{ a: 1 }, { a: 1 }, { b: 1 }, { b: 1 }], ['a'])).toEqual([{ a: 1 }, { b: 1 }, { b: 1 }])
  })

  it('getRowSpanCount', () => {
    expect(getRowSpanCount([1, 1, 2, 3, 3], 0)).toEqual(2)
    expect(getRowSpanCount([1, 1, 2, 3, 3], 1)).toEqual(0)
    expect(getRowSpanCount([1, 1, 2, 3, 3], 2)).toEqual(1)
  })

  it('convert', () => {
    expect(convert('')).toEqual(EMPTY_VALUE)
    expect(convert(0, 'filter')).toEqual(0)
    expect(convert(0, 'textTo')).toEqual(0)
    expect(convert(0, 'textTo', { type: 'password' })).toEqual('*')
    expect(convert(0, 'decimalTo')).toEqual(0.00)
    expect(convert(0, 'decimalTo', { digits: 4 })).toEqual(0.0000)
    expect(convert('0', 'decimalTo')).toEqual(0)
    expect(convert(1577808000, 'unixToDate')).toEqual('2020-01-01 00:00:00')
    expect(convert('2020-01-01 00:00:00', 'dateToUnix')).toEqual(1577808000)
    expect(convert(1 * 60 * 60, 'unixDiff')).toEqual('1 小时 ')
    expect(convert(1, 'compressRatio')).toEqual('1 : 1')
    expect(convert(1, 'unit', { unit: '$' })).toEqual('1 $')
    expect(convert(1024, 'unitSize')).toEqual('1 KB')
    expect(convert(1024, 'unitSize', { unit: 'KB' })).toEqual('1 MB')
    expect(convert(1024, 'unitSize', { unit: 'error' })).toEqual('1 KB')
    expect(convert(1024, 'unitSize', { unit: ['KB', 'GB'] })).toEqual('0 GB')
    expect(convert(1024, 'unitSize', { unit: ['KB', 'error'] })).toEqual('1024 KB')
    expect(convert(1, 'unitSize', { unit: ['GB', 'B'] })).toEqual(`${1 * 1024 * 1024 * 1024} B`)
    expect(convert(1000, 'unitSpeed')).toEqual('1 KB/s')
  })

  it('toEnum', () => {
    ENUM.EXAMPLE = [
      { key: true, value: true },
      { key: false, value: false }
    ]
    expect(toEnum(true)).toEqual({ key: EMPTY_VALUE, value: EMPTY_VALUE })
    expect(toEnum(true, 'EXAMPLE')).toEqual({ key: true, value: true })
    expect(toEnum('true', 'EXAMPLE')).toEqual({ key: EMPTY_VALUE, value: EMPTY_VALUE })
  })

  it('transformArray', () => {
    const _ = [
      {
        key: 'a',
        value: 'b',
        items: []
      }
    ]
    expect(transformArray(_, { key: 'a' }, { items: [1] })).toEqual([
      {
        key: 'a',
        value: 'b',
        items: [1]
      }
    ])
  })
})
