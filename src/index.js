#!/usr/bin/env node
'use strict'
const axios = require('axios')
const { Command } = require('commander')
const clipboardy = require('clipboardy')
const TurndownService = require('turndown')
const turndownPluginGfm = require('turndown-plugin-gfm')
const gfm = turndownPluginGfm.gfm
const logger = require('./utils/logger')

// Turndown setup

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' }).use(gfm)

// Commander setup
const program = new Command()
program.version('0.1.0')

program.option('-u, --url <url>', 'the url to process').option('-d, --debug', 'print out extra information').option('-c, --clipboard', 'Pass information to clipboard', false)

program.parse(process.argv)

const main = async () => {
	const {debug, url, clipboard } = program 
	if (debug) {
		logger.setLogLevel('debug')
	}

	if (!url) {
		logger.error('please specify a url')
		// eslint-disable-next-line no-process-exit
		process.exit(1)
	}

	logger.debug('url specified', { url })
	logger.debug('making request to fetch webpage with included url', { url })

	let data = ''
	try {
		const response = await axios.get(url)
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
    
	if (clipboard) {
		clipboardy.writeSync(markdown)
	} else {
		logger.log(markdown)
	}

}

main()
