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
			$.entity_selector,
			$.item_selector,
			$.block_selector,
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
			token(prec(2, "minecraft:")),
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
		seq(
			choice($.macro, $.identifier, $.score_holder, $.path),
			token(prec(2, ":")),
		),

	_resource_segment: ($) =>
		choice($.macro, alias(/[0-9a-zA-Z_\-\+\.\*\?]+/, $.identifier)),

	path: ($) => seq($._path_node, repeat1(seq(".", $._path_node))),

	_path_node: ($) =>
		choice(
			$.identifier,
			$.macro,
			$.string,
			alias($.argument_keyword, $.identifier),
			alias($.subcommand_keyword, $.identifier),
		),

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
			choice(
				seq($.key, optional($._whitespace), ":"),
				seq($.key, optional($._whitespace), seq("=", optional("!"))),
			),
			optional($._whitespace),
			$._snbt_value,
		),

	key: ($) =>
		choice(
			$.macro,
			token(prec(2, /[0-9a-zA-Z\-\+\.\*\?_]+/)),
			$._resource,
			$.string,
		),

	_snbt_value: ($) =>
		choice(
			$.macro,
			$._primitive_type,
			$.range,
			$.typed_number,
			$.snbt_array,
			$.snbt_compound,
		),

	data_compound: ($) => seq("[", list($, $.data_key_value_pair), "]"),

	data_key_value_pair: ($) =>
		seq(
			$.key,
			optional($._whitespace),
			"=",
			optional("!"),
			optional($._whitespace),
			$._data_value,
		),

	_data_value: ($) => choice($._snbt_value, $._resource),

	entity_selector: ($) =>
		seq(alias(/@[a-z]/, $.identifier), optional($.data_compound)),

	item_selector: ($) => seq($.selector_identifier, $.data_compound),

	block_selector: ($) =>
		seq($.selector_identifier, optional($.data_compound), $.snbt_compound),

	selector_identifier: ($) =>
		choice($._resource, $.score_holder, $.identifier),
};
