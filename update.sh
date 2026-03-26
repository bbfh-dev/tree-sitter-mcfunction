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
git commit -am "Release $VERSION"
git tag -- v$VERSION
git push --tags origin main
