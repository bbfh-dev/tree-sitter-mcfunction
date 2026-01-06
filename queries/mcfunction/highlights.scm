[
  (comment)
  (backslash)
] @comment

[
 "execute"
 "run"
 (command_identifier)
 (subcommand_identifier)
] @keyword

[
 (macro_indicator)
 (macro)
] @label

[
 (boolean)
 (slot)
 (type)
 (heightmap)
] @constant.builtin

[
 (string)
] @string

[
 (resource)
] @method

[
 (word)
 (nbt_identifier)
 (selector_identifier)
] @variable

(query_identifier) @field

[
 (scale)
 (range)
] @number

[
 (position)
 (rotation)
] @punctuation.special

[
 "{"
 "}"
 "["
 "]"
] @punctuation.bracket

[
 ":"
 (selector_query)
] @punctuation.delimiter

[
 "+="
 "-="
 "*="
 "/="
 "%="
 "><"
 "<"
 ">"
] @operator
