'use strict'

const logger = require('./logger')
const fs = require('fs')

module.exports = options => {
  logger('info', ['method', options.method])
  logger('info', ['id', options.query.foedselsnr])
  const path = `../data/${options.query.foedselsnr}.json`
  return fs.existsSync(path) ? require(path) : require('../data/default.json')
}
