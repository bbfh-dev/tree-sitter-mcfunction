/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

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
			$._resource_segment,
			repeat(seq("/", $._resource_segment)),
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
			seq($.word, repeat1(seq("/", $._resource_segment))),
		),

	namespace: ($) =>
		seq(
			choice($.macro, $.word, $.score_holder, $.path),
			token(prec(2, ":")),
		),

	_resource_segment: ($) =>
		seq($._resource_segment_word, repeat($._resource_segment_word)),

	_resource_segment_word: ($) =>
		choice($.macro, alias(/[0-9a-zA-Z_\-\+\.\*\?]+/, $.word)),

	path: ($) =>
		choice(
			seq($._path_node, repeat1(seq(".", $._path_node))),
			$._data_path_node,
		),

	_data_path_node: ($) =>
		seq(
			choice($._word, $.macro),
			choice(
				$.snbt_array,
				$.snbt_compound,
				seq($.snbt_array, choice($.snbt_array, $.snbt_compound)),
			),
		),

	_path_node: ($) =>
		choice(
			$.macro,
			$.string,
			$._data_path_node,
			$.snbt_array,
			$.snbt_compound,
			$._word,
			"execute",
			"run",
			"say",
			// item slots:
			"container",
			"hotbar",
			"inventory",
			"enderchest",
			"villager",
			"horse",
			"player.crafting",
			"contents",
			"weapon",
			"weapon.offhand",
			"weapon.mainhand",
			"armor.head",
			"armor.chest",
			"armor.legs",
			"armor.feet",
			"armor.body",
			"horse.saddle",
			"horse.chest",
			"player.cursor",
		),

	_word: ($) => choice(alias($.integer, $.word), $.word),

	snbt_array: ($) =>
		seq(
			"[",
			optional(seq(alias(token(prec(1, /[A-Z]/)), $.array_type), ";")),
			optional(list($, $._snbt_value)),
			"]",
		),

	snbt_compound: ($) =>
		seq("{", optional(list($, $.snbt_key_value_pair)), "}"),

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
			$.path,
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
		seq(alias(/@[a-z]/, $.word), optional($.data_compound)),

	item_selector: ($) => seq($.selector_identifier, $.data_compound),

	block_selector: ($) =>
		seq($.selector_identifier, optional($.data_compound), $.snbt_compound),

	selector_identifier: ($) => choice($._resource, $.score_holder, $.word),
};
