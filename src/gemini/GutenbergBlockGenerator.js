/**
 * Represents a simplified Gutenberg block structure.
 * This is a basic representation for demonstration purposes.
 * Real Gutenberg blocks have more complex structures and attributes.
 * @typedef {Object} GutenbergBlock
 * @property {string} name - The full name of the block (e.g., 'core/paragraph', 'core/list').
 * @property {Object} [attributes={}] - An object containing the block's attributes.
 * @property {Array<GutenbergBlock>} [innerBlocks=[]] - An array of nested Gutenberg blocks.
 * @property {string} [clientId] - A unique client ID for the block (simulated).
 */

/**
 * Maps simplified HTML tags to their corresponding Gutenberg block names and default attributes.
 * @type {Object.<string, {blockName: string, attrs?: Object}>}
 * @constant
 */
const TAG_TO_GUTENBERG_MAP = {
    'p': { blockName: 'core/paragraph' },
    'h1': { blockName: 'core/heading', attrs: { level: 1 } },
    'h2': { blockName: 'core/heading', attrs: { level: 2 } },
    'h3': { blockName: 'core/heading', attrs: { level: 3 } },
    'h4': { blockName: 'core/heading', attrs: { level: 4 } },
    'h5': { blockName: 'core/heading', attrs: { level: 5 } },
    'h6': { blockName: 'core/heading', attrs: { level: 6 } },
    'ul': { blockName: 'core/list', attrs: { ordered: false } },
    'ol': { blockName: 'core/list', attrs: { ordered: true } },
    'li': { blockName: 'core/list-item' },
    'div': { blockName: 'core/group' }, // Generic container
    'section': { blockName: 'core/group' }, // Generic container
    'article': { blockName: 'core/group' }, // Generic container
    'span': { blockName: 'core/paragraph' } // Span often holds text, mapping to paragraph for simplicity
};

/**
 * Generates a specified number of lorem ipsum words.
 * @param {number} wordCount - The number of words to generate.
 * @returns {string} A string of lorem ipsum words.
 */
export function generateLorem(wordCount) {
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
export function getTagsWithCountAndText(emmetString) {
    const rootElements = [];
    const currentParentStack = [];
    const segments = emmetString.split('>').map(s => s.trim()).filter(s => s.length > 0);

    if (segments.length === 0) {
        console.warn("Input Emmet string is empty or contains only delimiters.");
        return [];
    }

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const tagMatch = segment.match(/^([a-zA-Z]+)(?:\*(\d+))?$/);
        const loremMatch = segment.match(/^lorem(\d+)$/);

        if (tagMatch) {
            const tagName = tagMatch[1];
            const count = tagMatch[2] ? parseInt(tagMatch[2], 10) : 1;
            const newNode = { tag: tagName, count: count, children: [] };

            if (currentParentStack.length === 0) {
                rootElements.push(newNode);
            } else {
                const currentParent = currentParentStack[currentParentStack.length - 1];
                currentParent.children.push(newNode);
            }
            currentParentStack.push(newNode);
        } else if (loremMatch) {
            const wordCount = parseInt(loremMatch[1], 10);
            if (currentParentStack.length > 0) {
                const lastTagNode = currentParentStack[currentParentStack.length - 1];
                lastTagNode.text = generateLorem(wordCount);
            } else {
                console.warn(`Lorem text segment "${segment}" found without a preceding tag. Ignoring.`);
            }
        } else {
            console.error(`Invalid Emmet segment encountered: "${segment}". Skipping.`);
            return [];
        }
    }
    return rootElements;
}

/**
 * Converts a single parsed Emmet tag node into a Gutenberg block using wp.blocks.createBlock.
 * This is a recursive helper function.
 * @param {Object} emmetNode - A single node from the parsed Emmet structure.
 * @param {string} emmetNode.tag - The HTML tag name.
 * @param {number} emmetNode.count - The repetition count for this tag.
 * @param {string} [emmetNode.text] - The text content for the tag.
 * @param {Array<Object>} emmetNode.children - An array of child Emmet nodes.
 * @returns {Array<GutenbergBlock>} An array of generated Gutenberg blocks (handles repetition).
 */
export function convertEmmetNodeToGutenbergBlock(emmetNode) {
    const { tag, count, text, children } = emmetNode;
    const blockConfig = TAG_TO_GUTENBERG_MAP[tag];

    const blocks = [];
    for (let i = 0; i < count; i++) {
        let blockName;
        let attributes = {};
        let innerBlocks = [];

        if (!blockConfig) {
            console.warn(`No direct Gutenberg block mapping for tag: "${tag}". Using 'core/group'.`);
            blockName = 'core/group';
            attributes.tagName = tag; // Store original tag name in attrs
        } else {
            blockName = blockConfig.blockName;
            attributes = { ...blockConfig.attrs }; // Copy default attributes
        }

        // Add text content if available
        if (text) {
            // Determine where to put the text based on block type
            if (blockName === 'core/paragraph' || blockName === 'core/heading' || blockName === 'core/list-item') {
                attributes.content = text;
            } else {
                // For other blocks, if they have text, it might be a child paragraph
                // Create a paragraph block for the text content
                innerBlocks.push(wp.blocks.createBlock('core/paragraph', { content: text }));
            }
        }

        // Recursively convert children
        children.forEach(childNode => {
            innerBlocks.push(...convertEmmetNodeToGutenbergBlock(childNode));
        });

        // Create the block using wp.blocks.createBlock
        // The third argument (innerBlocks) can be an array of block objects
        const newBlock = wp.blocks.createBlock(blockName, attributes, innerBlocks);
        blocks.push(newBlock);
    }
    return blocks;
}

/**
 * Generates an array of Gutenberg block objects from a parsed Emmet-like structure.
 * @param {Array<Object>} parsedEmmetStructure - The output from `getTagsWithCountAndText`.
 * @returns {Array<GutenbergBlock>} An array of top-level Gutenberg blocks.
 */
export function generateGutenbergBlocks(parsedEmmetStructure) {
    const gutenbergBlocks = [];
    parsedEmmetStructure.forEach(rootNode => {
        gutenbergBlocks.push(...convertEmmetNodeToGutenbergBlock(rootNode));
    });
    return gutenbergBlocks;
}

// --- Mocking wp.blocks.createBlock for demonstration ---
// In a real WordPress environment, `wp.blocks` would be globally available.
// This mock simulates its basic behavior for testing purposes.
if (typeof wp === 'undefined' || typeof wp.blocks === 'undefined') {
    window.wp = window.wp || {};
    window.wp.blocks = window.wp.blocks || {};
    window.wp.blocks.createBlock = (name, attributes = {}, innerBlocks = []) => {
        // Simulate a basic block object structure returned by createBlock
        return {
            name: name,
            attributes: attributes,
            innerBlocks: innerBlocks,
            clientId: Math.random().toString(36).substring(2, 15) // Simulate a unique client ID
        };
    };
}


// // --- Example Usage ---
// console.log("--- Generating Gutenberg Blocks ---");

// // Example 1: ul>li*3>p>lorem4
// console.log("\nEmmet: 'ul>li*3>p>lorem4'");
// const parsed1 = getTagsWithCountAndText('ul>li*3>p>lorem4');
// const gutenbergBlocks1 = generateGutenbergBlocks(parsed1);
// console.log(JSON.stringify(gutenbergBlocks1, null, 2));

// // Example 2: div>h1>lorem2
// console.log("\nEmmet: 'div>h1>lorem2'");
// const parsed2 = getTagsWithCountAndText('div>h1>lorem2');
// const gutenbergBlocks2 = generateGutenbergBlocks(parsed2);
// console.log(JSON.stringify(gutenbergBlocks2, null, 2));

// // Example 3: section>article*2>p>lorem3
// console.log("\nEmmet: 'section>article*2>p>lorem3'");
// const parsed3 = getTagsWithCountAndText('section>article*2>p>lorem3');
// const gutenbergBlocks3 = generateGutenbergBlocks(parsed3);
// console.log(JSON.stringify(gutenbergBlocks3, null, 2));

// // Example 4: p>lorem5
// console.log("\nEmmet: 'p>lorem5'");
// const parsed4 = getTagsWithCountAndText('p>lorem5');
// const gutenbergBlocks4 = generateGutenbergBlocks(parsed4);
// console.log(JSON.stringify(gutenbergBlocks4, null, 2));

// // Example 5: h2>lorem1
// console.log("\nEmmet: 'h2>lorem1'");
// const parsed5 = getTagsWithCountAndText('h2>lorem1');
// const gutenbergBlocks5 = generateGutenbergBlocks(parsed5);
// console.log(JSON.stringify(gutenbergBlocks5, null, 2));

// // Example 6: p>span>lorem10 (demonstrates nesting, but see notes below)
// console.log("\nEmmet: 'p>span>lorem10'");
// const parsed6 = getTagsWithCountAndText('p>span>lorem10');
// const gutenbergBlocks6 = generateGutenbergBlocks(parsed6);
// console.log(JSON.stringify(gutenbergBlocks6, null, 2));
