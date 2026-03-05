; Keywords
[
 (command_identifier)
 "say"
 "execute"
 "run"
 "return run"
] @keyword.function

[
 "#~>"
 "#:"
 (measurement_unit)
 (command_keyword)
 (subcommand_keyword)
] @keyword

(operation) @keyword.operator

; Comments
[
 (backslash)
 (comment)
] @comment

(comment_header) @markup.heading

; Primitive types
[
 (boolean)
 (integer)
 (float)
 (number
   "-")
 (number
   ".")
 (hexadecimal)
] @constant.builtin

; Strings
[
  (greedy_string)
  (plain_string)
  ; (vanilla_resource)
] @variable.parameter

(escape_sequence) @string.escape

[
 (string)
 (uuid)
] @string

; Complex types

[
 "~"
 "^"
 ".."
] @punctuation.special

; (third_party_resource) @markup.link.url

; Macros
[
  (macro)
  "$"
] @tag

; Errors
(ERROR) @error
