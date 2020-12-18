import {
  applyMixins,
  applyMixinsAsMerge,
  applyMixinsAsProto,
  applyMixinsAsProxy,
  applyMixinsAsSubclass,
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
