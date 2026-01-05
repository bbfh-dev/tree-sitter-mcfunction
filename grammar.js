/**
 * @file Tree-sitter for the latest version of Minecraft mcfunction syntax
 * @author BubbleFish <daforsastudia@gmail.com>
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const SUBCOMMANDS = [
	"align",
	"anchored",
	"eyes",
	"feet",
	"as",
	"at",
	"facing",
	"biome",
	"block",
	"blocks",
	"items",
	"entity",
	"bossbar",
	"score",
	"storage",
	"in",
	"on",
	"attacker",
	"controller",
	"leasher",
	"origin",
	"owner",
	"passengers",
	"target",
	"vehicle",
	"positioned",
	"over",
	"rotated",
	"store",
	"result",
	"success",
	"max",
	"value",
	"summon",
	"if",
	"unless",
	"data",
	"all",
	"masked",
	"dimension",
	"function",
	"items",
	"loaded",
	"predicate",
	"score",
];

const COMMANDS = [
	"advancement",
	"attribute",
	"ban",
	"ban-ip",
	"banlist",
	"bossbar",
	"clear",
	"clone",
	"damage",
	"data",
	"datapack",
	"debug",
	"defaultgamemode",
	"deop",
	"dialog",
	"difficulty",
	"effect",
	"enchant",
	"experience",
	"fetchprofile",
	"fill",
	"fillbiome",
	"forceload",
	"function",
	"gamemode",
	"gamerule",
	"give",
	"help",
	"item",
	"jfr",
	"kick",
	"kill",
	"list",
	"locate",
	"loot",
	"me",
	"msg",
	"op",
	"pardon",
	"pardon-ip",
	"particle",
	"perf",
	"place",
	"playsound",
	"publish",
	"random",
	"recipe",
	"reload",
	"return",
	"ride",
	"rotate",
	"save-all",
	"save-off",
	"save-on",
	"say",
	"schedule",
	"scoreboard",
	"seed",
	"setblock",
	"setidletimeout",
	"setworldspawn",
	"spawnpoint",
	"spectate",
	"spreadplayers",
	"stop",
	"stopsound",
	"summon",
	"swing",
	"tag",
	"team",
	"teammsg",
	"teleport",
	"tell",
	"tellraw",
	"test",
	"time",
	"title",
	"tm",
	"tp",
	"transfer",
	"trigger",
	"version",
	"w",
	"waypoint",
	"weather",
	"whitelist",
	"worldborder",
	"xp",
];

const KEYWORDS = [
	"add",
	"add_multiplied_base",
	"add_multiplied_total",
	"add_value",
	"amount",
	"append",
	"at",
	"base",
	"biome",
	"block",
	"blocks",
	"buffer",
	"by",
	"center",
	"clear",
	"color",
	"create",
	"damage",
	"day",
	"daytime",
	"destroy",
	"disable",
	"dismount",
	"distance",
	"enable",
	"entity",
	"everything",
	"export",
	"exportclosest",
	"exportthat",
	"exportthese",
	"facing",
	"fail",
	"feature",
	"fish",
	"flush",
	"force",
	"from",
	"function",
	"gametime",
	"get",
	"give",
	"grant",
	"hollow",
	"id",
	"insert",
	"ips",
	"jigsaw",
	"join",
	"keep",
	"leave",
	"levels",
	"list",
	"locate",
	"mainhand",
	"max",
	"merge",
	"midnight",
	"mine",
	"modifier",
	"modify",
	"mount",
	"move",
	"name",
	"night",
	"noon",
	"normal",
	"off",
	"offhand",
	"on",
	"only",
	"outline",
	"players",
	"poi",
	"points",
	"pos",
	"prepend",
	"query",
	"rain",
	"reload",
	"remove",
	"replace",
	"reset",
	"resetclosest",
	"resetthat",
	"resetthese",
	"revoke",
	"roll",
	"run",
	"runclosest",
	"runfailed",
	"runthat",
	"runthese",
	"set",
	"setdisplay",
	"show",
	"spawn",
	"start",
	"stop",
	"strict",
	"string",
	"structure",
	"style",
	"take",
	"template",
	"through",
	"thunder",
	"time",
	"times",
	"to",
	"under",
	"until",
	"uuids",
	"value",
	"verify",
	"visible",
	"warning",
	"with",
];

module.exports = grammar({
	name: "mcfunction",

	extras: ($) => [$.macro],

	rules: {
		source_file: ($) => repeat($._statement),

		_newline: (_) => /\r?\n/,

		_space: ($) =>
			choice(
				" ",
				// This monstrocity is a padded backslash that can be used for multi-line statements
				$.backslash
			),

		backslash: (_) => /\s*\\\r?\n\s*/,

		// A statement is a single Minecraft command
		_statement: ($) =>
			seq(
				optional(/\s+/),
				optional(choice($.comment, $.command)),
				$._newline
			),

		command: ($) =>
			seq(
				optional($.macro_identifier),
				choice(
					prec.right(
						2,
						seq(
							"execute",
							repeat(
								seq(
									$._space,
									choice(
										$.selector,
										$.position,
										$.rotation,
										$.heightmap,
										$.resource,
										$.scale,
										$.type,
										$.slot,
										$.string,
										$.boolean,
										$.subcommand_identifier
									)
								)
							),
							$._space,
							"run",
							$._space,
							$.command
						)
					),
					prec.left(
						2,
						seq(
							$.command_identifier,
							repeat(seq($._space, $.argument))
						)
					)
				)
			),

		command_identifier: (_) => choice(...COMMANDS),

		subcommand_identifier: (_) => choice(...SUBCOMMANDS),

		macro_identifier: (_) => /\$/,

		command_keyword: (_) => choice(...KEYWORDS),

		argument: ($) =>
			choice(
				$.selector,
				$.position,
				$.rotation,
				$.heightmap,
				$.resource,
				$.scale,
				$.type,
				$.slot,
				$.string,
				$.boolean,
				$.command_keyword
			),

		selector: (_) =>
			choice(
				// TODO: Actual selector queries
				seq(/@[a-z]/, optional(/\[[^\]]*\]/))
			),

		position: ($) => prec.left(2, seq("~", optional(prec(2, $.scale)))),

		rotation: ($) => prec.left(2, seq("^", optional(prec(2, $.scale)))),

		heightmap: (_) =>
			/(world_surface|motion_blocking|motion_blocking_no_leaves|ocean_floor)/,

		resource: (_) =>
			token(seq(optional(/[a-z_]+\:/), /[a-z_/][a-z0-9_\-\+/]*/)),

		scale: (_) =>
			token(seq(choice(/\d+/, /\d*\.\d+/), optional(/[tsmhd]/))),

		type: (_) => /(byte|short|int|long|float|double)/,

		slot: (_) =>
			choice(
				/container\.[\d\*]+/,
				/hotbar\.[\d\*]+/,
				/inventory\.[\d\*]+/,
				/enderchest\.[\d\*]+/,
				/villager\.[\d\*]+/,
				/horse\.[\d\*]+/,
				/player\.crafting\.[\d\*]+/,
				"contents",
				"player.cursor",
				/(weapon|armor|horse)(\.[a-z\*]+)?/
			),

		string: (_) => choice(/[-\+\._a-zA-Z0-9]+/, seq('"', /[^"]*/, '"')),

		boolean: (_) => /(true|false)/,

		nbt_compound: ($) => seq("{", "}"),

		macro: (_) => seq("$(", /[a-zA-Z_]+/, ")"),

		comment: (_) => token(seq("#", /[^\r\n]*/)),
	},
});
