const createBlock = wp.blocks.createBlock;
export function parseEmmetInput(input) {
    const lorem = generateLoremIpsum;

    // Match heading, paragraph, quote
    const simpleMatch = /^(p|h[1-6]|blockquote)>lorem(\d+)$/i;
    const listMatch = /^(ul|ol)>li\*(\d+)>lorem(\d+)$/i;

    if (simpleMatch.test(input)) {
        const [, tag, count] = input.match(simpleMatch);
        const wordCount = parseInt(count, 10);
        const content = lorem(wordCount);

        if (tag.startsWith('h')) {
            return createBlock('core/heading', {
                level: parseInt(tag[1], 10),
                content,
            });
        }

        if (tag === 'p') {
            return createBlock('core/paragraph', {
                content,
            });
        }

        if (tag === 'blockquote') {
            const blockQuote = createBlock('core/quote');
            const p = createBlock('core/paragraph', {
                content,
            });
            console.log(p);
            blockQuote.innerBlocks = [p];
            return blockQuote;



        }
    }

    if (listMatch.test(input)) {
        const [, type, itemCount, wordCount] = input.match(listMatch);
        const items = Array.from({ length: parseInt(itemCount, 10) }, () =>
            generateLoremIpsum(parseInt(wordCount, 10))
        );

        const content = items.map(item => `<li>${item}</li>`).join("");

        return createBlock('core/list', {
            values: `<ul>${content}</ul>`,
            ordered: type === 'ol',
        });
    }

    return null;
}

function generateLoremIpsum(wordCount) {
    const words = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
    let result = [];
    while (result.length < wordCount) {
        result = result.concat(words);
    }
    return result.slice(0, wordCount).join(" ");
}
