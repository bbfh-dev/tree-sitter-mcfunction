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

	conflicts: ($) => [
		[$.argument_keyword, $.subcommand_keyword],
		[$.item_slot, $._constant],
		[$.item_slot, $.word],
		[$._word, $.selector_identifier],
		[$._data_path_node, $.selector_identifier],
	],

	// Handle whitespace manually.
	extras: (_) => [],

	word: ($) => $.identifier,

	reserved: {
		global: (_) => ["execute", "return run", "run", "say"],
	},

	rules: {
		source_file: ($) =>
			// Although this looks rather complicated,
			// all this does is make $._newline of the LAST $._statement
			// optional.
			optional(
				seq(
					repeat(
						seq(
							choice(optional($._statement), $._indentation),
							$._newline,
						),
					),
					$._statement,
					optional($._newline),
				),
			),

		identifier: (_) => /[a-z_]+/,

		backslash: (_) => /\s*\\\r?\n\s*/,

		_whitespace: ($) => choice(/ +/, $.backslash),

		_statement: ($) =>
			seq(optional($._indentation), choice($.comment, $.command)),

		// 'github.com/bbfh-dev/vintage' & 'github.com/mcbeet/mecha'
		_indentation: (_) => /[ \t]+/,

		// Allows for ":" from Python 'github.com/mcbeet/mecha'
		_newline: (_) => seq(optional(":"), /\r?\n/),

		macro: (_) =>
			token(
				prec(
					2,
					choice(
						seq("$(", /[0-9a-zA-Z._-]+/, ")"),
						// Compile-time macros from 'github.com/bbfh-dev/vintage'
						seq("%[", /[0-9a-zA-Z._-]+/, "]"),
					),
				),
			),

		...grammar_rules,
	},
});
