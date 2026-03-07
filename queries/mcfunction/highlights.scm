; Keywords
[
 (command_keyword)
 (subcommand_keyword)
 (measurement_unit)
 (array_type)
 "!"
] @keyword

(command_identifier) @keyword.function

(scoreboard_operation) @keyword.operator

; Comments
[
 (comment)
 (backslash)
] @comment

; Primitives
[
  (boolean)
  (number)
  (hexadecimal)
] @constant.builtin

; Literals
[
  (score_holder)
  (path)
] @variable

(compound_key) @variable.member

; Strings
[
   (string)
   (uuid)
] @string

(escape_sequence) @string.escape

; Punctuation
[
 "["
 "]"
 "{"
 "}"
] @punctuation.bracket

[
 (key_value_assign)
 ","
] @punctuation.delimiter

[
 "~"
 "^"
  (range)
] @punctuation.special

; Macros
[
  (macro)
  (command
    "$")
] @tag

; Errors
[
  (ERROR)
  (MISSING)
] @error
