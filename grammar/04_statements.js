module.exports = {
	// — — — — Comments:

	comment: ($) =>
		seq(
			choice(
				seq("#~>", $.identifier),
				seq("#:", $.identifier),
				"#>",
				"#",
			),
			$.line,
		),

	// — — — — — — — —
};
