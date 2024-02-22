const loadIpynbFileInputFile = document.getElementById(
	"load-ipynb-file-input-file",
);
const loadIpynbFileInputUrl = document.getElementById(
	"load-ipynb-file-input-url",
);
const convertButton = document.getElementById("convert-button");
loadIpynbFileInputFile.onchange = loadIpynbFileInputFileOnChange;
convertButton.onclick = convertButtonOnClick;

function convertButtonOnClick() {
	if (!loadIpynbFileInputUrl.checkValidity()) {
		event.preventDefault();
		alert("Please enter a valid URL address.");
	}
	let url = loadIpynbFileInputUrl.value;
	if (url.startsWith("https://github.com")) {
		url = url.replace("github", "raw.githubusercontent").replace("/blob/", "/");
	}
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.text();
		})
		.then((blob) => {
			ipynbToScript(blob);
		})
		.catch((err) => console.error(`Fetch problem: ${err.message}`));
}

function ipynbToScript(data) {
	const cellSourceArray = [];
	const jsonParsed = JSON.parse(data);
	for (const cell of jsonParsed.cells) {
		let cellSource = "";
		if (cell.cell_type === "code") {
			for (const line of cell.source) {
				if (line.startsWith("!")) {
					cellSource += `# ${line}`;
				} else {
					cellSource += line;
				}
			}
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
