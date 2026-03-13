const COMMAND_KEYWORDS = require("../data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("../data/execute_subcommands.js");

module.exports = {
	command_keyword: (_) => token(prec(1, choice(...COMMAND_KEYWORDS))),
	subcommand_keyword: (_) => token(prec(1, choice(...SUBCOMMAND_KEYWORDS))),

	_keywords: ($) => choice($.operation, $.color),

	operation: (_) =>
		token(
			prec(1, choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),
		),

	color: (_) =>
		token(
			prec(
				1,
				choice(
					"black",
					"dark_blue",
					"dark_green",
					"dark_aqua",
					"dark_red",
					"dark_purple",
					"dark_purple",
					"gold",
					"gray",
					"dark_gray",
					"blue",
					"green",
					"aqua",
					"red",
					"light_purple",
					"yellow",
					"white",
				),
			),
		),
};
