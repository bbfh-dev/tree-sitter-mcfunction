; Comments
(block_comment_statement) @title

[
  (comment_statement)
  (backslash)
] @comment

; Commands

[
  "execute"
  "run"
  "return run"
  "say"
  (command_identifier)
] @keyword.function

; Keywords
[
  (command_keyword)
  (subcommand_keyword)
  (unit_symbol)
] @keyword

(nbt_path_identifier
  (command_keyword) @variable)

; Literals
(boolean) @boolean

[
  (integer)
  (float)
  (hexadecimal)
] @number

[
(string)
(uuid)
(greedy_string)
 ] @string

(escape_sequence) @string.escape

; Resources

(resource) @variable

(selector_identifier) @variable

(third_party_resource) @uri

(property_identifier
  (resource) @field)

(property_identifier
    (integer) @field)

(nbt_path_identifier) @variable

(nbt_path_slice
  (word) @variable)

(nbt_path_slice
  (command_keyword) @variable)

(nbt_path_compound
  (word) @variable)

; Variables & Fields
(plain_string) @variable

(property_identifier) @field

(target_identifier) @method

; Punctuation
[
  "~"
  "^"
] @punctuation.special

[
"!"
(operation)
 ] @keyword.operator

(array_type_identifier) @keyword

[
  ".."
  ","
  ";"
] @punctuation.delimiter

(data_compound
  "=" @punctuation.delimiter)
(data_compound
  ":" @punctuation.delimiter)
(data_compound
  "~" @punctuation.delimiter)
(component_compound
  "=" @punctuation.delimiter)
(component_compound
  ":" @punctuation.delimiter)
(component_compound
  "~" @punctuation.delimiter)

[
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

; Macros
[
  "$"
  (macro)
] @label

; Errors
(ERROR) @error
