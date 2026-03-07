module.exports = {
	// — — — — Literals:

	score_holder: ($) =>
		token(
			prec(
				2,
				choice("*", /--[-+.#$%._A-Za-z0-9]+/, /[+.#$%][_A-Za-z0-9]+/),
			),
		),

	vector_tilde: ($) => prec.right(2, seq("~", optional($.number))),
	vector_caret: ($) => prec.right(2, seq("^", optional($.number))),

	_range_token: ($) => prec(4, choice($.number, $.macro)),

	range: ($) =>
		choice(
			token(
				prec(
					3,
					choice(
						/-?(\d*\.)?\d+\.\./,
						/\.\.-?(\d*\.)?\d+/,
						/-?(\d*\.)?\d+\.\.-?(\d*\.)?\d+/,
					),
				),
			),
			prec.right(2, seq($.macro, "..")),
			prec.right(2, seq("..", $.macro)),
			prec.right(2, seq($.macro, "..", $.macro)),
			prec.right(2, seq($.number, "..")),
			prec.right(2, seq("..", $.number)),
			prec.right(2, seq($.number, "..", $.number)),
		),

	// — — — — sNBT:

	path: ($) =>
		prec(2, seq($._path_segment, repeat1(seq(".", $._path_segment)))),

	_path_segment: ($) => prec(2, choice($.word, $.score_holder)),

	nbt_array: ($) =>
		seq(
			"[",
			optional(seq(alias($.word, $.array_type), ";")),
			seq($._value, repeat(seq(",", $._value))),
			"]",
		),

	nbt_compound: ($) =>
		seq(
			"{",
			seq($._key_value_pair, repeat(seq(",", $._key_value_pair))),
			"}",
		),

	_key_value_pair: ($) =>
		seq(
			$.compound_key,
			alias(choice(":", "=", "~"), $.key_value_assign),
			optional("!"),
			$._value,
		),

	compound_key: ($) => choice($.macro, $.string, $.word),

	_value: ($) =>
		choice(
			$.macro,
			$.nbt_compound,
			$.nbt_array,
			$.boolean,
			$.range,
			$.number,
			$.string,
			$.hexadecimal,
			$.number_with_unit,
			$.vector_tilde,
			$.vector_caret,
			$.word,
		),

	// — — — — — — — —
};
