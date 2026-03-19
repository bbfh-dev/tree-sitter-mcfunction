/**
 * @file Tree-sitter for the latest version of Minecraft mcfunction syntax
 * @author BubbleFish <daforsastudia@gmail.com>
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const grammar_rules = require("./grammar/99_all.js");

module.exports = grammar({
	name: "mcfunction",

	conflicts: ($) => [],

	// Handle whitespace manually.
	extras: (_) => [],

	// WARN: Adding this breaks the grammar :[
	word: ($) => $.identifier,

	rules: {
		source_file: ($) => repeat($._statement),

		identifier: (_) => /[a-zA-Z_][0-9a-zA-Z_\-\+]*/,

		backslash: (_) => /\s*\\\r?\n\s*/,

		_whitespace: ($) => choice(/ +/, $.backslash),

		_statement: ($) =>
			seq(
				optional($._indentation),
				optional(choice($.comment, $.command)),
				$._newline,
			),

		// 'github.com/bbfh-dev/vintage' & 'github.com/mcbeet/mecha'
		_indentation: (_) => /[ \t]+/,

		// Allows for ":" from Python 'github.com/mcbeet/mecha'
		_newline: (_) => /:?\r?\n/,

		macro: (_) =>
			token(
				prec(
					2,
					choice(
						seq("$(", /[0-9a-zA-Z._-]+/, ")"),
						// Comptime macros from 'github.com/bbfh-dev/vintage'
						seq("%[", /[0-9a-zA-Z._-]+/, "]"),
					),
				),
			),

		...grammar_rules,
	},
});
