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
] @type.builtin

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

[
 (selector_query)
] @tag

(query_identifier) @namespace

[
 (scale)
] @number

[
 (position)
 (rotation)
] @punctuation.special

    ; ├ ƒ argument
    ; ├ ƒ selector
    ; ├ ƒ nbt_compound
    ; └ ƒ nbt_array
