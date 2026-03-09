const PREC_COMPOSITE = 4;

module.exports = {
	_composite_type: ($) => choice($.range),

	range: ($) =>
		choice(
			seq($._range_token, ".."),
			seq("..", $._range_token),
			prec(PREC_COMPOSITE, seq($._range_token, "..", $._range_token)),
		),

	_range_token: ($) => prec(PREC_COMPOSITE, choice($.integer, $.float)),
};
