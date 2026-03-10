const PREC_COMPOSITE = 4;

const ARRAY_CONTENTS = (element) => seq(element, repeat(seq(",", element)));

module.exports = {
	_composite_type: ($) =>
		choice(
			$.range,
			$.typed_number,
			$.path,
			$.nbt_array,
			$.nbt_compound,
			$.data_compound,
		),

	range: ($) =>
		choice(
			seq($._number, token.immediate("..")),
			seq(token.immediate(".."), $._number),
			prec(
				PREC_COMPOSITE,
				seq($._number, token.immediate(".."), $._number),
			),
		),

	typed_number: ($) =>
		prec(
			PREC_COMPOSITE,
			seq(choice($._number, $.macro), token.immediate(/[thBbSsLlDdFf]/)),
		),

	_number: ($) => prec(PREC_COMPOSITE, choice($.integer, $.float)),

	path: ($) =>
		prec(
			PREC_COMPOSITE,
			choice(
				$.path_word,
				seq($._path_segment, repeat1(seq(".", $._path_segment))),
			),
		),

	_path_segment: ($) =>
		prec(PREC_COMPOSITE, choice($.path_word, $.nbt_array, $.nbt_compound)),

	path_word: (_) => /[0-9a-zA-Z_\-\+\.]*[0-9a-zA-Z_\-\+]/,

	nbt_array: ($) => seq("[", optional(ARRAY_CONTENTS($.compound_value)), "]"),

	nbt_compound: ($) =>
		seq("{", optional(ARRAY_CONTENTS($.key_value_pair)), "}"),

	data_compound: ($) => seq("[", ARRAY_CONTENTS($.key_value_pair), "]"),

	key_value_pair: ($) =>
		seq(
			$.property_identifier,
			choice("=", ":", "~"),
			optional("!"),
			$.compound_value,
		),

	property_identifier: ($) => choice($.word),

	compound_value: ($) =>
		choice($._primitive_type, $.nbt_array, $.nbt_compound),
};
