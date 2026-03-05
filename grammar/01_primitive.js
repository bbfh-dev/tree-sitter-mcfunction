module.exports = {
	// — — — — Primitive:

	boolean: (_) => token(prec(4, choice("true", "false"))),

	number: ($) =>
		prec(
			3,
			choice(
				$._float,
				$._integer,
				seq("-", optional("."), $.macro),
				seq($._integer, ".", $.macro),
				seq($.macro, ".", $._integer),
			),
		),

	_integer: (_) => token(prec(3, /-?\d+/)),
	_float: (_) => token(prec(3, choice(/-?\d+\.\d+/, /-?\.\d+/))),

	hexadecimal: ($) =>
		choice(token(prec(3, /0x[A-Fa-f0-9]+/)), seq("0x", $.macro)),

	measurement_unit: (_) => token(prec(3, /[tmhBbSsLlFfDd]/)),
	number_with_unit: ($) =>
		prec(3, seq(choice($.number, $.macro), $.measurement_unit)),

	// — — — — UUIDs:

	uuid: ($) =>
		prec(
			1,
			seq(
				choice($.uuid_hex8, token(prec(3, /0-/)), $.macro),
				optional(token.immediate("-")),
				choice($.uuid_hex4, $.macro),
				token.immediate("-"),
				choice($.uuid_hex4, $.macro),
				token.immediate("-"),
				choice($.uuid_hex4, $.macro),
				token.immediate("-"),
				choice($.uuid_hex12, $.macro),
			),
		),

	uuid_hex8: (_) => token(prec(2, /[A-Fa-f0-9]{1,8}/)),
	uuid_hex4: (_) => token(prec(2, /[A-Fa-f0-9]{1,4}/)),
	uuid_hex12: (_) => token(prec(2, /[A-Fa-f0-9]{1,12}/)),

	// — — — — Strings:

	escape_sequence: (_) =>
		prec(
			5,
			seq(
				"\\",
				token.immediate(choice("r", "n", "t", "0", "'", '"', "\\")),
			),
		),

	_double_quoted_string: ($) =>
		seq(
			'"',
			repeat(choice($.escape_sequence, /[^\\"]/, $.macro)),
			token.immediate('"'),
		),

	_single_quoted_string: ($) =>
		seq(
			"'",
			repeat(choice($.escape_sequence, /[^\\']/, $.macro)),
			token.immediate("'"),
		),

	string: ($) => choice($._double_quoted_string, $._single_quoted_string),

	// — — — — — — — —
};
