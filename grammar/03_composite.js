const PREC_COMPOSITE = 4;

module.exports = {
	_composite_type: ($) => choice($.range, $.typed_number, $.path),

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

	path: ($) => seq($._path_segment, repeat1(seq(".", $._path_segment))),

	_path_segment: ($) => choice($.word),
};
