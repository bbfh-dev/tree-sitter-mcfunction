module.exports = {
	// — — — — Literals:

	boolean: (_) => token(prec(3, choice("true", "false"))),

	integer: (_) => token(prec(3, /-?\d+/)),
	float: (_) => token(prec(3, choice(/-?\d+\.\d+/, /-?\.\d+/))),

	_hexadecimal: (_) => token(prec(3, /0x[A-Fa-f0-9]+/)),
	hexadecimal: ($) => choice($._hexadecimal, seq("0x", $.macro)),

	number: ($) =>
		choice(
			$.float,
			$.integer,
			seq(optional("-"), optional($.integer), optional("."), $.macro),
		),
	measurement_unit: (_) => prec(4, /[tmhBbSsLlFfDd]/),
	number_with_unit: ($) => prec(2, seq($.number, $.measurement_unit)),

	// — — — — Strings:

	greedy_string: ($) => repeat1(choice($.macro, /[^\r\n]/)),

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

	_basic_uuid: (_) =>
		token(
			prec(
				3,
				seq(
					choice(/0/, /[A-Fa-f0-9]{8}/),
					"-",
					choice(/0/, /[A-Fa-f0-9]{4}/),
					"-",
					choice(/0/, /[A-Fa-f0-9]{4}/),
					"-",
					choice(/0/, /[A-Fa-f0-9]{4}/),
					"-",
					choice(/0/, /[A-Fa-f0-9]{12}/),
				),
			),
		),

	_macro_uuid: ($) =>
		seq(
			choice(/0/, /[A-Fa-f0-9]{8}/, $.macro),
			"-",
			choice(/0/, /[A-Fa-f0-9]{4}/, $.macro),
			"-",
			choice(/0/, /[A-Fa-f0-9]{4}/, $.macro),
			"-",
			choice(/0/, /[A-Fa-f0-9]{4}/, $.macro),
			"-",
			choice(/0/, /[A-Fa-f0-9]{12}/, $.macro),
		),

	uuid: ($) => prec(3, choice($._basic_uuid, $._macro_uuid)),

	// TODO: this is the hardest token to make
	// because it breaks everything else
	plain_string: ($) =>
		choice(
			"*",
			// seq("$", $.identifier, repeat(seq(".", $.identifier))),
			// seq(optional("$"), $.identifier, repeat1(seq(".", $.identifier))),
		),

	// — — — — — — — —
};
