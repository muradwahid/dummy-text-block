/**
 * Generates a specified number of lorem ipsum words.
 * @param {number} wordCount - The number of words to generate.
 * @returns {string} A string of lorem ipsum words.
 */
function generateLorem(wordCount) {
    const words = [
        "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "Ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
        "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
        "commodo", "consequat", "Duis", "aute", "irure", "dolor", "in", "reprehenderit",
        "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
        "pariatur", "Excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
        "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
        "est", "laborum"
    ];
    let result = [];
    for (let i = 0; i < wordCount; i++) {
        // Select a random word from the predefined list
        result.push(words[Math.floor(Math.random() * words.length)]);
    }
    return result.join(" ");
}

/**
 * Parses a simplified Emmet-like string into a hierarchical structure of tags.
 * Supports:
 * - Tag names (e.g., 'div', 'p', 'ul')
 * - Child operator ('>')
 * - Repetition operator ('*') for tags (e.g., 'li*3')
 * - Lorem ipsum text generation ('loremN') as content for the preceding tag.
 *
 * @param {string} emmetString - The Emmet-like string to parse (e.g., 'ul>li*3>p>lorem4').
 * @returns {Array<Object>} A hierarchical array of tag objects. Each object has:
 * - tag: (string) The HTML tag name.
 * - count: (number) How many times this tag (and its children) should be repeated. Defaults to 1.
 * - text: (string, optional) The generated lorem ipsum text content for the tag.
 * - children: (Array<Object>) An array of child tag objects.
 */
function getTagsWithCountAndText(emmetString) {
    // Initialize an array to hold the top-level elements of the parsed structure.
    const rootElements = [];
    // Use a stack to keep track of the current parent node for nested elements.
    const currentParentStack = [];

    // Split the input string by the child operator '>' to get individual segments.
    const segments = emmetString.split('>').map(s => s.trim()).filter(s => s.length > 0);

    if (segments.length === 0) {
        console.warn("Input Emmet string is empty or contains only delimiters.");
        return [];
    }

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        // Regex to match a tag name, optionally followed by '*count'.
        // Group 1: tag name (e.g., 'div', 'li')
        // Group 2: optional repetition part (e.g., '*3')
        // Group 3: the count number itself (e.g., '3')
        const tagMatch = segment.match(/^([a-zA-Z]+)(?:\*(\d+))?$/);

        // Regex to match 'loremN' for text generation.
        // Group 1: the number of words (e.g., '4')
        const loremMatch = segment.match(/^lorem(\d+)$/);

        if (tagMatch) {
            // This segment is a tag.
            const tagName = tagMatch[1];
            // Parse the count, defaulting to 1 if not specified.
            const count = tagMatch[2] ? parseInt(tagMatch[2], 10) : 1;

            // Create a new node object for the current tag.
            const newNode = {
                tag: tagName,
                count: count,
                children: []
            };

            // If the stack is empty, this is a root element.
            if (currentParentStack.length === 0) {
                rootElements.push(newNode);
            } else {
                // Otherwise, add this new node as a child of the current parent on top of the stack.
                const currentParent = currentParentStack[currentParentStack.length - 1];
                currentParent.children.push(newNode);
            }
            // Push the new node onto the stack, as it can now be a parent for subsequent children.
            currentParentStack.push(newNode);
        } else if (loremMatch) {
            // This segment is a lorem text generator.
            const wordCount = parseInt(loremMatch[1], 10);

            // Lorem text should be applied to the most recently added tag.
            if (currentParentStack.length > 0) {
                const lastTagNode = currentParentStack[currentParentStack.length - 1];
                lastTagNode.text = generateLorem(wordCount);
            } else {
                console.warn(`Lorem text segment "${segment}" found without a preceding tag. Ignoring.`);
            }
            // Lorem text does not create a new level in the hierarchy, so the stack is not modified.
        } else {
            // If the segment doesn't match a tag or lorem, it's an invalid format.
            console.error(`Invalid Emmet segment encountered: "${segment}". Skipping.`);
            // Optionally, you could throw an error here or return an empty array.
            return [];
        }
    }

    return rootElements;
}

// --- Example Usage ---
console.log("Parsing 'ul>li*3>p>lorem4':");
const parsedStructure1 = getTagsWithCountAndText('ul>li*3>p>lorem4');
console.log(JSON.stringify(parsedStructure1, null, 2));

console.log("\nParsing 'div>h1>lorem2+p>lorem5':");
const parsedStructure2 = getTagsWithCountAndText('div>h1>lorem2'); // Note: '+p' is not supported in this simplified parser
console.log(JSON.stringify(parsedStructure2, null, 2));

console.log("\nParsing 'section>article*2':");
const parsedStructure3 = getTagsWithCountAndText('section>article*2');
console.log(JSON.stringify(parsedStructure3, null, 2));

console.log("\nParsing 'span>lorem3':");
const parsedStructure4 = getTagsWithCountAndText('span>lorem3');
console.log(JSON.stringify(parsedStructure4, null, 2));

console.log("\nParsing an empty string:");
const parsedStructure5 = getTagsWithCountAndText('');
console.log(JSON.stringify(parsedStructure5, null, 2));

console.log("\nParsing an invalid string 'div>123>span':");
const parsedStructure6 = getTagsWithCountAndText('div>123>span');
console.log(JSON.stringify(parsedStructure6, null, 2));
