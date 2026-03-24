/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = {
	_primitive_type: ($) =>
		choice(
			$.boolean,
			$.integer,
			$.float,
			$.hexadecimal,
			$.uuid,
			$.string,
			$.score_holder,
			$.word,
		),

	boolean: (_) => choice("true", "false"),

	integer: ($) => choice("0", /-?\d+/, prec(1, seq("-", $.macro))),

	float: ($) =>
		seq(
			choice(
				seq(choice(/-?\d+\.\d+/, /-?\.\d+/), optional($.macro)),
				prec(1, seq(choice("0", /-?\d+/), ".", $.macro)),
				prec(1, seq(optional("-"), $.macro, /\.\d+/)),
			),
			optional(/[eE]-?\d+/),
		),

	_number: ($) => choice($.integer, $.float, prec(1, $.macro)),

	hexadecimal: ($) =>
		choice(
			token(prec(1, /0x[0-9a-fA-F]+/)),
			prec(1, seq(token(prec(1, /0x/)), $.macro)),
		),

	uuid_12_segment: (_) => /[0-9a-fA-F]{12}/,
	uuid_8_segment: (_) => /[0-9a-fA-F]{8}/,
	uuid_4_segment: (_) => /[0-9a-fA-F]{4}/,
	uuid: ($) =>
		prec(
			1,
			seq(
				choice(
					seq(
						choice(
							$.uuid_8_segment,
							"0",
							$._word_token,
							$.integer,
							$.macro,
						),
						"-",
					),
					token(prec(1, "0-")),
				),
				choice(
					$.uuid_4_segment,
					"0",
					$._word_token,
					$.integer,
					$.macro,
				),
				"-",
				choice(
					$.uuid_4_segment,
					"0",
					$._word_token,
					$.integer,
					$.macro,
				),
				"-",
				choice(
					$.uuid_4_segment,
					"0",
					$._word_token,
					$.integer,
					$.macro,
				),
				"-",
				choice(
					$.uuid_12_segment,
					"0",
					$._word_token,
					$.integer,
					$.macro,
				),
			),
		),

	escape_sequence: (_) =>
		token(seq("\\", choice(/[a-z]/, "0", "'", '"', "\\", /u[0-9a-zA-Z]+/))),

	_double_quoted_string: ($) =>
		seq(
			'"',
			repeat(choice($.escape_sequence, /[^\\"\$%]+/, $.macro, "$", "%")),
			'"',
		),

	_single_quoted_string: ($) =>
		seq(
			"'",
			repeat(choice($.escape_sequence, /[^\\'\$%]+/, $.macro, "$", "%")),
			"'",
		),

	string: ($) => choice($._double_quoted_string, $._single_quoted_string),

	greedy_string: (_) => /[^\r\n]+/,

	score_holder: ($) =>
		choice(
			"*",
			seq("-", /[_\.\+a-zA-Z][_\.\-\+0-9a-zA-Z]*/),
			seq(
				choice("#", "$", "%", ".", "^"),
				repeat1(choice(/[_\.\-\+0-9a-zA-Z]+/, $.macro)),
			),
		),

	_word_overlap: ($) =>
		choice(
			$.argument_keyword,
			$.subcommand_keyword,
			$.color,
			$.scoreboard_objective,
			$.scoreboard_display_slot,
			$.item_slot,
		),

	_word_token: ($) =>
		choice(
			/[\-\+]*[a-zA-Z_][0-9a-zA-Z_]*/,
			/[0-9]+_[0-9a-zA-Z_]*/,
			token(prec(1, /[A-Z][0-9a-zA-Z_]+/)),
			$.identifier,
			$._word_overlap,
		),

	word: ($) =>
		prec.right(
			choice(
				seq(
					$._word_token,
					repeat(
						choice(
							$.macro,
							$._word_token,
							"-",
							$.uuid_4_segment,
							$.uuid_8_segment,
							$.uuid_12_segment,
						),
					),
				),
				seq($.macro, repeat1(choice($.macro, $._word_token))),
				"villager",
				"horse",
			),
		),
};
