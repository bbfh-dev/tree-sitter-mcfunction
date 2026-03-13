const ARRAY_CONTENTS = (element) => seq(element, repeat(seq(",", element)));

module.exports = {
	_composite_type: ($) =>
		choice(
			$.typed_number,
			$.vector,
			$.range,
			$.path,
			// $.resource,
			// $.nbt_array,
			// $.nbt_compound,
			// $.data_compound,
		),

	typed_number: ($) =>
		seq(
			$._number,
			alias(
				token.immediate(prec(1, /[thBbSsLlDdFf]/)),
				$.measurement_unit,
			),
		),

	vector: ($) =>
		prec.right(
			choice(
				seq("~", optional($._number)),
				seq("^", optional($._number)),
			),
		),

	range: ($) =>
		choice(
			seq($._number, token.immediate(prec(1, ".."))),
			seq(token(prec(1, "..")), $._number),
			prec(1, seq($._number, token.immediate(prec(1, "..")), $._number)),
		),

	path: ($) =>
		choice(
			// $.data_path_node,
			seq(
				$._path_node,
				repeat1(seq(token.immediate(prec(1, ".")), $._path_node)),
			),
		),

	_path_node: ($) =>
		prec(
			1,
			choice(
				// $._data_path_node,
				$.macro,
				$.word,
				$.string,
			),
		),

	_data_path_node: ($) => choice(),
	// $.nbt_compound,
	// seq($.word, $.nbt_compound),
	// $.nbt_array,
	// seq($.word, $.nbt_array, optional($.nbt_array)),

	// path: ($) =>
	// 	prec(
	// 		PREC_COMPOSITE,
	// 		seq(
	// 			optional("#"),
	// 			choice(
	// 				$.word,
	// 				$.path_word,
	// 				seq(
	// 					$._path_segment,
	// 					repeat1(seq(token(prec(4, ".")), $._path_segment)),
	// 				),
	// 			),
	// 		),
	// 	),
	//
	// _path_segment: ($) =>
	// 	prec(
	// 		PREC_COMPOSITE,
	// 		choice($.path_word, $.nbt_array, $.nbt_compound, $.integer),
	// 	),
	//
	// path_word: (_) =>
	// 	token(
	// 		prec(
	// 			1,
	// 			choice(
	// 				/[a-zA-Z_\-\+\*\?\$%][0-9a-zA-Z_\-\+\*\?%]*/,
	// 				/[a-zA-Z_\-\+\*\?%]/,
	// 			),
	// 		),
	// 	),
	//
	// resource: ($) => choice($.minecraft_resource, $.generic_resource),
	//
	// minecraft_resource: ($) => prec(PREC_COMPOSITE, seq("minecraft:", $.word)),
	//
	// generic_resource: ($) =>
	// 	prec.right(
	// 		PREC_COMPOSITE,
	// 		seq(
	// 			choice(
	// 				seq(optional("#"), $.namespace, ":"),
	// 				alias(/\.+\//, $.path_word),
	// 			),
	// 			$._resource_segment,
	// 			repeat(seq("/", $._resource_segment)),
	// 		),
	// 	),
	//
	// _resource_segment: ($) => choice($.word, $.path_word, $.macro),
	//
	// namespace: ($) =>
	// 	seq(
	// 		$._resource_segment,
	// 		repeat(seq(token(prec(5, ".")), $._resource_segment)),
	// 	),
	//
	// nbt_array: ($) =>
	// 	seq(
	// 		"[",
	// 		optional(seq($.nbt_array_type, ";")),
	// 		optional(ARRAY_CONTENTS($._compound_value)),
	// 		"]",
	// 	),
	//
	// nbt_array_type: (_) => token(prec(PREC_COMPOSITE, /[ISL]/)),
	//
	// nbt_compound: ($) =>
	// 	seq("{", optional(ARRAY_CONTENTS($.key_value_pair)), "}"),
	//
	// data_compound: ($) => seq("[", ARRAY_CONTENTS($.key_value_pair), "]"),
	//
	// key_value_pair: ($) =>
	// 	seq(
	// 		$.compound_key,
	// 		choice("=", ":", "~"),
	// 		optional("!"),
	// 		$._compound_value,
	// 	),
	//
	// compound_key: ($) =>
	// 	prec(PREC_COMPOSITE, choice($.path_word, $.resource, $.string)),
	//
	// _compound_value: ($) =>
	// 	choice($._primitive_type, $.nbt_array, $.nbt_compound),
};
