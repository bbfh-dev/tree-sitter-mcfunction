module.exports = {
	// — — — — Literals:

	score_holder: ($) =>
		token(prec(2, choice("*", /[-+.#$%^]?-?[._A-Za-z0-9]+/))),

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
		seq($.compound_key, choice(":", "=", "~"), optional("!"), $._value),

	compound_key: ($) => choice($.macro, $.word),

	_value: ($) =>
		choice(
			$.macro,
			$.nbt_compound,
			$.nbt_array,
			$.boolean,
			$.number,
			$.string,
			$.hexadecimal,
			$.number_with_unit,
			$.word,
		),

	// — — — — — — — —
};
