'use strict';

document.getElementById('load-ipynb-file-input-file').addEventListener('change', function() {
	const file = document.getElementById('load-ipynb-file-input-file').files[0];
	const fileReader = new FileReader();
	fileReader.readAsText(file);
	fileReader.onload = function(event) {
		let cellSourceArray = [];
		const jsonParsed = JSON.parse(event.target.result);
		for (const cell of jsonParsed.cells) {
			let cellSource = '';
			if (cell.cell_type === 'code') {
				cellSource = cell.source.join('');
			} else if (cell.cell_type === 'markdown') {
				cellSource = cell.source.map(element => `# ${element}`).join('');
			}
			cellSourceArray.push(cellSource);
		}
		const output = cellSourceArray.join('');
		saveData([output], 'output.py');
	};
});

function saveData(data, fileName) {
	const a = document.createElement('a');
	document.body.appendChild(a);
	const blob = new Blob(data);
	const url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
}
