import {
  isAlphanumeric,
  isAlphanumericWithSymbol,
  isExceed,
  isRepeat
} from '@/utils/validator'

describe('validator test', () => {
  it('isAlphanumeric', () => {
    expect(isAlphanumeric('a').valid).toEqual(true)
    expect(isAlphanumeric('', { min: 1, max: 0 }).valid).not.toEqual(true)
    expect(isAlphanumeric('a', { min: 1, max: 0 }).valid).toEqual(true)
    expect(isAlphanumeric('', { min: 1, max: 3 }).valid).not.toEqual(true)
    expect(isAlphanumeric('aaaa', { min: 2, max: 5 }).valid).toEqual(true)
  })

  it('isAlphanumericWithSymbol', () => {
    expect(isAlphanumericWithSymbol('a').valid).toEqual(true)
    expect(isAlphanumericWithSymbol('', { min: 1, max: 0 }).valid).not.toEqual(true)
    expect(isAlphanumericWithSymbol('a', { min: 1, max: 0 }).valid).toEqual(true)
    expect(isAlphanumericWithSymbol('', { min: 1, max: 3 }).valid).not.toEqual(true)
    expect(isAlphanumericWithSymbol('aaaa', { min: 2, max: 5 }).valid).toEqual(true)
  })

  it('isExceed', () => {
    expect(isExceed('a').valid).toEqual(false)
    expect(isExceed('a', { min: 1, max: 0 }).valid).toEqual(false)
    expect(isExceed('a', { min: 2, max: 5 }).valid).not.toEqual(false)
    expect(isExceed('aaa', { min: 2, max: 5 }).valid).toEqual(false)
  })

  it('测试jest.fn()返回Promise', async () => {
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        resolve([{}])
      })
    }
    let _ = await isRepeat('a')
    expect(_.valid).toEqual(false)
    _ = await isRepeat('a', { fetchData })
    expect(_.valid).not.toEqual(false)
    _ = await isRepeat('a', { fetchData, initialValue: 'a' })
    expect(_.valid).toEqual(false)
  })
})
