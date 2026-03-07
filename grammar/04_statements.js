module.exports = {
	comment: ($) =>
		choice(
			seq("#~>", optional($.greedy_string)),
			seq("#:", optional($.greedy_string)),
			seq("#>", optional($.greedy_string)),
			seq("#", optional($.greedy_string)),
		),

	command: ($) =>
		choice(
			seq(alias("say", $.command_identifier), $.greedy_string),
			seq(alias("return run", $.command_identifier), $.command),
			$._execute_command,
			$._generic_command,
		),

	_execute_command: ($) =>
		seq(
			alias("execute", $.command_identifier),
			repeat(choice($._command_argument, $.subcommand_keyword)),
			optional(seq(alias("run", $.command_keyword), $.command)),
		),

	_generic_command: ($) =>
		seq(
			$.command_identifier,
			repeat(choice($._command_argument, $.command_keyword)),
		),

	command_identifier: ($) => $.identifier,

	_command_argument: ($) => choice(),
};
