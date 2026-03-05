/**
 * @file Tree-sitter for the latest version of Minecraft mcfunction syntax
 * @author BubbleFish <daforsastudia@gmail.com>
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const COMMAND_KEYWORDS = require("./data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("./data/execute_subcommands.js");
const grammar_rules = require("./grammar/99_all.js");

module.exports = grammar({
	name: "mcfunction",

	conflicts: ($) => [],

	extras: ($) => [$._space],

	word: ($) => $.identifier,

	rules: {
		source_file: ($) => repeat($._statement),

		_statement: ($) =>
			seq(
				optional($._indentation),
				optional(choice($.comment, $.command)),
				$._newline,
			),

		backslash: (_) => /\s*\\\s+/,

		_indentation: (_) => /[ \t]+/,
		_space: ($) => choice(/ +/, $.backslash),
		_newline: (_) => /\r?\n/,

		// Used as part of other tokens.
		identifier: (_) => /[_A-Za-z0-9]+/,

		word: ($) =>
			token(choice(seq("$", /[-+_A-Za-z0-9]+/), /[-+_A-Za-z0-9]+/)),

		line: ($) => repeat1(choice(/[^$%\r\n]*/, /[$%]/, $.macro)),

		scoreboard_operation: (_) =>
			token(choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),

		command_keyword: (_) => token(choice(...COMMAND_KEYWORDS)),
		subcommand_keyword: (_) => token(choice(...SUBCOMMAND_KEYWORDS)),

		macro: (_) =>
			token(
				choice(
					seq("$(", /[-:.?!_A-Za-z0-9]+/, ")"),
					seq("%[", /[-:.?!_A-Za-z0-9]+/, "]"),
				),
			),

		...grammar_rules,
	},
});
