(ERROR) @error

[
 (comment)
 (backslash)
] @comment

[
 "#!/"
] @keyword.operator

(mime_comment
   (simple_identifier) @keyword)

(integer
  (byte_indicator) @keyword)

(integer
  (short_indicator) @keyword)

(integer
  (long_indicator) @keyword)

[
 "execute"
 "run"
 (command_identifier)
 (subcommand_identifier)
 (command_keyword)
 "B"
 "I"
 "L"
] @keyword

[
 (mime_comment
   (line_contents))
] @text

[
 (compound_identifier)
] @field

[
 (position)
 (rotation)
  ".."
] @punctuation.special

[
"!"
 ] @keyword.operator

[
   ","
   ":"
] @punctuation.delimiter

(selector
    "=" @punctuation.delimiter)

(selector
    "~" @punctuation.delimiter)

[
 "["
 "]"
 "}"
 "{"
] @punctuation.bracket

[
  (operator)
] @operator

[
  (path)
  (selector)
] @variable

[
 (boolean)
] @boolean

[
  (type)
] @type

[
  (number)
  (integer)
  (float)
] @number

[
 (slot)
 (heightmap)
 (scoreboard_criteria)
] @constant.builtin

(resource) @uri

(string) @string

[
 (macro_indicator)
 (macro)
] @label
