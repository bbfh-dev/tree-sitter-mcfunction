FOLDER=$1
if [ -z $FOLDER ]; then
	echo "Provide path to a directory"
	exit 1
fi

i=0
j=0
shopt -s globstar

for file in $FOLDER/**/*.mcfunction; do
	if [ -f "$file" ]; then
		((i = i + 1))

		lines=$(cat "$file" | wc -l)
		((j = j + lines))
		printf "%6d | %6d  (+%3d)\n" $i $j $lines

		tree-sitter parse "$file" >/tmp/parse-result
		if grep -q "ERROR" /tmp/parse-result; then
			tree-sitter parse -c "$file"
			echo i: $i

			exit 1
			return
		fi
	fi
done

echo Parsed $i files! with $j total lines
