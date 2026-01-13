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

const ARGUMENT = ($) => [
	$.nbt_compound,
	$.nbt_array,
	$.selector,
	$.position,
	$.rotation,
	$.heightmap,
	$.resource,
	$.scale,
	$.type,
	$.slot,
	$.string,
	$.word,
	$.boolean,
	$.operator,
];

module.exports = grammar({
	name: "mcfunction",

	extras: ($) => [$.macro, $.substitution],

	conflicts: ($) => [[$.nbt_compound, $.selector_compound]],

	rules: {
		source_file: ($) => repeat($._statement),

		_newline: (_) => /\r?\n/,

		_space: ($) => choice(/ /, $.backslash),

		backslash: (_) => /\s*\\\r?\n\s*/,

		_statement: ($) =>
			seq(
				// Allow for indentation (such as bolt).
				optional(/\s+/),
				optional(choice($.comment, $.command)),
				$._newline
			),

		comment: (_) => token(seq("#", /[^\r\n]*/)),

		command: ($) =>
			seq(
				optional($.macro_indicator),
				choice($._execute_command, $._generic_command)
			),

		_execute_command: ($) =>
			prec.right(
				2,
				seq(
					"execute",
					repeat(seq($._space, $._subcommand)),
					$._space,
					"run",
					$._space,
					$.command
				)
			),

		_subcommand: ($) => choice(...ARGUMENT($), $.subcommand_identifier),

		_generic_command: ($) =>
			prec.left(
				2,
				seq($.command_identifier, repeat(seq($._space, $.argument)))
			),

		macro_indicator: (_) => /\$/,

		command_identifier: (_) => choice(...GENERIC_COMMANDS),
		subcommand_identifier: (_) => choice(...EXECUTE_SUBCOMMANDS),

		argument: ($) => choice(...ARGUMENT($), ...COMMAND_KEYWORDS),

		selector: ($) =>
			seq(
				$.selector_identifier,
				optional(seq(/\[/, repeat($.selector_query), /\]/))
			),

		selector_identifier: (_) => /@[a-z]/,

		query_identifier: (_) => /[-\+\.!:_a-zA-Z0-9]+/,

		selector_query: ($) =>
			seq(
				$.query_identifier,
				repeat($._space),
				choice("=", "=!"),
				repeat($._space),
				choice(...ARGUMENT($), $.selector_compound),
				optional(/\s*,\s*/)
			),

		position: ($) => prec.left(2, seq("~", optional(prec(2, $.scale)))),

		rotation: ($) => prec.left(2, seq("^", optional(prec(2, $.scale)))),
		heightmap: (_) =>
			/(world_surface|motion_blocking|motion_blocking_no_leaves|ocean_floor)/,

		resource: (_) => token(seq(/[a-z_]+\:/, /[a-z_/][a-z0-9_\-\+/\.]*/)),

		scale: (_) =>
			prec(
				4,
				seq(
					optional("-"),
					token.immediate(choice(/\d+/, /\d+\.\d*/, /\.\d+/)),
					optional(/[tsmhdf]/)
				)
			),

		macro: () => seq("$(", /[a-zA-Z_]+/, ")"),

		// This is not a vanilla feature, but rather something from my Mime project
		substitution: () => seq("%[", /[a-zA-Z_]+\]/),

		type: (_) => /(byte|short|int|long|float|double)/,

		operator: (_) => choice("+=", "-=", "*=", "/=", "%=", "><", "<", ">"),

		slot: (_) =>
			choice(
				/container\.[\d\*]+/,
				/hotbar\.[\d\*]+/,
				/inventory\.[\d\*]+/,
				/enderchest\.[\d\*]+/,
				/villager\.[\d\*]+/,
				/horse\.[\d\*]+/,
				/player\.crafting\.[\d\*]+/,
				"contents",
				"player.cursor",
				/(weapon|armor|horse)\.[a-z\*]+/
			),

		word: ($) =>
			seq(
				/[\+\.!#:_a-zA-Z0-9]+/,
				optional($.item_compound),
				optional(choice($.word, seq($.string, optional($.word))))
			),

		string: (_) => choice(seq('"', /[^"]*/, '"'), seq("'", /[^']*/, "'")),

		boolean: (_) => /(true|false|1b|0b)/,

		_nbt_element: ($) =>
			choice(
				$.nbt_compound,
				$.nbt_array,
				$.range,
				$.scale,
				$.string,
				$.boolean
			),

		range: (_) => token(choice(/\-?\d+\.\.\-?\d*/, /\-?\d*\.\.\-?\d+/)),

		nbt_identifier: ($) => choice($.string, /[-\+\.#!_a-zA-Z0-9]+/),

		nbt_compound: ($) =>
			seq(
				"{",
				repeat(
					choice(
						seq(
							$.nbt_identifier,
							repeat($._space),
							":",
							repeat($._space),
							$._nbt_element
						),
						/\s*,\s*/
					)
				),
				"}"
			),

		nbt_array: ($) =>
			seq("[", repeat(choice($._space, $._nbt_element, /\s*,\s*/)), "]"),

		selector_compound: ($) =>
			seq(
				"{",
				repeat(
					choice(
						seq(
							choice($.nbt_identifier, $.resource),
							repeat($._space),
							"=",
							repeat($._space),
							$._nbt_element
						),
						/\s*,\s*/
					)
				),
				"}"
			),

		item_compound: ($) =>
			seq(
				"[",
				repeat(
					choice(
						seq(
							choice($.nbt_identifier, $.resource),
							optional(
								seq(
									repeat($._space),
									"=",
									repeat($._space),
									choice(
										$.nbt_compound,
										$.nbt_array,
										$.range,
										$.boolean,
										$.scale
									)
								)
							)
						),
						/\s*,\s*/
					)
				),
				"]"
			),
	},
});
