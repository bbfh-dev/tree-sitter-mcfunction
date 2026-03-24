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
		choice(
			choice(/-?\d+\.\d+/, /-?\.\d+/),
			prec(1, seq(choice("0", /-?\d+/), ".", $.macro)),
			prec(1, seq(optional("-"), $.macro, /\.\d+/)),
		),

	_number: ($) => choice($.integer, $.float, $.macro),

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
					seq(choice($.uuid_8_segment, "0", $.macro), "-"),
					token(prec(1, "0-")),
				),
				choice($.uuid_4_segment, "0", $.macro),
				"-",
				choice($.uuid_4_segment, "0", $.macro),
				"-",
				choice($.uuid_4_segment, "0", $.macro),
				"-",
				choice($.uuid_12_segment, "0", $.macro),
			),
		),

	escape_sequence: (_) =>
		token(
			seq(
				"\\",
				token.immediate(
					choice("r", "n", "t", "v", "0", "'", '"', "\\"),
				),
			),
		),
	_double_quoted_string: ($) =>
		seq(
			'"',
			repeat(choice($.escape_sequence, /[^\\"\$%]+/, $.macro)),
			token.immediate('"'),
		),
	_single_quoted_string: ($) =>
		seq(
			"'",
			repeat(choice($.escape_sequence, /[^\\'\$%]+/, $.macro)),
			token.immediate("'"),
		),
	string: ($) => choice($._double_quoted_string, $._single_quoted_string),

	greedy_string: (_) => /[^\r\n]+/,

	score_holder: ($) =>
		choice(
			"*",
			seq("-", /[_\.\+a-zA-Z][_\.\-\+0-9a-zA-Z]*/),
			seq(choice("#", "$", "%"), choice(/[_\.\-\+0-9a-zA-Z]+/, $.macro)),
		),

	word: ($) => choice(/[\-\+]*[a-zA-Z_][0-9a-zA-Z_]*/, $.identifier),
};
