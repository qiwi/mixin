import {resolve} from 'path'
import { argv } from 'yargs'
import assert from 'assert'
import {sync as replaceSync} from 'replace-in-file'
import {readFileSync} from 'fs'

const {flow, dts, prefix} = argv
const DTS = resolve(dts)
const IMPORT_MAIN_PATTERN = /\timport main = require\('(.+)'\);/g
const IMPORT_MAIN_LINE_PATTERN = /^\timport main = require\('(.+)'\);$/
const BROKEN_MODULE_NAME = /(declare module '.+\/target\/es5\/)[^/]*\/src\/main\/index'.+/
const IMPORT = /(import|export) .+ from '(.+)'/g
const DYNAMIC_TYPE_IMPORT = /import\(".+"\)\./g
const REFERENCE = /\/\/\/.+/
const EOF = /$/

assert(!!dts, ' `dts` file path should be specified')

const dtsFile = readFileSync(DTS, 'utf-8')
const declaredModules = (dtsFile.match(/declare module '.*'/g) || []).map(v => v.slice(16, -1))

// Modules should be reachable by `dir/index` and `dir` names
const makeAliases = (modules) => modules.reduce((r, name) => {
  const [from, to] = /\/index$/.test(name)
    ? [name, name.slice(0,-6)]
    : [name, name + '/index']

  return `${r}

declare module '${to}' {
  export * from '${from}'
}`
}, '')

console.log('declaredModules=', declaredModules)

// console.log(dtsFile)

const options = {
  files: DTS,
  from: [
    '\texport = main;',
    IMPORT_MAIN_PATTERN,
    BROKEN_MODULE_NAME,
    REFERENCE,
    /^\s*[\r\n]/gm,
    IMPORT,
    DYNAMIC_TYPE_IMPORT,
    EOF
  ],
  to: [
    '',
    line => {
      const [, name] = IMPORT_MAIN_LINE_PATTERN.exec(line)
      return `	export * from '${name}';`
    },
    line => {
      const [, module] = BROKEN_MODULE_NAME.exec(line)
      return `${module}index' {`
    },
    '',
    '',
    line => {

      const re = /^(.+from ')([^']+)('.*)$/
      const [, pre, module, post] = line.match(re)
      const name = declaredModules.includes(module) || declaredModules.includes(module + '/index')
        ? module
        : module.replace(prefix + '/', '')

      return `${pre}${name}${post}`
    },
    line => {
      const imports = line.match(/(import\(")([^"]+)("\)\.)/g)

      return imports.reduce((m, i) => {
        const re = /^(.*import\(")([^:]+)("\)\..*)$/
        const [, pre, module, post] = i.match(re)

        let name

        // local module
        if (module.charAt(0) === '.') {
          name = prefix + module.slice(1)
        } else {
          name = module
        }

        if (name.charAt(name.length - 1) === '*') {
          name = name.slice(0, -2) // handle '@qiwi/substrate/*'
        }

        return m.replace(i, `${pre}${name}${post}`)
      }, line)
    },
    line => makeAliases(declaredModules)
  ],
}

const changes = replaceSync(options);
console.log('Modified files:', changes);
