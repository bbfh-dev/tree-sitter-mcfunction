const PREC_BUILTIN = 4;

module.exports = {
	_primitive_type: ($) => choice($.boolean, $.float, $.integer),

	boolean: (_) => token(prec(PREC_BUILTIN, choice("true", "false"))),

	integer: ($) =>
		choice(
			token(prec(PREC_BUILTIN, /\d+/)),
			prec(PREC_BUILTIN, seq("-", $.macro)),
		),

	float: ($) =>
		choice(
			token(prec(PREC_BUILTIN, /\d+\.\d+/)),
			token(prec(PREC_BUILTIN, /\.\d+/)),
			prec(PREC_BUILTIN, seq(/\d+\./, $.macro)),
			prec(PREC_BUILTIN, seq(optional("-"), $.macro, /\.\d+/)),
		),

	greedy_string: (_) => /[^\r\n]+/,
};
