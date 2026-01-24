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
	$.macro,
	$._primitive_type,
	$.position,
	$.rotation,
	$.string,
	$.selector,
	$.resource,
	$.range,
	$._nbt_type,
	$.path,
	$.operator,
	$.slot,
	$.heightmap,
	$.scoreboard_criteria,
];

const ARRAY = ($, open_char, close_char, element) =>
	seq(
		open_char,
		optional(
			seq(
				optional($._space),
				element,
				repeat(
					seq(optional($._space), ",", optional($._space), element),
				),
				optional($._space),
			),
		),
		close_char,
	);

module.exports = grammar({
	name: "mcfunction",

	extras: (_) => [],

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
		macro: (_) =>
			choice(
				seq("$(", /[a-z_]+/, ")"),
				// from Mime preprocessor
				seq("%[", /[a-z_]+/, "]"),
			),

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

		_primitive_type: ($) => choice($.boolean, $.type, $.integer, $.float),

		boolean: (_) => token(choice("false", "true")),
		type: (_) =>
			token(choice("byte", "short", "int", "long", "float", "double")),

		byte_indicator: (_) => /[Bb]/,
		short_indicator: (_) => /[Ss]/,
		long_indicator: (_) => /[Ll]/,
		integer: ($) =>
			seq(
				/\-?[0-9]+/,
				optional(
					choice(
						$.byte_indicator,
						$.short_indicator,
						$.long_indicator,
					),
				),
			),

		float: (_) => token(choice(/\-?[0-9]+\.[0-9]+/, /\-?\.[0-9]+/)),

		number: ($) => choice(/\-?[0-9]+/, $.float),

		position: ($) =>
			seq("~", optional(choice($.integer, $.float, $.macro))),
		rotation: ($) =>
			seq("^", optional(choice($.integer, $.float, $.macro))),

		operator: (_) =>
			choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">"),

		// ————————————————————————————————

		_single_quoted_string: ($) =>
			seq(
				"'",
				choice(
					$._double_quoted_string,
					repeat(choice(/[^'"(\$\(\))]+/, $.macro)),
				),
				"'",
			),

		_double_quoted_string: ($) =>
			seq(
				'"',
				choice(
					$._single_quoted_string,
					repeat(choice(/[^'"(\$\(\))]+/, $.macro)),
				),
				'"',
			),

		string: ($) => choice($._single_quoted_string, $._double_quoted_string),

		word: (_) =>
			choice(/#[0-9a-zA-Z_+\-]+/, /\.?[a-zA-Z_\+\-][0-9a-zA-Z_\+\-]*/),

		range: ($) =>
			choice(
				seq($.number, ".."),
				seq("..", $.number),
				seq($.number, "..", $.number),
			),

		slot: (_) =>
			choice(
				/container\.[\*(\d+)]/,
				/hotbar\.[\*(\d+)]/,
				/inventory\.[\*(\d+)]/,
				/enderchest\.[\*(\d+)]/,
				/villager\.[\*(\d+)]/,
				/horse\.[\*(\d+)]/,
				/player\.crafting\.[\*(\d+)]/,
				/contents/,
				/player\.cursor/,
				/(weapon|armor|horse)\.(\*|[a-z]+)/,
			),

		heightmap: (_) =>
			choice(
				"world_surface",
				"motion_blocking",
				"motion_blocking_no_leaves",
				"ocean_floor",
			),

		_color: (_) =>
			/(black|dark_blue|dark_green|dark_aqua|dark_red|dark_purple|gold|gray|dark_gray|blue|green|aqua|red|light_purple|yellow|white)/,

		scoreboard_criteria: ($) =>
			choice(
				"dummy",
				"trigger",
				"deathCount",
				"playerKillCount",
				"totalKillCount",
				"health",
				"xp",
				"level",
				"food",
				"air",
				"armor",
				seq("teamkill.", choice($._color, $.macro)),
				seq("killedByTeam.", choice($._color, $.macro)),
			),

		resource: ($) =>
			seq(
				choice("./", /#?[a-z_]+\:/),
				repeat1(choice($.macro, "/", /[a-z0-9_\.\+\-]+/)),
			),

		// ————————————————————————————————

		compound_identifier: ($) =>
			choice(
				token(seq(optional(/[a-z_]+:/), /[a-zA-Z_\.]+/)),
				$.string,
				$.macro,
			),

		compound_value: ($) =>
			choice(
				$._primitive_type,
				$.string,
				$.resource,
				$.word,
				$.range,
				$._nbt_type,
				$.macro,
			),

		_key_value_pair: ($) =>
			seq(
				$.compound_identifier,
				optional($._space),
				choice("=", ":"),
				optional("!"),
				optional($._space),
				$.compound_value,
			),

		_nbt_type: ($) => choice($.nbt_compound, $.nbt_list, $.nbt_typed_array),

		nbt_compound: ($) => ARRAY($, "{", "}", $._key_value_pair),
		nbt_list: ($) => ARRAY($, "[", "]", $.compound_value),
		nbt_typed_array: ($) =>
			seq(
				"[",
				choice("B", "I", "L"),
				";",
				optional(
					seq(
						optional($._space),
						$.integer,
						repeat(
							seq(
								optional($._space),
								",",
								optional($._space),
								$.integer,
							),
						),
						optional($._space),
					),
				),
				"]",
			),

		// ————————————————————————————————

		selector: ($) =>
			choice(
				seq(
					choice("@s", "@a", "@e", "@p", "@n", "@r", "*", $.word),
					optional(
						choice(
							ARRAY($, "[", "]", $._key_value_pair),
							// FIXME: This is a bandage rather than an actual fix to $.path
							// only taking place when "." is inside
							seq("[", $.number, "]"),
						),
					),
				),
				seq($.macro, ARRAY($, "[", "]", $._key_value_pair)),
			),

		path: ($) =>
			seq(
				choice(/[a-zA-Z_]+\./, seq($.macro, ".")),
				repeat1(
					seq(
						choice(
							$.string,
							seq(
								choice(/[a-zA-Z0-9_]+/, $.macro),
								optional(
									choice(
										seq(
											"[",
											choice($.number, $.macro),
											"]",
										),
										$.nbt_compound,
									),
								),
							),
						),
						optional("."),
					),
				),
			),

		// ————————————————————————————————
	},
});
