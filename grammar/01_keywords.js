/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const KEYWORDS = {
	arguments: require("../data/keywords/arguments.js"),
	// commands: require("../data/keywords/commands.js"),
	subcommands: require("../data/keywords/subcommands.js"),
};

const COLORS = [
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
];

module.exports = {
	argument_keyword: (_) => choice(...KEYWORDS.arguments),

	// ———— This isn't necessary.
	// command_keyword: (_) => keyword(choice(...KEYWORDS.commands)),

	subcommand_keyword: (_) => choice(...KEYWORDS.subcommands),

	_keywords: ($) =>
		choice(
			$.color,
			$.scoreboard_objective,
			$.scoreboard_display_slot,
			$.item_slot,
		),

	operation: (_) =>
		choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">", "<=", ">="),

	color: (_) => choice(...COLORS),

	scoreboard_objective: (_) =>
		choice(
			seq("teamkill.", choice(...COLORS)),
			seq("killedByTeam.", choice(...COLORS)),
			"dummy",
			"trigger",
			"deathCount",
			"playerKillCount",
			"totalKillCount",
			"health",
			"xp",
			"level",
			"food",
			"air",
			"armor",
		),

	scoreboard_display_slot: (_) =>
		choice(
			seq("sidebar.team.", choice(...COLORS)),
			// "list",  ——— This conflicts with keyword, and I would rather it be a keyword.
			"sidebar",
			"below_name",
		),

	item_slot: ($) =>
		choice(
			seq("container.", choice("*", $.integer)),
			seq("hotbar.", choice("*", $.integer)),
			seq("inventory.", choice("*", $.integer)),
			seq("enderchest.", choice("*", $.integer)),
			seq("villager.", choice("*", $.integer)),
			seq("horse.", choice("*", $.integer)),
			seq("player.crafting.", choice("*", $.integer)),
			"contents",
			"weapon",
			"weapon.offhand",
			"weapon.mainhand",
			"armor.head",
			"armor.chest",
			"armor.legs",
			"armor.feet",
			"armor.body",
			"horse.saddle",
			"horse.chest",
			"player.cursor",
		),
};
