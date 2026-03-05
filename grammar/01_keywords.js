module.exports = {
	// — — — — Complex:

	backslash: (_) => /\s*\\\s*/,

	_indentation: (_) => /[ \t]+/,
	_space: ($) => choice(/ +/, $.backslash),
	_newline: (_) => /\r?\n/,

	// Used as part of other tokens.
	identifier: (_) => /[_A-Za-z0-9]+/,

	line: (_) => /[^\r\n]*/,

	scoreboard_operation: (_) =>
		token(choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),

	// — — — — — — — —
};
