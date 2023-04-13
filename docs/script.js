"use strict";
const loadIpynbFileInputFile = document.getElementById("load-ipynb-file-input-file");
const loadIpynbFileInputUrl = document.getElementById("load-ipynb-file-input-url");
loadIpynbFileInputFile.onchange = loadIpynbFileInputFileOnChange;
loadIpynbFileInputUrl.onchange = loadIpynbFileInputUrlOnChange;

function ipynbToScript(data) {
	const cellSourceArray = [];
	const jsonParsed = JSON.parse(data);
	for (const cell of jsonParsed.cells) {
		let cellSource = "";
		if (cell.cell_type === "code") {
			cellSource = cell.source.join("");
		} else if (cell.cell_type === "markdown") {
			cellSource = cell.source.map((element) => `# ${element}`).join("");
		}
		cellSourceArray.push(`${cellSource}\n`);
	}
	const output = cellSourceArray.join("");
	saveData([output], "main.py");
}

function loadIpynbFileInputFileOnChange() {
	const file = loadIpynbFileInputFile.files[0];
	const fileReader = new FileReader();
	fileReader.readAsText(file);
	fileReader.onload = (event) => {
		ipynbToScript(event.target.result);
	};
}

function loadIpynbFileInputUrlOnChange() {
	fetch(loadIpynbFileInputUrl.value)
		.then((response) => response.text())
		.then((blob) => {
			ipynbToScript(blob);
		});
}

function saveData(data, fileName) {
	const a = document.createElement("a");
	document.body.appendChild(a);
	const blob = new Blob(data);
	const url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
}
