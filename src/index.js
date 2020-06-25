#!/usr/bin/env node
'use strict'
const axios = require('axios')
const { Command } = require('commander')
const TurndownService = require('turndown')
const turndownPluginGfm = require('turndown-plugin-gfm')
const gfm = turndownPluginGfm.gfm
const logger = require('../logger')

// Turndown setup

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' }).use(gfm)

// Commander setup
const program = new Command()
program.version('0.1.0')

program.option('-u, --url <url>', 'the url to process').option('-d, --debug', 'print out extra information')

program.parse(process.argv)

const main = async () => {
    if (program.debug) {
        logger.setLogLevel('debug')
    }

    if (!program.url) {
        logger.error('please specify a url')
        // eslint-disable-next-line no-process-exit
        process.exit(1)
    }

    logger.debug('url specified', { url: program.url })
    logger.debug('making request to fetch webpage with included url', { url: program.url })

    let data = ''
    try {
        const response = await axios.get(program.url)
        data = response.data
    } catch (error) {
        logger.error('there was an error fetching the webpage', { error })
        // eslint-disable-next-line no-process-exit
        process.exit(1)
    }

    let markdown = ''

    logger.debug('attempting to convert html to markdown')
    try {
        const processed = turndown.turndown(data)
        markdown = processed
    } catch (error) {
        logger.error('there was an error converting to markdown', { error })
        // eslint-disable-next-line no-process-exit
        process.exit(1)
    }

    // eslint-disable-next-line no-console
    console.log(markdown)
}

main()
