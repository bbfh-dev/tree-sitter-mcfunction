const PREC_COMPOSITE = 4;

module.exports = {
	_composite_type: ($) => choice($.range, $.typed_number),

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
};
