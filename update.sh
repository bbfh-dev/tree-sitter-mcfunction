#!/bin/sh
set -e

VERSION=$1
if [ -z $VERSION ]; then
	echo "Version is required"
	exit 1
fi

tree-sitter version $VERSION
npx tree-sitter-cli@0.26.7 generate
cargo test
ts_query_ls check -f queries/
input=$(gum input)
git commit -am "Release $VERSION\n\n$input"
git tag -m "$input" -- v$VERSION
git push --tags origin main
