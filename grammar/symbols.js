module.exports = {
	backslash: (_) => token(seq(/\s*/, "\\", /\r?\n/, /\s*/)),

	identifier: (_) => token(seq(optional(/[#%^?*]/), /[\-+_A-Za-z0-9]+/)),

	_indentation: (_) => /[\t ]+/,

	_newline: (_) => /\r?\n/,

	_space: ($) => choice(/ /, $.backslash),

	operation: (_) =>
		token(choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),
};
