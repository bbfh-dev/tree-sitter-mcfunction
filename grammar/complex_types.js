module.exports = {
	vector_tilde: ($) => prec.right(2, seq("~", optional($.number))),
	vector_caret: ($) => prec.right(2, seq("^", optional($.number))),

	_range_token: ($) => prec(1, choice($.number, $.macro)),

	range: ($) =>
		prec.right(
			choice(
				seq($._range_token, ".."),
				seq("..", $._range_token),
				seq($._range_token, "..", $._range_token),
			),
		),
};
