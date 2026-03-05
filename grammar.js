/**
 * @file Tree-sitter for the latest version of Minecraft mcfunction syntax
 * @author BubbleFish <daforsastudia@gmail.com>
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const symbols = require("./grammar/symbols.js");
const primitive_types = require("./grammar/primitive_types.js");
const complex_types = require("./grammar/complex_types.js");
const keywords = require("./grammar/keywords.js");
const statements = require("./grammar/statements.js");

module.exports = grammar({
	name: "mcfunction",

	conflicts: ($) => [],

	extras: (_) => [],

	rules: {
		source_file: ($) => repeat($._statement),

		_statement: ($) =>
			seq(
				optional($._indentation),
				optional(
					choice(
						$.comment_header,
						$.comment_call,
						$.comment_preprocessor,
						$.comment,
						seq(optional("$"), $._command_statement),
					),
				),
				$._newline,
			),

		macro: (_) =>
			token(
				choice(
					seq("$(", /[_a-z0-9]+/, ")"),
					// from Vintage preprocessor
					seq("%[", /[_\.:a-z0-9]+/, "]"),
				),
			),

		...symbols,
		...primitive_types,
		...complex_types,
		...keywords,
		...statements,
	},
});
