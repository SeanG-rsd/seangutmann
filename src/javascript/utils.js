import portfolio from "../javascript/portfolio.json"
//import { createElement } from "tsx-create-element";

const dataMap = new Map(Object.entries(portfolio));

function createInfoBlock(title, content) {
    // Create the main container div
    const container = document.createElement('div');
    container.className = 'bg-red-400 w-screen flex justify-center flex-col';

    // Create the title element
    const titleElement = document.createElement('h1');
    titleElement.className = 'font-bold text-2xl p-2';
    titleElement.textContent = title;

    // Create the content element
    const contentElement = document.createElement('p');
    contentElement.className = 'ml-3 p-2';
    contentElement.textContent = content;

    // Append title and content to the container
    container.appendChild(titleElement);
    container.appendChild(contentElement);

    return container;
}

// Example usage


const container = document.getElementById('outputContainer');
container.innerHTML = ''; // Clear previous blocks

generateBlocks(dataMap, container);


function generateBlocks(dataMap, container) {

    dataMap.forEach((value, key) => {
        if (typeof value == "string") {
            console.log(value)

            const block = document.createElement('InfoBlock');
            //const element = createElement(InfoBlock, { title: {key}, content: {value}})
            //const infoBlock = createInfoBlock(key, value);
            block.setAttribute('title', key)
            block.setAttribute('content', value)
            block.innerHTML = `
            <h1 className="font-bold text-2xl p-2">${key}</h1>
            <p>${value}</p>
        `;
            container.appendChild(block);
        }
        else {
            generateBlocks(new Map(Object.entries(value)), container)
        }
    });
}
