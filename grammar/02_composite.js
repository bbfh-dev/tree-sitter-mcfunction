function list($, item) {
	return seq(
		optional($._whitespace),
		item,
		repeat(
			seq(optional($._whitespace), ",", optional($._whitespace), item),
		),
		optional(seq(",", $.backslash)),
		optional($._whitespace),
	);
}

module.exports = {
	_composite_type: ($) =>
		choice(
			$.typed_number,
			$.vector,
			$.range,
			$._resource,
			$.path,
			$.snbt_array,
			$.snbt_compound,
			// $.entity_selector,
			// $.data_selector,
		),

	typed_number: ($) =>
		seq(
			$._number,
			alias(token(prec(1, /[thBbSsLlDdFf]/)), $.measurement_unit),
		),

	vector: ($) =>
		choice(seq("~", optional($._number)), seq("^", optional($._number))),

	range: ($) =>
		choice(
			seq($._number, token.immediate(prec(2, ".."))),
			seq(token(prec(2, "..")), $._number),
			prec(1, seq($._number, token.immediate(prec(2, "..")), $._number)),
		),

	_resource: ($) => choice($.minecraft_resource, $.generic_resource),

	minecraft_resource: ($) =>
		seq(
			token(prec(1, "minecraft:")),
			$.identifier,
			repeat(seq("/", $.identifier)),
		),

	generic_resource: ($) =>
		choice(
			seq(
				"./",
				$._resource_segment,
				repeat(seq("/", $._resource_segment)),
			),
			seq(
				$.namespace,
				$._resource_segment,
				repeat(seq("/", $._resource_segment)),
			),
		),

	namespace: ($) =>
		seq(choice($.macro, $.identifier, $.score_holder, $.path), ":"),

	_resource_segment: ($) =>
		choice($.macro, alias(/[0-9a-zA-Z_\-\+\.\*\?]+/, $.identifier)),

	path: ($) =>
		seq($._path_node, repeat1(seq(token(prec(1, ".")), $._path_node))),

	_path_node: ($) => choice($.identifier, $.macro, $.string),

	snbt_array: ($) =>
		seq(
			"[",
			optional(seq(alias(token(prec(1, /[A-Z]/)), $.array_type), ";")),
			list($, $._snbt_value),
			"]",
		),

	snbt_compound: ($) => seq("{", list($, $.snbt_key_value_pair), "}"),

	snbt_key_value_pair: ($) =>
		seq(
			$.key,
			optional($._whitespace),
			":",
			optional($._whitespace),
			$._snbt_value,
		),

	key: ($) =>
		choice(
			$.macro,
			token(prec(2, /[0-9a-zA-Z\-\+\.\*\?_\/]+/)),
			$._resource,
			$.string,
		),

	_snbt_value: ($) =>
		choice(
			$.macro,
			$._primitive_type,
			$.typed_number,
			$.snbt_array,
			$.snbt_compound,
		),

	// --------------------------------------------------------------

	// data_selector: ($) =>
	// 	prec(1, seq(choice($.score_holder, $.word), $.data_compound)),
	//
	//
	// path: ($) =>
	// 	choice(
	// 		$._data_path_node,
	// 		seq(
	// 			$._path_node,
	// 			repeat1(seq(token.immediate(prec(1, ".")), $._path_node)),
	// 		),
	// 	),
	//
	// _path_node: ($) =>
	// 	prec(
	// 		2,
	// 		choice(
	// 			alias(token(prec(2, /[0-9a-zA-Z\-\+_]+/)), $.word),
	// 			$._data_path_node,
	// 			$.snbt_array,
	// 			$.snbt_compound,
	// 			$.macro,
	// 			$.word,
	// 			$.string,
	// 			// Keywords:
	// 			alias($.command_keyword, $.word),
	// 			alias($.subcommand_keyword, $.word),
	// 			alias($.color, $.word),
	// 			alias($.scoreboard_objective, $.word),
	// 			alias($.scoreboard_display_slot, $.word),
	// 		),
	// 	),
	//
	// _data_path_node: ($) =>
	// 	prec(1, seq($.word, repeat1(choice($.snbt_compound, $.snbt_array)))),
	//
	// entity_selector: ($) =>
	// 	prec.right(
	// 		seq(
	// 			/@[a-z]/,
	// 			optional(
	// 				choice(
	// 					$.data_compound,
	// 					// NOTE: This is added as a workaround.
	// 					// For @s [...] that can be read as @s[...]
	// 					// (the grammar leaves whitespace up to interpretation in $.extras)
	// 					$.snbt_array,
	// 				),
	// 			),
	// 		),
	// 	),
	//
	// data_compound: ($) =>
	// 	choice(
	// 		seq(
	// 			"[",
	// 			seq(
	// 				$.key,
	// 				$._data_compound_assign,
	// 				$._data_value,
	// 				repeat(
	// 					seq(",", $.key, $._data_compound_assign, $._data_value),
	// 				),
	// 			),
	// 			optional(","),
	// 			"]",
	// 		),
	// 		seq(
	// 			"{",
	// 			seq(
	// 				$.key,
	// 				$._data_compound_assign,
	// 				$._data_value,
	// 				repeat(
	// 					seq(",", $.key, $._data_compound_assign, $._data_value),
	// 				),
	// 			),
	// 			optional(","),
	// 			"}",
	// 		),
	// 	),
	//
	// _data_compound_assign: (_) =>
	// 	token(prec(1, choice(seq("=", optional("!")), "~"))),
	//
	// snbt_array: ($) =>
	// 	seq(
	// 		"[",
	// 		optional(seq(alias(token(prec(1, /[A-Z]/)), $.array_type), ";")),
	// 		optional(seq($._value, repeat(seq(",", $._value)))),
	// 		optional(","),
	// 		"]",
	// 	),
	//
	// snbt_compound: ($) =>
	// 	seq(
	// 		"{",
	// 		optional(
	// 			seq(
	// 				$.key,
	// 				":",
	// 				$._value,
	// 				repeat(seq(",", $.key, ":", $._value)),
	// 			),
	// 		),
	// 		optional(","),
	// 		"}",
	// 	),
	//
	// key: ($) =>
	// 	choice(
	// 		$.macro,
	// 		$._resource,
	// 		alias(token(prec(1, /[0-9a-zA-Z\-\+\.\*\?_\/]+/)), $.word),
	// 		$.string,
	// 	),
	//
	// _data_value: ($) =>
	// 	choice(
	// 		$.macro,
	// 		$._primitive_type,
	// 		$.typed_number,
	// 		$._resource,
	// 		$.range,
	// 		$.path,
	// 		$.snbt_array,
	// 		$.snbt_compound,
	// 		$.data_compound,
	// 	),
	//
	// _value: ($) =>
	// 	choice(
	// 		$.macro,
	// 		$._primitive_type,
	// 		$.typed_number,
	// 		$.path,
	// 		$.snbt_array,
	// 		$.snbt_compound,
	// 	),
};
