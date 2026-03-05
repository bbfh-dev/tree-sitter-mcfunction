module.exports = {
	// — — — — Literals:

	boolean: (_) => token(prec(4, choice("true", "false"))),

	integer: (_) => token(prec(4, /-?\d+/)),
	float: (_) => token(prec(4, choice(/-?\d+\.\d+/, /-?\.\d+/))),

	_hexadecimal: (_) => token(prec(4, /0x[A-Fa-f0-9]+/)),
	hexadecimal: ($) => choice($._hexadecimal, seq("0x", $.macro)),

	number: ($) =>
		choice(
			$.float,
			$.integer,
			seq("-", optional("."), $.macro),
			seq($.integer, ".", $.macro),
			seq($.macro, ".", $.integer),
		),

	measurement_unit: (_) => prec(4, /[tmhBbSsLlFfDd]/),
	number_with_unit: ($) =>
		prec(3, seq(choice($.number, $.macro), $.measurement_unit)),

	// — — — — Strings:

	greedy_string: ($) => repeat1(choice($.macro, /[^\r\n]+/)),

	escape_sequence: (_) =>
		seq("\\", token.immediate(choice("r", "n", "t", "0", "'", '"', "\\"))),

	_double_quoted_string: ($) =>
		seq(
			'"',
			repeat(choice(/[^"]/, $.escape_sequence, $.macro)),
			token.immediate('"'),
		),

	_single_quoted_string: ($) =>
		seq(
			"'",
			repeat(choice(/[^']/, $.escape_sequence, $.macro)),
			token.immediate("'"),
		),

	string: ($) => choice($._double_quoted_string, $._single_quoted_string),

	// uuid: ($) =>
	// 	seq(
	// 		choice(/[A-Fa-f0-9]{1,8}/, $.macro),
	// 		token.immediate("-"),
	// 		choice(/[A-Fa-f0-9]{1,4}/, $.macro),
	// 		token.immediate("-"),
	// 		choice(/[A-Fa-f0-9]{1,4}/, $.macro),
	// 		token.immediate("-"),
	// 		choice(/[A-Fa-f0-9]{1,4}/, $.macro),
	// 		token.immediate("-"),
	// 		choice(/[A-Fa-f0-9]{1,12}/, $.macro),
	// 	),

	plain_string: ($) =>
		token(choice("*", /[#\$%\^]?[\-\+\._A-Za-z][\-\+_A-Za-z0-9]*/)),

	// — — — — — — — —
};
