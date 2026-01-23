/**
 * @file Tree-sitter for the latest version of Minecraft mcfunction syntax
 * @author BubbleFish <daforsastudia@gmail.com>
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const EXECUTE_SUBCOMMANDS = require("./data/execute_subcommands.js");
const GENERIC_COMMANDS = require("./data/generic_commands.js");
const COMMAND_KEYWORDS = require("./data/command_keywords.js");

const ARGUMENT = ($) => [];

module.exports = grammar({
	name: "mcfunction",

	extras: ($) => [],

	rules: {
		source_file: ($) => repeat($._statement),

		backslash: (_) => /\s*\\\r?\n\s*/,

		_newline: (_) => /\r?\n/,
		_space: ($) => choice(/ /, $.backslash),

		_statement: ($) =>
			seq(
				// Allow for indentation (such as bolt or mime).
				optional(/\s+/),
				optional(
					choice(
						$.mime_comment,
						$.comment,
						seq(
							optional($.macro_indicator),
							choice($.execute_statement, $.command),
						),
					),
				),
				$._newline,
			),

		// ————————————————————————————————

		macro_indicator: (_) => /\$/,
		macro: (_) => seq("$(", /[a-z_]+/, ")"),
		substitution: (_) => seq("%[", /[a-z_]+/, "]"),

		// ————————————————————————————————

		simple_identifier: (_) => /[a-z_]+/,
		command_identifier: (_) => choice(...GENERIC_COMMANDS),
		subcommand_identifier: (_) => choice(...EXECUTE_SUBCOMMANDS),
		command_keyword: (_) => choice(...COMMAND_KEYWORDS),

		// ————————————————————————————————

		line_contents: (_) => /[^\r\n]*/,

		comment: ($) => seq(/#[^!]/, $.line_contents),

		mime_comment: ($) =>
			seq("#!", $.simple_identifier, $._space, $.line_contents),

		// ————————————————————————————————

		execute_statement: ($) =>
			seq(
				"execute",
				repeat(seq($._space, $._execute_subcommand)),
				$._space,
				"run",
				$._space,
				choice($.execute_statement, $.command),
			),

		_execute_subcommand: ($) =>
			choice($.subcommand_identifier, ...ARGUMENT($)),

		command: ($) =>
			seq(
				$.command_identifier,
				repeat(
					seq($._space, choice($.command_keyword, ...ARGUMENT($))),
				),
			),

		// ————————————————————————————————
	},
});
