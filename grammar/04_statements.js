/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = {
	comment: ($) =>
		choice(
			alias(seq("#>", optional($.greedy_string)), $.block_comment),
			seq("#", optional($.greedy_string)),
		),

	special_comment: ($) =>
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
		choice(
			seq(
				"execute",
				repeat(
					seq(
						$._whitespace,
						choice(
							$._command_argument,
							prec(1, $.subcommand_keyword),
						),
					),
				),
				optional(seq($._whitespace, "run", $._whitespace, $.command)),
			),
			seq(
				"execute",
				$._whitespace,
				$.macro,
				"run",
				$._whitespace,
				$.command,
			),
		),

	_generic_command: ($) =>
		seq(
			$.identifier,
			repeat(
				seq(
					$._whitespace,
					choice($._command_argument, prec(1, $.argument_keyword)),
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
