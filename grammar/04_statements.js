/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = {
	comment: ($) =>
		choice(
			seq(
				"#~>",
				$.identifier,
				optional(seq($._whitespace, $.greedy_string)),
			),
			seq(
				"#:",
				$.identifier,
				optional(seq($._whitespace, $.greedy_string)),
			),
			seq("#>", optional($.greedy_string)),
			seq("#", optional($.greedy_string)),
		),

	command: ($) =>
		seq(
			optional(alias("$", $.macro_sign)),
			choice(
				seq("return run", $._whitespace, $.command),
				seq("say", $._whitespace, $.greedy_string),
				$._execute_command,
				$._generic_command,
				$.macro,
			),
		),

	_execute_command: ($) =>
		seq(
			"execute",
			repeat(
				seq(
					$._whitespace,
					choice($._command_argument, $.subcommand_keyword),
				),
			),
			optional(seq($._whitespace, "run", $._whitespace, $.command)),
		),

	_generic_command: ($) =>
		seq(
			$.identifier,
			repeat(
				seq(
					$._whitespace,
					choice($._command_argument, $.argument_keyword),
				),
			),
		),

	_command_argument: ($) =>
		choice(
			$.macro,
			$._keywords,
			$.operation,
			$._composite_type,
			$._primitive_type,
		),
};
