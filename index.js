'use strict'

const readFileSync = require('fs').readFileSync
const marked = require('marked')
const { parse } = require('url')
const { json, send } = require('micro')
const config = require('./config')
const logger = require('./lib/logger')
const dsfLookup = require('./lib/action-handler')

module.exports = async (req, response) => {
  const { query } = await parse(req.url, true)
  let data = ['POST', 'PUT'].includes(req.method) ? await json(req) : query

  if (['POST'].includes(req.method)) {
    const options = {
      method: data.method,
      config: config.DSF,
      query: data.query
    }
    logger('info', ['method', data.method])
    try {
      const resp = await dsfLookup(options)
      logger('info', [data.method, 'response', JSON.stringify(resp), 'success'])
      send(response, 200, resp)
    } catch (error) {
      logger('error', [data.method, error])
      send(response, 500, error.message)
    }
  } else {
    response.setHeader('Content-Type', 'text/html')
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
