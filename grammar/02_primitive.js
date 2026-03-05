module.exports = {
	// — — — — Primitive:

	boolean: (_) => token(choice("true", "false")),

	// — — — — — — — —
};
