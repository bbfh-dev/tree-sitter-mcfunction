const ARRAY_CONTENTS = (element) => seq(element, repeat(seq(",", element)));

module.exports = {
	_composite_type: ($) =>
		choice(
			$.typed_number,
			$.vector,
			$.range,
			$.path,
			$._resource,
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

	// _data_path_node: ($) => choice(),

	_resource: ($) => choice($.minecraft_resource, $.generic_resource),

	minecraft_resource: ($) => seq("minecraft:", $.word),

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
};
