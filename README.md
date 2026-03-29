# Tree-sitter for MCFunction

Tree-sitter grammar for modern Minecraft data pack function language. Supports 26.1 and earlier versions.

- [x] Supports macros.[⁽¹⁾](#1-macros)
- [x] Tested on `>146,314` lines of code.[⁽²⁾](#2-testing)

If you have any issues with parsing/highlighting, feel free to [create an issue](https://github.com/bbfh-dev/tree-sitter-mcfunction/issues/new).

<!-- vim-markdown-toc GFM -->

* [Neovim installation](#neovim-installation)
* [Other editors](#other-editors)
* [Addendum](#addendum)
    * [1 Macros](#1-macros)
    * [2 Testing](#2-testing)

<!-- vim-markdown-toc -->

# Neovim installation

Using lazy:

```lua
return {
    "bbfh-dev/tree-sitter-mcfunction",
    config = function()
        local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
        parser_config.mcfunction = {
            install_info = {
                url = "https://github.com/bbfh-dev/tree-sitter-mcfunction",
                files = { "src/parser.c" },
                branch = "main",
                generate_requires_npm = false, -- stand-alone parser without npm dependencies
                requires_generate_from_grammar = false, -- folder contains pre-generated src/parser.c
                queries = "queries/mcfunction",
            },
        }

        vim.filetype.add({
            extension = {
                mcfunction = "mcfunction",
            },
        })
    end,
}
```

If needed, run: `:TSInstall mcfunction`.

# Other editors

Refer to your editor's documentation on custom tree-sitter grammars.

I do not use other text editors, but I will happily accept contributions for plugins/add-ons/extensions that enable this grammar in a different editor.

# Addendum

## 1 Macros

This grammar accepts `$(macro)`-s in many common places. However, some `$(macro)` tricks simply cannot be properly handled and can lead to errors.

## 2 Testing

> [!IMPORTANT]
> Quantity ≠ quality. I used all projects I could scramble on my machine, but that **does not** mean that all possible syntax is covered.

Alongside [tree-sitter tests](./test/corpus/), the grammar was tested on **at least** `19,293` files (`~146,314` lines) worth of mcfunction code.

The script used can be found in this repository: [test_local_files.sh](./test_local_files.sh). (Note: the script is sloppy, I did not intend for it to even be public)
