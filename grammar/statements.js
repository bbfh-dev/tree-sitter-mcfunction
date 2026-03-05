module.exports = {
	// — — — — Comments:

	comment_header: ($) => seq("#>", $._comment_contents),

	comment_call: ($) =>
		seq("#~>", $.identifier, optional(seq($._space, $.greedy_string))),

	comment_preprocessor: ($) =>
		seq("#:", $.identifier, optional(seq($._space, $.greedy_string))),

	comment: ($) => seq("#", $._comment_contents),

	// — — — — Comment arguments:

	_comment_contents: (_) => /[^\r\n]*/,

	// — — — — Commands:

	say_command: ($) => seq("say", $._space, $.greedy_string),

	return_command: ($) => seq("return run", $._space, $._command_statement),

	execute_command: ($) =>
		seq(
			"execute",
			repeat(
				seq(
					$._space,
					choice($._command_argument, $.subcommand_keyword),
				),
			),
			optional(seq($._space, "run", $._space, $._command_statement)),
		),

	command: ($) =>
		seq(
			$.command_identifier,
			repeat(
				seq($._space, choice($._command_argument, $.command_keyword)),
			),
		),

	command_identifier: ($) => $.identifier,

	_command_statement: ($) =>
		choice($.execute_command, $.say_command, $.return_command, $.command),

	// — — — — Command arguments:

	_command_argument: ($) =>
		choice(
			$.boolean,
			$.uuid,
			$.number_with_unit,
			$.number,
			$.hexadecimal,
			$.string,
			$.plain_string,
			$.vector_tilde,
			$.vector_caret,
			$.operation,
			$.range,
		),

	// — — — — — — — —
};
