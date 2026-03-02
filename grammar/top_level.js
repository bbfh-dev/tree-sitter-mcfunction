const COMMAND_KEYWORDS = require("../data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("../data/execute_subcommands.js");

const ARGUMENT = ($) => [
	$.macro,

	$.boolean,
	$.range,
	$.integer,
	$.float,
	$.number_with_unit,
	$.hexadecimal,

	$.vector_tilde,
	$.vector_caret,

	$.string,
	$.uuid,

	$.nbt_path,
	$.resource,
	$.item_selector,
	$.block_selector,
	$.entity_selector,
	$.data_compound,
	$.data_array,

	$.operation,

	// keep this last, it's a fallback for everything else.
	$.plain_string,
];

module.exports = {
	// — — — — Comments:
	block_comment_statement: ($) => seq("#>", $._comment_contents),

	comment_statement: ($) => seq("#", $._comment_contents),

	// — — — — Commands:

	command_statement: ($) =>
		seq(
			optional("$"),
			choice(
				$._say_command,
				$._return_command,
				$._generic_command,
				$._execute_command,
			),
		),

	// TODO: Support for selectors
	_say_command: ($) =>
		seq("say", optional(seq($._space, optional($.greedy_string)))),

	_return_command: ($) => seq("return run", $._space, $.command_statement),

	_generic_command: ($) =>
		seq(
			choice($.command_identifier, $.macro),
			repeat(seq($._space, choice($.command_keyword, ...ARGUMENT($)))),
		),

	_execute_command: ($) =>
		seq(
			"execute",
			repeat(seq($._space, choice($.subcommand_keyword, ...ARGUMENT($)))),
			optional(seq($._space, "run", $._space, $.command_statement)),
		),

	// — — — — Arguments:

	_comment_contents: (_) => /[^\r\n]*/,

	greedy_string: ($) => repeat1(choice($.macro, /[^\r\n]/)),

	command_identifier: (_) => /[a-z]+/,

	command_keyword: (_) => choice(...COMMAND_KEYWORDS),

	subcommand_keyword: (_) => choice(...SUBCOMMAND_KEYWORDS),

	compound_value: ($) => choice(...ARGUMENT($)),

	// — — — — — — — —
};
