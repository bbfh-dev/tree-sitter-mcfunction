module.exports = {
	// — — — — Primitive datatypes:

	boolean: (_) => token(choice("true", "false")),

	integer: (_) => token(prec(3, /-?\d+/)),
	float: (_) => token(prec(3, choice(/-?\.\d+/, /-?\d+\.\d+/))),
	number: ($) => prec(2, choice($.integer, $.float)),

	unit_symbol: (_) => token(prec(3, /[BbSsLlFfDdt]/)),
	number_with_unit: ($) => prec(2, seq($.number, $.unit_symbol)),
	hexadecimal: (_) => token(prec(3, /0x[A-Fa-f0-9]+/)),

	// — — — — Compound datatypes:

	range: ($) =>
		choice(
			seq($.number, "..", $.number),
			seq($.number, ".."),
			seq("..", $.number),
		),

	vector_tilde: ($) => prec.left(seq("~", optional($.number))),
	vector_caret: ($) => prec.left(seq("^", optional($.number))),

	// — — — — Strings:

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

	word: (_) => token(/\.?[-+_a-zA-Z_][-+_a-zA-Z_0-9]*/),

	plain_string: ($) =>
		prec(0, choice(seq(optional("#"), $.word), seq("#", $.macro))),

	uuid: (_) =>
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

	// — — — — Command specific:

	resource_identifier: ($) =>
		seq(
			optional("#"),
			choice($.word, $.macro),
			":",
			choice($.word, $.macro),
		),

	resource: ($) =>
		seq(
			choice($.resource_identifier, "./"),
			repeat(choice("/", $.macro, $.word, /[*?]/)),
		),

	operation: (_) =>
		token(choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),

	nbt_path_slice: ($) => seq($.word, "[", optional($.compound_value), "]"),

	nbt_path_identifier: ($) =>
		prec(
			1,
			choice(
				$.word,
				$.macro,
				$.string,
				$.data_compound,
				$.command_keyword,
			),
		),

	nbt_path: ($) =>
		prec(
			1,
			seq(
				$.nbt_path_identifier,
				repeat1(
					seq(".", choice($.nbt_path_identifier, $.nbt_path_slice)),
				),
			),
		),

	// — — — — — — — —
};
