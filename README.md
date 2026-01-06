# Tree-sitter for MCFunction

Tree-sitter grammar for Minecraft 1.21.11 data pack function language

## Neovim installation

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
