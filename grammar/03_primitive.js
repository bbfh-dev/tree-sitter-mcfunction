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
			alias($.identifier, $.word),
		),

	boolean: (_) => token(prec(1, choice("true", "false"))),

	integer: ($) =>
		choice(
			token(prec(1, /-?\d+/)),
			prec(1, seq(token(prec(1, "-")), $.macro)),
		),

	float: ($) =>
		choice(
			token(prec(1, choice(/-?\d+\.\d+/, /-?\.\d+/))),
			prec(1, seq(token(prec(1, /-?\d+/)), ".", $.macro)),
			prec(
				1,
				seq(
					optional(token(prec(1, "-"))),
					$.macro,
					token(prec(1, /\.\d+/)),
				),
			),
		),

	_number: ($) => choice($.integer, $.float, $.macro),

	hexadecimal: ($) =>
		choice(
			token(prec(1, /0x[0-9a-fA-F]+/)),
			prec(1, seq(token(prec(1, /0x/)), $.macro)),
		),

	uuid_12_segment: (_) => token(prec(1, /[0-9a-fA-F]{12}/)),
	uuid_8_segment: (_) => token(prec(1, /[0-9a-fA-F]{8}/)),
	uuid_4_segment: (_) => token(prec(1, /[0-9a-fA-F]{4}/)),
	uuid: ($) =>
		prec(
			1,
			seq(
				choice(
					seq(
						choice($.uuid_8_segment, "0", $.macro),
						token.immediate("-"),
					),
					token(prec(1, "0-")),
				),
				choice($.uuid_4_segment, "0", $.macro),
				token.immediate("-"),
				choice($.uuid_4_segment, "0", $.macro),
				token.immediate("-"),
				choice($.uuid_4_segment, "0", $.macro),
				token.immediate("-"),
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
			seq(token(prec(1, "-")), /[_\.\+a-zA-Z][_\.\-\+0-9a-zA-Z]*/),
			seq(choice("#", "$", "%"), choice(/[_\.\-\+0-9a-zA-Z]+/, $.macro)),
		),
};
