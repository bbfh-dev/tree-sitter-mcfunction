const KEYWORDS = {
	arguments: require("../data/keywords/arguments.js"),
	// commands: require("../data/keywords/commands.js"),
	subcommands: require("../data/keywords/subcommands.js"),
};

const keyword = (verb) => token(prec(1, verb));

module.exports = {
	argument_keyword: (_) => keyword(choice(...KEYWORDS.arguments)),

	// ———— This isn't necessary.
	// command_keyword: (_) => keyword(choice(...KEYWORDS.commands)),

	subcommand_keyword: (_) => keyword(choice(...KEYWORDS.subcommands)),

	_keywords: ($) =>
		choice(
			$.color,
			$.scoreboard_objective,
			$.scoreboard_display_slot,
			$.item_slot,
		),

	operation: (_) =>
		keyword(choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),

	color: (_) =>
		keyword(
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

	scoreboard_objective: ($) =>
		choice(
			keyword(
				choice(
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
			),
			seq(keyword("teamkill."), $.color),
			seq(keyword("killedByTeam."), $.color),
		),

	scoreboard_display_slot: ($) =>
		choice(
			keyword(choice("list", "sidebar", "below_name")),
			seq(keyword("sidebar.team."), $.color),
		),

	item_slot: ($) =>
		choice(
			keyword(
				choice(
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
			),
			seq(keyword("container."), $._item_slot_value),
			seq(keyword("hotbar."), $._item_slot_value),
			seq(keyword("inventory."), $._item_slot_value),
			seq(keyword("enderchest."), $._item_slot_value),
			seq(keyword("villager."), $._item_slot_value),
			seq(keyword("horse."), $._item_slot_value),
			seq(keyword("player.crafting."), $._item_slot_value),
		),

	_item_slot_value: ($) => choice(keyword("*"), $.integer, $.macro),
};
