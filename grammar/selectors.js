module.exports = {
	// — — — — — — — —

	item_selector: ($) => seq($.selector_identifier, $.component_compound),

	block_selector: ($) =>
		seq(
			$.selector_identifier,
			optional($.component_compound),
			$.data_compound,
		),

	entity_selector: ($) =>
		seq($.target_identifier, optional($.component_compound)),

	target_identifier: (_) => /@[a-z]/,

	selector_identifier: ($) => choice($.resource_identifier, $.plain_string),

	// — — — — — — — —
};
