const { createLogger, format, transports } = require('winston')

const { combine, timestamp, json } = format

const DEFAULT_LEVEL = 'info'
const logLevels = Object.freeze({
    debug: 4,
    error: 0,
    info: 2,
    off: -1,
    trace: 3,
    warn: 1
})

const GLOBAL_LOG_CONTEXT = {}

const globalLogContextKeysFormat = format((info) => ({
    ...info,
    ...GLOBAL_LOG_CONTEXT
}))

const errorFormat = () => {
    const replaceError = ({ label, level, message, stack }) => ({
        label,
        level,
        message,
        stack
    })
    const replacer = (key, value) => {
        if (value instanceof Error) {
            return replaceError(value)
        }

        return value
    }

    return format.json({ replacer })
}

const CURRENT_FORMAT = [
    globalLogContextKeysFormat(),
    errorFormat(),
    timestamp(),
    json(),
    errorFormat()
]
const CURRENT_TRANSPORTS = [new transports.Console()]

const CURRENT_CONFIG = {
    format: combine(...CURRENT_FORMAT),
    levels: logLevels,
    transports: CURRENT_TRANSPORTS
}

const initConfig = () => {
    CURRENT_CONFIG.level = CURRENT_CONFIG.level || DEFAULT_LEVEL
    CURRENT_TRANSPORTS.forEach((transport) => {
        transport.level = CURRENT_CONFIG.level
    })
}

const getLoggerImpl = () => {
    initConfig()
    const loggerImpl = createLogger(CURRENT_CONFIG)

    return loggerImpl
}

const setLogLevel = (level) => {
    CURRENT_CONFIG.level = level
        ? level.toLowerCase()
        : DEFAULT_LEVEL
    CURRENT_TRANSPORTS.forEach((transport) => {
        transport.level = CURRENT_CONFIG.level
    })
    getLoggerImpl().configure(CURRENT_CONFIG)
}

const getLogLevel = () => CURRENT_CONFIG.level || DEFAULT_LEVEL

const addGlobalLogContextKeys = (keys = {}) => {
    Object.assign(
        GLOBAL_LOG_CONTEXT,
        keys
    )
    getLoggerImpl().configure(CURRENT_CONFIG)
}

const error = (...args) => getLoggerImpl().error(...args)
const warn = (...args) => getLoggerImpl().warn(...args)
const info = (...args) => getLoggerImpl().info(...args)
const debug = (...args) => getLoggerImpl().debug(...args)
const trace = (...args) => getLoggerImpl().trace(...args)

// Necessary for output when you don't want to include the context keys
// eslint-disable-next-line no-console
const log = (...args) => console.log(...args)

module.exports = {
    addGlobalLogContextKeys,
    debug,
    error,
    getLogLevel,
    info,
    log,
    setLogLevel,
    trace,
    warn
}
