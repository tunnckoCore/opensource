'use strict'

const path = require('path')
const crypto = require('crypto')
const meriyah = require('meriyah')
const fs = require('fs-extra')

module.exports = buildMemoizer
module.exports.getCacheFilePath = getCacheFilePath

const serializer = {
  serialize,
  deserialize
}

function serialize (val) {
  const circRefColl = []
  return JSON.stringify(val, function (name, value) {
    if (typeof value === 'function') {
      return // ignore arguments and attributes of type function silently
    }
    if (typeof value === 'object' && value !== null) {
      if (circRefColl.indexOf(value) !== -1) {
        // circular reference found, discard key
        return
      }
      // store value in collection
      circRefColl.push(value)
    }
    return value
  })
}

function deserialize (...args) {
  return JSON.parse(...args).data
}

function getCacheFilePath (fn, args, opt) {
  const options = { ...serializer, ...opt }
  const salt = options.salt || ''
  let fnStr = ''
  if (!options.noBody) {
    fnStr = String(fn)
    if (options.astBody) {
      fnStr = meriyah.parse(fnStr, { jsx: true, next: true })
    }
    fnStr = options.astBody ? JSON.stringify(fnStr) : fnStr
  }

  const argsStr = options.serialize(args)
  const hash = crypto.createHash('md5').update(fnStr + argsStr + salt).digest('hex')

  return path.join(options.cachePath, options.cacheId, hash)
}

function buildMemoizer (options) {
  const promiseCache = {}

  // check args
  if (!options || (options && typeof options !== 'object')) {
    throw new Error('options of type object expected')
  }
  if (typeof options.cachePath !== 'string') {
    throw new Error('option cachePath of type string expected')
  }
  options = { ...serializer, ...options }
  checkOptions(options)

  function checkOptions (opts) {
    if (opts.salt && typeof opts.salt !== 'string') {
      throw new TypeError('salt option of type string expected, got: ' + typeof opts.salt)
    }
    if (opts.cacheId && typeof opts.cacheId !== 'string') {
      throw new TypeError('cacheId option of type string expected, got: ' + typeof opts.cacheId)
    }
    if (opts.maxAge && typeof opts.maxAge !== 'number') {
      throw new TypeError('maxAge option of type number bigger zero expected')
    }
    if (opts.serialize && typeof opts.serialize !== 'function') {
      throw new TypeError('serialize option of type function expected')
    }
    if (opts.deserialize && typeof opts.deserialize !== 'function') {
      throw new TypeError('deserialize option of type function expected')
    }
  }

  // check for existing cache folder, if not found, create folder, then resolve
  function initCache (cachePath, opts) {
    return new Promise(function (resolve, reject) {
      return fs.ensureDir(cachePath, { recursive: true })
        .then(() => {
          resolve()
        })
        .catch((err) => {
          if (err && err.code === 'EEXIST' && opts.throwError === false) {
            resolve()
            return
          }
          reject(err)
        })
    })
  }

  function memoizeFn (fn, opt) {
    if (opt && typeof opt !== 'object') {
      throw new Error('opt of type object expected, got \'' + typeof opt + '\'')
    }

    if (typeof fn !== 'function') {
      throw new Error('fn of type function expected')
    }

    const optExt = { cacheId: './', ...options, ...opt }
    checkOptions(optExt)

    function resolveWithMemFn () {
      return new Promise(function (resolve) {
        const memFn = function () {
          const args = Array.prototype.slice.call(arguments)
          const fnaCb = args.length ? args[args.length - 1] : undefined

          if (typeof fnaCb === 'function' && fnaCb.length > 0) {
            optExt.async = true
          }

          const filePath = getCacheFilePathBound(fn, args, optExt)

          if (promiseCache[filePath]) {
            return promiseCache[filePath]
          }

          promiseCache[filePath] = new Promise(function (resolve, reject) {
            function cacheAndReturn () {
              let result

              function writeResult (r, cb) {
                let resultObj
                let resultString
                if ((r && typeof r === 'object') || typeof r === 'string') {
                  resultObj = { data: r }
                  resultString = optExt.serialize(resultObj)
                } else {
                  resultString = '{"data":' + r + '}'
                }
                if (optExt.maxAge) {
                  setTimeout(function () {
                    fs.unlink(filePath, function (err) {
                      if (err && err.code !== 'ENOENT') {
                        throw err
                      }
                    })
                  }, optExt.maxAge)
                }
                fs.writeFile(filePath, resultString, cb)
              }

              function processFnAsync () {
                args.pop()

                args.push(function (/* err, result... */) {
                  const cbErr = arguments[0]
                  const cbArgs = Array.prototype.slice.call(arguments)
                  cbArgs.shift()
                  if (cbErr) {
                    // if we have an exception we don't cache anything
                    return reject(cbErr)
                  }
                  cbArgs.unshift(null)
                  writeResult(cbArgs, function () {
                    resolve(fnaCb.apply(null, cbArgs))
                  })
                })
                fn.apply(null, args)
              }

              function processFn () {
                try {
                  result = fn.apply(null, args)
                } catch (e) {
                  return reject(e)
                }
                if (result && typeof result.then === 'function') {
                  // result is a promise instance
                  return result.then(function (retObj) {
                    writeResult(retObj, function () {
                      resolve(retObj)
                    })
                  },
                  function (err) {
                    // if we have an exception we don't cache anything
                    reject(err)
                  })
                } else {
                  writeResult(result, function (err) {
                    if (err) {
                      reject(err)
                    } else {
                      resolve(result)
                    }
                  })
                }
              }

              if (optExt.async) {
                return processFnAsync()
              }
              return processFn()
            }

            fs.readFile(filePath, { encoding: 'utf8' }, function (err, data) {
              if (err) {
                return cacheAndReturn()
              }

              function parseResult (resultString) {
                try {
                  const deserializedValue = optExt.deserialize(resultString)

                  return deserializedValue
                } catch (e) {
                  return undefined
                }
              }

              function retrieveAndReturn () {
                function processFnAsync () {
                  resolve(fnaCb.apply(null, parseResult(data)))
                }

                function processFn () {
                  resolve(parseResult(data))
                }

                if (optExt.async) {
                  return processFnAsync()
                }
                return processFn()
              }

              if (optExt.force) {
                delete optExt.force
                // result has not been cached yet or needs to be recached - cache and return it!
                cacheAndReturn()
              } else {
                // result has already been cached - return it!
                retrieveAndReturn()
              }
            })
          })
          promiseCache[filePath].then(function (result) {
            delete promiseCache[filePath]
          })
          return promiseCache[filePath]
        }
        resolve(memFn)
      })
    }

    return initCache(path.join(options.cachePath, optExt.cacheId), optExt).then(resolveWithMemFn)
  }

  function invalidateCache (cacheId) {
    return new Promise(function (resolve, reject) {
      if (cacheId && typeof cacheId !== 'string') {
        reject(Error('cacheId option of type string expected, got \'' + typeof cacheId + '\''))
      } else {
        const cachPath = cacheId ? path.join(options.cachePath, cacheId) : options.cachePath
        fs.remove(cachPath)
          .then(resolve)
          .catch(reject)
      }
    })
  }

  function getCacheFilePathBound (fn, args, opt) {
    return getCacheFilePath(fn, args, { ...options, ...opt, cachePath: options.cachePath })
  }

  const cache = initCache(options.cachePath)

  return {
    fn: function (fn, opt) {
      return cache.then(function () {
        return memoizeFn(fn, opt)
      }, function (err) {
        throw err
      })
    },
    getCacheFilePath: getCacheFilePathBound,
    invalidate: invalidateCache
  }
}
