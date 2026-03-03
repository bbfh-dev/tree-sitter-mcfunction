const ARRAY = ($, open_char, close_char, element) =>
	seq(open_char, ARRAY_CONTENTS($, element), close_char);

const ARRAY_CONTENTS = ($, element) =>
	optional(
		seq(
			repeat($._space),
			element,
			repeat(seq(repeat($._space), ",", repeat($._space), element)),
			repeat($._space),
		),
	);

module.exports = {
	// — — — — Compounds:

	component_compound: ($) =>
		ARRAY(
			$,
			"[",
			"]",
			choice($._key_value_pair, $.number, $.data_compound),
		),

	data_compound: ($) => ARRAY($, "{", "}", $._key_value_pair),

	// — — — — Arrays:

	array_type_identifier: (_) => token(prec(1, choice("B", "I", "L"))),

	data_array: ($) =>
		seq(
			"[",
			choice(
				seq($.array_type_identifier, ";", ARRAY_CONTENTS($, $.integer)),
				ARRAY_CONTENTS($, $.compound_value),
			),
			"]",
		),

	// — — — — Keys & Values:

	property_identifier: ($) =>
		prec(
			1,
			choice(
				$.hexadecimal,
				$.resource,
				seq($.word, repeat(seq(".", $.word))),
				$.string,
				seq($.integer, optional($.word)),
			),
		),

	_key_value_pair: ($) =>
		seq(
			$.property_identifier,
			repeat($._space),
			choice("=", ":", "~"),
			optional("!"),
			repeat($._space),
			$.compound_value,
		),

	// — — — — — — — —
};
