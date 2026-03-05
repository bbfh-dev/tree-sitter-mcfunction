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

	// — — — — Commands:

	command_identifier: ($) => $.identifier,

	command: ($) =>
		seq(
			optional("$"),
			choice(
				$._say_command,
				$._return_command,
				$._execute_command,
				$._regular_command,
			),
		),

	_say_command: ($) => seq(alias("say", $.command_identifier), $.line),

	_return_command: ($) =>
		seq(
			alias("return", $.command_identifier),
			alias("run", $.command_keyword),
			$.command,
		),

	_execute_command: ($) =>
		seq(
			alias("execute", $.command_identifier),
			repeat(choice($._command_argument, $.subcommand_keyword)),
			alias("run", $.command_keyword),
			$.command,
		),

	_regular_command: ($) =>
		seq(
			$.command_identifier,
			repeat(choice($._command_argument, $.command_keyword)),
		),

	_command_argument: ($) =>
		choice(
			$.uuid,
			$._value,
			$.path,
			$.score_holder,
			$.scoreboard_operation,
		),

	// — — — — — — — —
};
