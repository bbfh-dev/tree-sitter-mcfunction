const PREC_COMPOSITE = 4;

const ARRAY_CONTENTS = (element) => seq(element, repeat(seq(",", element)));

module.exports = {
	_composite_type: ($) =>
		choice(
			$.range,
			$.typed_number,
			$.vector,
			$.path,
			$.resource,
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

	vector: ($) =>
		prec.right(
			choice(
				seq("~", optional($._number)),
				seq("^", optional($._number)),
			),
		),

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

	path_word: (_) =>
		token(
			choice(
				/[\.a-zA-Z_\-\+\*\?\$%#][\.0-9a-zA-Z_\-\+\*\?%]*[0-9a-zA-Z_\-\+\*\?%]/,
				/[a-zA-Z_\-\+\*\?%]/,
			),
		),

	resource: ($) => choice($.minecraft_resource, $.generic_resource),

	minecraft_resource: ($) => prec(PREC_COMPOSITE, seq("minecraft:", $.word)),

	generic_resource: ($) =>
		prec.right(
			PREC_COMPOSITE,
			seq(
				choice(
					seq(optional("#"), $._resource_segment, ":"),
					alias(/\.+\//, $.path_word),
				),
				$._resource_segment,
				repeat(seq("/", $._resource_segment)),
			),
		),

	_resource_segment: ($) => choice($.word, $.path_word, $.macro),

	nbt_array: ($) =>
		seq(
			"[",
			optional(seq($.nbt_array_type, ";")),
			optional(ARRAY_CONTENTS($.compound_value)),
			"]",
		),

	nbt_array_type: (_) => token(prec(PREC_COMPOSITE, /[ISL]/)),

	nbt_compound: ($) =>
		seq("{", optional(ARRAY_CONTENTS($.key_value_pair)), "}"),

	data_compound: ($) => seq("[", ARRAY_CONTENTS($.key_value_pair), "]"),

	key_value_pair: ($) =>
		seq(
			$.compound_key,
			choice("=", ":", "~"),
			optional("!"),
			$.compound_value,
		),

	compound_key: ($) =>
		prec(PREC_COMPOSITE, choice($.path_word, $.resource, $.string)),

	compound_value: ($) =>
		choice($._primitive_type, $.nbt_array, $.nbt_compound),
};
