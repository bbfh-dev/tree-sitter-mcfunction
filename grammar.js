/**
 * @file Tree-sitter for the latest version of Minecraft mcfunction syntax
 * @author BubbleFish <daforsastudia@gmail.com>
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const datatypes = require("./grammar/datatypes.js");
const snbt = require("./grammar/snbt.js");
const selectors = require("./grammar/selectors.js");
const top_level = require("./grammar/top_level.js");

module.exports = grammar({
	name: "mcfunction",

	conflicts: ($) => [[$.resource_identifier, $.property_identifier]],

	extras: (_) => [],

	rules: {
		source_file: ($) => repeat(choice($._statement, $._empty_line)),

		backslash: (_) => /\s*\\\r?\n\s*/,

		_indentation: (_) => /[\t ]+/,

		_newline: (_) => /\r?\n/,

		_empty_line: ($) => seq(optional($._indentation), $._newline),

		_space: ($) => choice(/ /, $.backslash),

		_statement: ($) =>
			seq(
				optional($._indentation),
				choice(
					$.block_comment_statement,
					$.comment_statement,
					$.command_statement,
				),
				$._newline,
			),

		macro: (_) =>
			token(
				choice(
					seq("$(", /[a-z_0-9]+/, ")"),
					// from Vintage preprocessor
					seq("%[", /[a-z_0-9\.:]+/, "]"),
				),
			),

		...datatypes,
		...snbt,
		...selectors,
		...top_level,
	},
});
