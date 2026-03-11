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
			seq($._range_segment, token.immediate(prec(5, ".."))),
			seq(token(prec(5, "..")), $._range_segment),
			prec(
				PREC_COMPOSITE,
				seq(
					$._range_segment,
					token.immediate(prec(5, "..")),
					$._range_segment,
				),
			),
		),

	_range_segment: ($) => prec(PREC_COMPOSITE, choice($._number, $.macro)),

	typed_number: ($) =>
		prec(
			PREC_COMPOSITE,
			seq(
				choice($._number, $.macro),
				token.immediate(prec(4, /[thBbSsLlDdFf]/)),
			),
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
			seq(
				optional("#"),
				choice(
					$.word,
					$.path_word,
					seq(
						$._path_segment,
						repeat1(seq(token(prec(4, ".")), $._path_segment)),
					),
				),
			),
		),

	_path_segment: ($) =>
		prec(
			PREC_COMPOSITE,
			choice($.path_word, $.nbt_array, $.nbt_compound, $.integer),
		),

	path_word: (_) =>
		token(
			prec(
				1,
				choice(
					/[a-zA-Z_\-\+\*\?\$%][0-9a-zA-Z_\-\+\*\?%]*/,
					/[a-zA-Z_\-\+\*\?%]/,
				),
			),
		),

	resource: ($) => choice($.minecraft_resource, $.generic_resource),

	minecraft_resource: ($) => prec(PREC_COMPOSITE, seq("minecraft:", $.word)),

	generic_resource: ($) =>
		prec.right(
			PREC_COMPOSITE,
			seq(
				choice(
					seq(optional("#"), $.namespace, ":"),
					alias(/\.+\//, $.path_word),
				),
				$._resource_segment,
				repeat(seq("/", $._resource_segment)),
			),
		),

	_resource_segment: ($) => choice($.word, $.path_word, $.macro),

	namespace: ($) =>
		seq(
			$._resource_segment,
			repeat(seq(token(prec(5, ".")), $._resource_segment)),
		),

	nbt_array: ($) =>
		seq(
			"[",
			optional(seq($.nbt_array_type, ";")),
			optional(ARRAY_CONTENTS($._compound_value)),
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
			$._compound_value,
		),

	compound_key: ($) =>
		prec(PREC_COMPOSITE, choice($.path_word, $.resource, $.string)),

	_compound_value: ($) =>
		choice($._primitive_type, $.nbt_array, $.nbt_compound),
};
