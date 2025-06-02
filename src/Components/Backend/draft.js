// function generateElement(elementSpecifier) {
// 	const words = text.split(/\s+/).filter(word => word.length > 0);

// 	// If no tag or not matching expected pattern, return first 20 words as plain text
// 	const elementMatch = elementSpecifier.match(/^([a-z]+)?(\d*)$/i);
// 	if (!elementMatch || !elementMatch[1]) {
// 		return words.slice(0, 20).join(' ');
// 	}

// 	let elementName = elementMatch[1];
// 	let number = elementMatch[2];

// 	// Handle heading elements h1-h6
// 	if (elementName === 'h' && number.length >= 1) {
// 		const headingLevel = parseInt(number[0], 10);
// 		if (headingLevel >= 1 && headingLevel <= 6) {
// 			let wordCount = number.length > 1 ? parseInt(number.slice(1), 10) : 20;
// 			wordCount = Math.max(0, Math.min(wordCount, words.length));
// 			const selectedWords = wordCount > 0 ? words.slice(0, wordCount).join(' ') : '';
// 			const tag = `h${headingLevel}`;
// 			const element = document.createElement(tag);
// 			element.textContent = selectedWords;
// 			return element.outerHTML;
// 		} else {
// 			// Invalid heading level, return plain text
// 			return words.slice(0, 20).join(' ');
// 		}
// 	}

// 	// For non-heading elements
// 	let tag = elementName;
// 	let wordCount = number ? parseInt(number, 10) : 20;
// 	wordCount = Math.min(wordCount, words.length);
// 	const selectedWords = wordCount > 0 ? words.slice(0, wordCount).join(' ') : '';
// 	const element = document.createElement(tag);
// 	element.textContent = selectedWords;
// 	return element.outerHTML;
// }



// const insertAppropriateBlocks = (generatedContent) => {
//     // Split content by newlines if it contains multiple elements
//     const contentElements = generatedContent.split('\n').filter(el => el.trim() !== '');

//     contentElements.forEach(element => {
//         let blockName = 'core/paragraph'; // Default block type
//         let blockAttributes = { content: element };

//         // Extract the tag name from the HTML element
//         const tagMatch = element.match(/^<([a-z][a-z0-9]*)[^>]*>(.*)<\/\1>$/i);

//         if (tagMatch) {
//             const [, tagName, innerContent] = tagMatch;

//             // Determine block type based on tag name
//             switch (tagName.toLowerCase()) {
//                 case 'h1':
//                 case 'h2':
//                 case 'h3':
//                 case 'h4':
//                 case 'h5':
//                 case 'h6':
//                     blockName = 'core/heading';
//                     blockAttributes = {
//                         content: innerContent,
//                         level: parseInt(tagName.substring(1), 10)
//                     };
//                     break;
//                 case 'ul':
//                     blockName = 'core/list';
//                     blockAttributes = {
//                         values: innerContent,
//                         ordered: false
//                     };
//                     break;
//                 case 'ol':
//                     blockName = 'core/list';
//                     blockAttributes = {
//                         values: innerContent,
//                         ordered: true
//                     };
//                     break;
//                 case 'li':
//                     // If it's just a list item without a parent, wrap it in a ul
//                     blockName = 'core/list';
//                     blockAttributes = {
//                         values: `<ul>${element}</ul>`,
//                         ordered: false
//                     };
//                     break;
//                 default:
//                     // For all other tags, use paragraph block
//                     blockName = 'core/paragraph';
//                     blockAttributes = { content: element };
//             }
//         }

//         // Create and insert the block
//         const block = wp.blocks.createBlock(blockName, blockAttributes);
//         wp.data.dispatch('core/block-editor').insertBlocks(block);
//     });
// };




// function generateElement(str) {
// 	// Handle ul>li*4>lorem4 or ol>li*4>lorem4
// 	const listPattern = /^([uo]l)>li\*(\d+)>(.+)$/i;
// 	const listMatch = str.match(listPattern);
// 	if (listMatch) {
// 		const [, listTag, count, contentPart] = listMatch;
// 		const itemCount = parseInt(count, 10);
// 		const wordCountMatch = contentPart.match(/lorem(\d+)$/i);
// 		const wordCount = wordCountMatch ? parseInt(wordCountMatch[1], 10) : 20;
// 		const items = [];
// 		for (let i = 0; i < itemCount; i++) {
// 			const words = text.split(/\s+/).slice(0, wordCount).join(' ');
// 			items.push(`<li>${words}</li>`);
// 		}
// 		return `<${listTag}>\n${items.join('\n')}\n</${listTag}>`;
// 	}
// 	// If no tag or no content, just return the first 20 words
// 	if (!str || !str.includes('>')) {
// 		// Check for 'lorem' with a number, e.g., 'lorem3'
// 		const match = str && str.match(/^lorem(\d+)$/i);
// 		if (match) {
// 			const length = parseInt(match[1], 10);
// 			return text.split(/\s+/).slice(0, length).join(' ');
// 		}

// 		// Check for repeated element pattern like <h1>Lorem ipsum dolor*3
// 		const repeatedElementMatch = str && str.match(/^<([a-z][a-z0-9]*)>(.*)\*(\d+)$/i);
// 		if (repeatedElementMatch) {
// 			const [, tag, content, count] = repeatedElementMatch;
// 			const repeatCount = parseInt(count, 10);
// 			const elements = [];

// 			for (let i = 0; i < repeatCount; i++) {
// 				elements.push(`<${tag}>${content}</${tag}>`);
// 			}

// 			return elements.join('\n');
// 		}

// 		// Default: first 20 words
// 		return text.split(/\s+/).slice(0, 20).join(' ');
// 	}
// 	const nestedElementMatch = str.match(/^([a-z][a-z0-9]*)>([a-z][a-z0-9]*)\*(\d+)>(.+)$/i);
// 	if (nestedElementMatch) {
// 		const [, parentTag, childTag, count, contentPart] = nestedElementMatch;
// 		const childCount = parseInt(count, 10);

// 		// Extract word count from content part (e.g., lorem4)
// 		const wordCountMatch = contentPart.match(/lorem(\d+)$/i);
// 		const wordCount = wordCountMatch ? parseInt(wordCountMatch[1], 10) : 20;

// 		// Generate child elements
// 		const childElements = [];
// 		for (let i = 0; i < childCount; i++) {
// 			const words = text.split(/\s+/).slice(0, wordCount).join(' ');
// 			childElements.push(`<${childTag}>${words}</${childTag}>`);
// 		}

// 		// Wrap child elements in parent element
// 		return `<${parentTag}>\n  ${childElements.join('\n  ')}\n</${parentTag}>`;
// 	}

// 	// Check for pattern like p*3>lorem3 (multiple elements)
// 	const multipleElementMatch = str.match(/^([a-z][a-z0-9]*)\*(\d+)>(.+)$/i);
// 	if (multipleElementMatch) {
// 		const [, tag, count, contentPart] = multipleElementMatch;
// 		const elementCount = parseInt(count, 10);

// 		// Extract word count from content part (e.g., lorem3)
// 		const wordCountMatch = contentPart.match(/lorem(\d+)$/i);
// 		const wordCount = wordCountMatch ? parseInt(wordCountMatch[1], 10) : 20;

// 		// Generate multiple elements
// 		const elements = [];
// 		for (let i = 0; i < elementCount; i++) {
// 			const words = text.split(/\s+/).slice(0, wordCount).join(' ');
// 			elements.push(`<${tag}>${words}</${tag}>`);
// 		}
// 		return elements.join('\n');
// 	}

// 	// Original single element logic
// 	const [tag, content] = str.split('>');
// 	// Only allow valid tag names (letters and numbers, starting with a letter)
// 	if (!/^[a-z][a-z0-9]*$/i.test(tag)) return '';
// 	// Extract number from content, default to 20 if not found
// 	const match = content.match(/\d+$/);
// 	const length = match ? parseInt(match[0], 10) : 20;
// 	const words = text.split(/\s+/).slice(0, length).join(' ');
// 	return `<${tag}>${words}</${tag}>`;
// }




// const insertAppropriateBlocks = (generatedContent) => {
	// 	// Check if the generatedContent is a single list (ul or ol)
	// 	const listMatch = generatedContent.match(/^<(ul|ol)>([\s\S]*)<\/\1>$/i);
	// 	if (listMatch) {
	// 		const tagName = listMatch[1];
	// 		const innerContent = listMatch[2];
	// 		const ordered = tagName.toLowerCase() === 'ol';
	// 		const listItems = innerContent.match(/<li>([\s\S]*?)<\/li>/g) || [];
	// 		const listBlock =createBlock('core/list', { ordered });
	// 		listBlock.innerBlocks = listItems.map(item => {
	// 			const content = item.replace(/<li>([\s\S]*?)<\/li>/, '$1');
	// 			return createBlock('core/list-item', { content });
	// 		});
	// 		dispatch('core/block-editor').insertBlocks(listBlock);
	// 		return;
	// 	}

	// 	// Otherwise, handle as before (split by newlines for multiple elements)
	// 	const contentElements = generatedContent.split('\n').filter(el => el.trim() !== '');
	// 	contentElements.forEach(element => {
	// 		const tagMatch = element.match(/^<([a-z][a-z0-9]*)[^>]*>([\s\S]*)<\/\1>$/i);
	// 		if (tagMatch) {
	// 			const [, tagName, innerContent] = tagMatch;
	// 			const lowerTag = tagName.toLowerCase();
	// 			if (lowerTag.match(/^h[1-6]$/)) {
	// 				const block = createBlock('core/heading', {
	// 					content: innerContent,
	// 					level: parseInt(tagName.substring(1), 10)
	// 				});
	// 				dispatch('core/block-editor').insertBlocks(block);
	// 				return;
	// 			} else if (lowerTag === "div") { 
	// 				const groupBlock = createBlock('core/group', {
	// 					layout: { type: 'constrained' } // or 'flex'
	// 				});
	// 				// Insert the innerContent as a paragraph block inside the group
	// 				const innerParagraph = createBlock('core/paragraph', { content: innerContent });
	// 				groupBlock.innerBlocks = [innerParagraph];
	// 				dispatch('core/block-editor').insertBlocks(groupBlock);
	// 				return;
	// 			}
	// 			else if (lowerTag === 'blockquote') {
	// 				const paragraph = createBlock('core/paragraph', { content: innerContent });
	// 				// const block = createBlock('core/quote', { value: [innerContent] });
	// 				const block = createBlock('core/quote');
	// 				block.innerBlocks = [paragraph];
	// 				dispatch('core/block-editor').insertBlocks(block);
	// 				return;
	// 			} else if (lowerTag === 'pre') {
	// 				const block = createBlock('core/preformatted', { content: innerContent });
	// 				dispatch('core/block-editor').insertBlocks(block);
	// 				return;
	// 			} else if (lowerTag === "p") {
	// 				const block = createBlock('core/paragraph', { content: innerContent });
	// 				dispatch('core/block-editor').insertBlocks(block);
	// 				return;
	// 			} else {
	// 				const block = createBlock('core/paragraph', { content: element });
	// 				dispatch('core/block-editor').insertBlocks(block);
	// 			}
	// 		} else {
	// 			const block = createBlock('core/paragraph', { content: element });
	// 			dispatch('core/block-editor').insertBlocks(block);
	// 		}
	// 	});
	// };
  
  
// const insertAppropriateBlocks = (generatedContent) => {
//   // Helper: recursively parse HTML and return Gutenberg blocks
//   function htmlToBlocks(html) {
//     const blocks = [];
//     // Split top-level tags (not perfect for all HTML, but works for generated patterns)
//     const tagRegex = /<([a-z][a-z0-9]*)[^>]*>([\s\S]*?)<\/\1>/gi;
//     let match, lastIndex = 0;
//     while ((match = tagRegex.exec(html)) !== null) {
//       // Add any text before the tag as a paragraph
//       if (match.index > lastIndex) {
//         const text = html.slice(lastIndex, match.index).trim();
//         if (text) {
//           blocks.push(createBlock('core/paragraph', { content: text }));
//         }
//       }
//       const tag = match[1].toLowerCase();
//       const inner = match[2];

//       if (tag === 'ul' || tag === 'ol') {
//         const ordered = tag === 'ol';
//         const listItems = [];
//         const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
//         let liMatch;
//         while ((liMatch = liRegex.exec(inner)) !== null) {
//           listItems.push(createBlock('core/list-item', { content: liMatch[1] }));
//         }
//         const listBlock = createBlock('core/list', { ordered });
//         listBlock.innerBlocks = listItems;
//         blocks.push(listBlock);
//       } else if (tag === 'div' || tag === 'group') {
//         const groupBlock = createBlock('core/group', { layout: { type: 'constrained' } });
//         groupBlock.innerBlocks = htmlToBlocks(inner);
//         blocks.push(groupBlock);
//       } else if (tag.match(/^h[1-6]$/)) {
//         blocks.push(createBlock('core/heading', {
//           content: inner,
//           level: parseInt(tag[1], 10)
//         }));
//       } else if (tag === 'blockquote') {
//         const quoteBlock = createBlock('core/quote');
//         quoteBlock.innerBlocks = htmlToBlocks(inner);
//         blocks.push(quoteBlock);
//       } else if (tag === 'pre') {
//         blocks.push(createBlock('core/preformatted', { content: inner }));
//       } else if (tag === 'p') {
//         blocks.push(createBlock('core/paragraph', { content: inner }));
//       } else {
//         // For inline or unknown tags, preserve as HTML in a paragraph
//         blocks.push(createBlock('core/paragraph', { content: `<${tag}>${inner}</${tag}>` }));
//       }
//       lastIndex = tagRegex.lastIndex;
//     }
//     // Add any trailing text as a paragraph
//     const trailing = html.slice(lastIndex).trim();
//     if (trailing) {
//       blocks.push(createBlock('core/paragraph', { content: trailing }));
//     }
//     return blocks;
//   }

//   const blocks = htmlToBlocks(generatedContent);
//   blocks.forEach(block => dispatch('core/block-editor').insertBlocks(block));
// };