document.getElementById('load-ipynb-file-input-file').addEventListener('change', function() {
	let file = document.getElementById('load-ipynb-file-input-file').files[0];
	let fileReader = new FileReader();
	fileReader.readAsText(file);
	fileReader.onload = function(event) {
		let outputArray = [];
		let jsonParsed = JSON.parse(event.target.result);
		for (const cell of jsonParsed.cells) {
			if (cell.cell_type === 'code') {
				outputArray.push(cell.source.join(''));
			} else if (cell.cell_type === 'markdown') {
				markdownCommented = cell.source.map(element => `# ${element}`);
				outputArray.push(markdownCommented.join(''));
			}
		}
		output = outputArray.join('');
		saveData([output], 'output.py');
	};
});

function saveData(data, filename) {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	const blob = new Blob(data);
	const url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}
