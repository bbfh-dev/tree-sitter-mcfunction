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

	extras: ($) => [],

	word: ($) => $.identifier,

	rules: {
		source_file: ($) => repeat($._statement),

		_statement: ($) =>
			seq(
				optional($._indentation),
				optional(choice($.comment)),
				$._newline,
			),

		...grammar_rules,
	},
});
