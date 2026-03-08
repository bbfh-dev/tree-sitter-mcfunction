const PREC_BUILTIN = 4;

module.exports = {
	_primitive_type: ($) =>
		choice($.boolean, $.float, $.integer, $.hexadecimal, $.uuid, $.string),

	boolean: (_) => token(prec(PREC_BUILTIN, choice("true", "false"))),

	integer: ($) =>
		choice(
			token(prec(PREC_BUILTIN, /\d+/)),
			prec(PREC_BUILTIN, seq("-", $.macro)),
		),

	float: ($) =>
		choice(
			token(prec(PREC_BUILTIN, /\d+\.\d+/)),
			token(prec(PREC_BUILTIN, /\.\d+/)),
			prec(PREC_BUILTIN, seq(/\d+\./, $.macro)),
			prec(PREC_BUILTIN, seq(optional("-"), $.macro, /\.\d+/)),
		),

	hexadecimal: ($) =>
		choice(
			token(prec(PREC_BUILTIN, /0x[0-9a-fA-F]+/)),
			prec(PREC_BUILTIN, seq(/0x/, $.macro)),
		),

	uuid_12_segment: (_) => token(prec(PREC_BUILTIN, /[0-9a-fA-F]{12}/)),
	uuid_8_segment: (_) => token(prec(PREC_BUILTIN, /[0-9a-fA-F]{8}/)),
	uuid_4_segment: (_) => token(prec(PREC_BUILTIN, /[0-9a-fA-F]{4}/)),

	uuid: ($) =>
		prec(
			PREC_BUILTIN,
			seq(
				choice(
					seq(
						choice($.uuid_8_segment, "0", $.macro),
						token.immediate("-"),
					),
					token(prec(PREC_BUILTIN, "0-")),
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

	greedy_string: (_) => /[^\r\n]+/,

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
		prec(
			PREC_BUILTIN,
			seq(
				'"',
				repeat(choice($.escape_sequence, /[^\\"]/, $.macro)),
				token.immediate('"'),
			),
		),

	_single_quoted_string: ($) =>
		prec(
			PREC_BUILTIN,
			seq(
				"'",
				repeat(choice($.escape_sequence, /[^\\']/, $.macro)),
				token.immediate("'"),
			),
		),

	string: ($) => choice($._double_quoted_string, $._single_quoted_string),
};
