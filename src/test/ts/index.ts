import {
  applyMixinsAsProxy,
  applyMixinsAsMerge,
  applyMixinsAsSubclass,
  applyMixinsAsProto,
  applyMixins
} from '../../main/ts'

describe('index', () => {
  it('properly exposes facade', () => {
    expect(applyMixinsAsProxy).toEqual(expect.any(Function))
    expect(applyMixinsAsMerge).toEqual(expect.any(Function))
    expect(applyMixinsAsSubclass).toEqual(expect.any(Function))
    expect(applyMixinsAsProto).toEqual(expect.any(Function))
    expect(applyMixins).toEqual(expect.any(Function))
  })
})
