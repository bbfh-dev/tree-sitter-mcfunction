; Punctuation
[
  "~"
  "^"
  (range
    "..")
] @punctuation.special

[
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ";"
  ","
] @punctuation.delimiter

(snbt_key_value_pair
  [
    ":"
    "="
  ] @punctuation.delimiter)

(data_key_value_pair
  [
    "|"
    "="
    "~"
  ] @punctuation.delimiter)

(advancements_key_value_pair
  [
    "="
    "~"
  ] @punctuation.delimiter)

; Built-in types
[
  (boolean)
  (integer)
  (float)
  (hexadecimal)
  (color)
  (scoreboard_objective)
  (scoreboard_display_slot)
  (item_slot)
] @constant.builtin

[
  (string)
  (uuid)
] @string

(command
  (greedy_string) @string)

(escape_sequence) @string.escape

[
  (command
    (word))
  (score_holder)
  (path)
  (selector_identifier)
] @variable

(snbt_key_value_pair
  (word) @variable)

(snbt_array
  (word) @variable)

; Misc
(command
  (generic_resource) @markup.link.url)

(command
  (generic_resource
    (namespace
      [
        (path)
        (score_holder)
        (word)
      ] @markup.link.url)))

(minecraft_resource) @variable

(key) @property

(entity_selector
  (word) @variable)

(data_key_value_pair
  (word) @variable)

(data_key_value_pair
  [
    (minecraft_resource)
    (generic_resource)
    (key)
  ] @property)

; Keywords
(command
  [
    (identifier)
    "execute"
    "return run"
    "say"
  ] @keyword.function)

[
  (command
    [
      (argument_keyword)
      (subcommand_keyword)
      "run"
    ])
  (measurement_unit)
  (array_type)
] @keyword

[
  (operation)
  "!"
] @keyword.operator

; Comments
[
  (comment)
  (backslash)
  (source_file
    ":")
] @comment

(block_comment) @title

(special_comment) @variable.parameter

(special_comment
  [
    "#~>"
    "#:"
    (identifier)
  ] @keyword)

; Macro
[
  (macro)
  (macro_sign)
] @tag
