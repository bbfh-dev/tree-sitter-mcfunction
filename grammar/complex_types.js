module.exports = {
	vector_tilde: ($) => prec(2, seq("~", optional($.number))),
	vector_caret: ($) => prec(2, seq("^", optional($.number))),

	_range_token: ($) => prec(1, choice($.number, $.macro)),

	range: ($) =>
		choice(
			seq($._range_token, ".."),
			seq("..", $._range_token),
			seq($._range_token, "..", $._range_token),
		),
};
