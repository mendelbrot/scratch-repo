#!/bin/bash

# Fix: VSCode + ElixirLS Intellisense for code imported with `use`
# https://dragoshmocrii.com/fix-vscode-elixirls-intellisense-for-code-imported-with-use/

cd ~/Software

if [ -d "$HOME/Software/elixir-ls" ] ; then
    rm -rf ~/Software/elixir-ls
fi

git clone --depth 1 https://github.com/elixir-lsp/elixir-ls

cd elixir-ls

mix deps.get

mix elixir_ls.release -o ~/.vscode/extensions/jakebecker.elixir-ls-*/elixir-ls-release/