module.exports = {
	// — — — — sNBT:

	path: ($) => seq($._path_segment, repeat1(seq(".", $._path_segment))),

	_path_segment: ($) => choice($.word),

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
			$.uuid,
			$.macro,
			$.nbt_compound,
			$.nbt_array,
			$.boolean,
			$.number,
			$.number_with_unit,
			$.hexadecimal,
			$.word,
		),

	// — — — — — — — —
};
