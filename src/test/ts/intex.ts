import {foo} from '../../main/ts'

describe('index', () => {
  it('properly exposes facade', () => {
    expect(foo).toBe('bar')
  })
})
