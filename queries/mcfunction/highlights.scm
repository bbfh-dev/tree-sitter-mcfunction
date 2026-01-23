(ERROR) @error

[
 (comment)
 (backslash)
] @comment

[
 (macro_indicator)
 ; (macro)
 ; (substitution)
] @label

[
 "#!"
] @keyword.operator

(mime_comment
   (simple_identifier) @keyword)

[
 (mime_comment
   (line_contents))
] @text

[
 "execute"
 "run"
 (command_identifier)
 (subcommand_identifier)
 (command_keyword)
] @keyword

