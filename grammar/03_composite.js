const ARRAY_CONTENTS = (element) => seq(element, repeat(seq(",", element)));

module.exports = {
	_composite_type: ($) =>
		choice(
			$.typed_number,
			$.vector,
			$.range,
			$.path,
			$._resource,
			$.snbt_array,
			$.snbt_compound,
			$.entity_selector,
			$.data_selector,
		),

	data_selector: ($) =>
		prec(1, seq(choice($.score_holder, $.word), $.data_compound)),

	typed_number: ($) =>
		seq(
			$._number,
			alias(
				token.immediate(prec(2, /[thBbSsLlDdFf]/)),
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
			seq($._number, token.immediate(prec(2, ".."))),
			seq(token(prec(2, "..")), $._number),
			prec(1, seq($._number, token.immediate(prec(2, "..")), $._number)),
		),

	path: ($) =>
		choice(
			$._data_path_node,
			seq(
				$._path_node,
				repeat1(seq(token.immediate(prec(1, ".")), $._path_node)),
			),
		),

	_path_node: ($) =>
		prec(
			2,
			choice(
				$._data_path_node,
				$.snbt_array,
				$.snbt_compound,
				$.macro,
				$.word,
				$.string,
				$.command_keyword,
				// Keywords:
				alias($.color, $.word),
				alias($.scoreboard_objective, $.word),
				alias($.scoreboard_display_slot, $.word),
			),
		),

	_data_path_node: ($) =>
		prec(1, seq($.word, repeat1(choice($.snbt_compound, $.snbt_array)))),

	entity_selector: ($) =>
		prec.right(
			seq(
				/@[a-z]/,
				optional(
					choice(
						$.data_compound,
						// NOTE: This is added as a workaround.
						// For @s [...] that can be read as @s[...]
						// (the grammar leaves whitespace up to interpretation in $.extras)
						$.snbt_array,
					),
				),
			),
		),

	_resource: ($) =>
		prec.right(
			seq(
				choice($.minecraft_resource, $.generic_resource),
				optional(choice($.data_compound, $.snbt_compound)),
			),
		),

	minecraft_resource: ($) =>
		seq(token(prec(1, "minecraft:")), $.word, repeat(seq("/", $.word))),

	generic_resource: ($) =>
		choice(
			seq(
				"#",
				$._resource_segment,
				repeat1(seq("/", $._resource_segment)),
			),
			seq(
				choice(
					alias($.word, $.namespace),
					alias($.score_holder, $.namespace),
					alias($.path, $.namespace),
				),
				":",
				$._resource_segment,
				repeat(seq("/", $._resource_segment)),
			),
			seq(
				"./",
				$._resource_segment,
				repeat(seq("/", $._resource_segment)),
			),
		),

	_resource_segment: ($) =>
		choice($.macro, alias(/[0-9a-zA-Z\-\+\.\*\?_]+/, $.word)),

	data_compound: ($) =>
		choice(
			seq(
				"[",
				seq(
					$.key,
					$._data_compound_assign,
					$._data_value,
					repeat(
						seq(",", $.key, $._data_compound_assign, $._data_value),
					),
				),
				optional(","),
				"]",
			),
			seq(
				"{",
				seq(
					$.key,
					$._data_compound_assign,
					$._data_value,
					repeat(
						seq(",", $.key, $._data_compound_assign, $._data_value),
					),
				),
				optional(","),
				"}",
			),
		),

	_data_compound_assign: (_) =>
		token(prec(1, choice(seq("=", optional("!")), "~"))),

	snbt_array: ($) =>
		seq(
			"[",
			optional(seq(alias(token(prec(1, /[A-Z]/)), $.array_type), ";")),
			optional(seq($._value, repeat(seq(",", $._value)))),
			optional(","),
			"]",
		),

	snbt_compound: ($) =>
		seq(
			"{",
			optional(
				seq(
					$.key,
					":",
					$._value,
					repeat(seq(",", $.key, ":", $._value)),
				),
			),
			optional(","),
			"}",
		),

	key: ($) =>
		choice(
			$.macro,
			$._resource,
			alias(token(prec(1, /[0-9a-zA-Z\-\+\.\*\?_\/]+/)), $.word),
			$.string,
		),

	_data_value: ($) =>
		choice(
			$.macro,
			$._primitive_type,
			$.typed_number,
			$._resource,
			$.range,
			$.path,
			$.snbt_array,
			$.snbt_compound,
			$.data_compound,
		),

	_value: ($) =>
		choice(
			$.macro,
			$._primitive_type,
			$.typed_number,
			$.path,
			$.snbt_array,
			$.snbt_compound,
		),
};
