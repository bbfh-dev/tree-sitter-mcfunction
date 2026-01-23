#!/bin/sh

VERSION=$1
if [ -z $VERSION ]; then
	echo "Version is required"
	exit 1
fi

tree-sitter version $VERSION
git commit -am "Release $VERSION"
git tag -- v$VERSION
git push --tags origin main
