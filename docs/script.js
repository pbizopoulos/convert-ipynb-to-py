"use strict";
const form = document.querySelector("form");
const loadIpynbFileInputFile = document.getElementById("load-ipynb-file-input-file");
const loadIpynbFileInputUrl = document.getElementById("load-ipynb-file-input-url");
loadIpynbFileInputFile.onchange = loadIpynbFileInputFileOnChange;

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

form.addEventListener("submit", (event) => {
	if (!loadIpynbFileInputUrl.checkValidity()) {
		event.preventDefault();
		alert("Please enter a valid URL address.");
	}
	let url = loadIpynbFileInputUrl.value;
	if (url.startsWith("https://github.com")) {
		url = url.replace("github", "raw.githubusercontent").replace("/blob/", "/");
	}
	fetch(url)
		.then((response) => response.text())
		.then((blob) => {
			ipynbToScript(blob);
		});
});
