"use strict";

const postcss = require("postcss");
const cssnano = require("cssnano");
const cssNext = require("postcss-cssnext");
const queries = require("css-mqpacker");
const perfect = require("perfectionist");
const atImport = require("postcss-import");
const conditionals = require("postcss-conditionals");
const rmComments = require("postcss-discard-comments");
const classRepeat = require("postcss-class-repeat");

const getPlugins = function(options) {
  options = options || {};

  const perfectionistOptions = options.perfectionist || {
    format: "compact",
    trimTrailingZeros: false
  };

  const atImportOptions = options.atImport || {};

  const plugins = cssNext().plugins.concat([
    atImport(atImportOptions),
    conditionals(),
    queries(),
    perfect(perfectionistOptions)
  ]);

  if (options.minify) {
    plugins.push(cssnano());
    plugins.push(rmComments());
  }

  if (options.repeat) {
    let repeatNum = parseInt(options.repeat) || 4;

    if (repeatNum < 2) {
      repeatNum = 4;
    }

    plugins.push(classRepeat({ repeat: repeatNum }));
  }

  if (options.plugins) {
    options.plugins.forEach(plugin => plugins.push(plugin));
  }

  return plugins;
};

module.exports = function tachyonsBuild(css, options) {
  const plugins = getPlugins(options);

  return postcss(plugins).process(css, options);
};

module.exports.getPlugins = getPlugins;
