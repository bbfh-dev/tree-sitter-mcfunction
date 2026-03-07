const PREC_BUILTIN = 4;

module.exports = {
	_primitive_type: ($) => choice($.boolean),

	boolean: (_) => token(prec(PREC_BUILTIN, choice("true", "false"))),

	greedy_string: (_) => /[^\r\n]+/,
};
