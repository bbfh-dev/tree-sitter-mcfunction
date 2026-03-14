const COMMAND_KEYWORDS = require("../data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("../data/execute_subcommands.js");

module.exports = {
	command_keyword: (_) => token(choice(...COMMAND_KEYWORDS)),
	subcommand_keyword: (_) => token(prec(1, choice(...SUBCOMMAND_KEYWORDS))),

	_keywords: ($) =>
		choice(
			$.operation,
			$.color,
			$.scoreboard_objective,
			$.scoreboard_display_slot,
			$.item_slot,
			$.entity_selector,
		),

	operation: (_) =>
		token(
			prec(1, choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),
		),

	color: (_) =>
		token(
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
			token(
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
			seq(token(prec(1, "teamkill.")), $.color),
			seq(token(prec(1, "killedByTeam.")), $.color),
		),

	scoreboard_display_slot: ($) =>
		choice(
			token(choice("list", "sidebar", "below_name")),
			seq(token(prec(1, "sidebar.team.")), $.color),
		),

	item_slot: ($) =>
		choice(
			token(
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
			seq(token("container."), $._item_slot_value),
			seq(token("hotbar."), $._item_slot_value),
			seq(token("inventory."), $._item_slot_value),
			seq(token("enderchest."), $._item_slot_value),
			seq(token("villager."), $._item_slot_value),
			seq(token("horse."), $._item_slot_value),
			seq(token("player.crafting."), $._item_slot_value),
		),

	_item_slot_value: ($) => choice("*", $.integer, $.macro),

	entity_selector: (_) => /@[a-z]/,
};
