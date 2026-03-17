module.exports = {
	comment: ($) =>
		choice(
			seq(
				"#~>",
				alias($.identifier, $.command_identifier),
				optional(seq($._whitespace, $.greedy_string)),
			),
			seq(
				"#:",
				alias($.identifier, $.command_identifier),
				optional(seq($._whitespace, $.greedy_string)),
			),
			seq("#>", optional($.greedy_string)),
			seq("#", optional($.greedy_string)),
		),

	command: ($) =>
		seq(
			optional(alias("$", $.macro_sign)),
			choice(
				seq(
					alias(token(prec(2, "return run")), $.command_identifier),
					$._whitespace,
					$.command,
				),
				seq(
					alias(token(prec(2, "say")), $.command_identifier),
					$._whitespace,
					$.greedy_string,
				),
				$._execute_command,
				$._generic_command,
			),
		),

	_execute_command: ($) =>
		seq(
			alias(token(prec(2, "execute")), $.command_identifier),
			repeat(
				seq(
					$._whitespace,
					choice($._command_argument, $.subcommand_keyword),
				),
			),
			optional(
				seq(
					$._whitespace,
					alias(token(prec(2, "run")), $.argument_keyword),
					$._whitespace,
					$.command,
				),
			),
		),

	_generic_command: ($) =>
		seq(
			$.command_identifier,
			repeat(
				seq(
					$._whitespace,
					choice($._command_argument, $.argument_keyword),
				),
			),
		),

	command_identifier: (_) => /[a-z_]+/,

	_command_argument: ($) =>
		choice(
			$.macro,
			$._keywords,
			$.operation,
			$._composite_type,
			$._primitive_type,
		),
};
