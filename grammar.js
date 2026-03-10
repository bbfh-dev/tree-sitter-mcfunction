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

	extras: ($) => [/ +/, $.backslash],

	word: ($) => $.identifier,

	rules: {
		source_file: ($) => repeat($._statement),

		backslash: (_) => /\s*\\\r?\n\s*/,

		identifier: (_) => /[a-z_]+/,

		_statement: ($) =>
			seq(
				optional($._indentation),
				optional(
					choice(
						$.comment,
						seq(
							optional(alias("$", $.command_macro_identifier)),
							$.command,
						),
					),
				),
				$._newline,
			),

		// third-party: 'github.com/bbfh-dev/vintage' & 'github.com/mcbeet/mecha'
		_indentation: (_) => /[ \t]+/,

		// third-party: Allows for ":" from Python 'github.com/mcbeet/mecha'
		_newline: (_) => /:?\r?\n/,

		macro: (_) =>
			token(
				choice(
					seq("$(", /[0-9a-zA-Z._-]+/, ")"),
					// third-party: Formatting verb from 'github.com/bbfh-dev/vintage'
					seq("%[", /[0-9a-zA-Z._-]+/, "]"),
				),
			),

		...grammar_rules,
	},
});
