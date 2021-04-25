/**
 * convert timestamp into 30-min-interval offset from beginning of week
 * ((now % 1000*60*60*24*7) / 1000*60*30) * 1000*60*30
 * ((now % week in milliseconds) / 30 min standard) * 30 min standard
 * @param {number} now current timestamp
 */
module.exports = (now) => Math.floor((now % 604800000) / 1800000) * 1800000;