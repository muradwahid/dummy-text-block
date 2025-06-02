import { RichText, useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from 'react';
const { dispatch } = wp.data
const { createBlock } = wp.blocks;
import { text } from '../Common/dummyData';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { loremText } = attributes;
	const [content, setContent] = useState('');
	const [dummyContent, setDummyContent] = useState('');
	const editorRef = useRef(null);
	const editor = document.getElementById('editor');

	useEffect(() => {
		const handleMouseDown = (e) => {
			if (e.key === 'Tab' || e.key === ' ' || e.keyCode === 32) {
				const generatedContent = generateElement(content);
				setDummyContent(generatedContent);

				// Insert appropriate blocks based on generated content
				insertAppropriateBlocks(generatedContent);

				setContent('');
			}
		};
		editor.addEventListener('keydown', handleMouseDown)

		return () => {
			editor.removeEventListener('keydown', handleMouseDown)
		}

	}, [editorRef.current, content])
	
	
	const insertAppropriateBlocks = (generatedContent) => {
		// Helper: recursively parse HTML and return Gutenberg blocks
		function parseTableSection(sectionHtml) {
			const rows = [];
			const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
			let rowMatch;
			while ((rowMatch = rowRegex.exec(sectionHtml)) !== null) {
				const rowHtml = rowMatch[1];
				const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
				const cells = [];
				let cellMatch;
				while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
					cells.push({
						content: cellMatch[2],
						tag: cellMatch[1].toLowerCase()
					});
				}
				rows.push({ cells });
			}
			return rows;
		}
		function htmlToBlocks(html) {
			const blocks = [];
			const tagRegex = /<([a-z][a-z0-9]*)[^>]*>([\s\S]*?)<\/\1>/gi;
			let match, lastIndex = 0;
			while ((match = tagRegex.exec(html)) !== null) {
				if (match.index > lastIndex) {
					const text = html.slice(lastIndex, match.index).trim();
					if (text) {
						blocks.push(createBlock('core/paragraph', { content: text }));
					}
				}
				const tag = match[1].toLowerCase();
				const inner = match[2];

				if (tag === 'ul' || tag === 'ol') {
					const ordered = tag === 'ol';
					const listItems = [];
					const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
					let liMatch;
					while ((liMatch = liRegex.exec(inner)) !== null) {
						listItems.push(createBlock('core/list-item', { content: liMatch[1] }));
					}
					const listBlock = createBlock('core/list', { ordered });
					listBlock.innerBlocks = listItems;
					blocks.push(listBlock);
				} else if (tag === 'div' || tag === 'group') {
					const groupBlock = createBlock('core/group', { layout: { type: 'constrained' } });
					groupBlock.innerBlocks = htmlToBlocks(inner);
					blocks.push(groupBlock);
				} else if (tag.match(/^h[1-6]$/)) {
					blocks.push(createBlock('core/heading', {
						content: inner,
						level: parseInt(tag[1], 10)
					}));
				} else if (tag === 'blockquote') {
					const quoteBlock = createBlock('core/quote');
					quoteBlock.innerBlocks = htmlToBlocks(inner);
					blocks.push(quoteBlock);
				} else if (tag === 'pre') {
					blocks.push(createBlock('core/preformatted', { content: inner }));
				} else if (tag === 'p') {
					blocks.push(createBlock('core/paragraph', { content: inner }));
				} else if (tag === 'table') {
					// Helper to parse a table section (thead, tbody, tfoot, or table inner)

					let tableInner = inner;

					// Extract <thead>, <tbody>, <tfoot>
					const theadMatch = tableInner.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
					const tbodyMatch = tableInner.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
					const tfootMatch = tableInner.match(/<tfoot[^>]*>([\s\S]*?)<\/tfoot>/i);

					const head = theadMatch ? parseTableSection(theadMatch[1]) : [];
					const body = tbodyMatch
						? parseTableSection(tbodyMatch[1])
						: parseTableSection(
							tableInner
								.replace(/<thead[^>]*>[\s\S]*?<\/thead>/gi, '')
								.replace(/<tfoot[^>]*>[\s\S]*?<\/tfoot>/gi, '')
						);
					const foot = tfootMatch ? parseTableSection(tfootMatch[1]) : [];

					const tableBlock = createBlock('core/table', {
						hasFixedLayout: false,
						head,
						body,
						foot
					});
					blocks.push(tableBlock);
				} else {
					// For inline or unknown tags, preserve as HTML in a paragraph
					blocks.push(createBlock('core/paragraph', { content: `<${tag}>${inner}</${tag}>` }));
				}
				lastIndex = tagRegex.lastIndex;
			}
			const trailing = html.slice(lastIndex).trim();
			if (trailing) {
				blocks.push(createBlock('core/paragraph', { content: trailing }));
			}
			return blocks;
	}

		const blocks = htmlToBlocks(generatedContent);
		blocks.forEach(block => dispatch('core/block-editor').insertBlocks(block));
	};

	function generateElement(str) {
		// Helper to get lorem text
		const getLorem = (count) => text.split(/\s+/).slice(0, count).join(' ');

		// Recursive parser
		function parsePattern(pattern) {
			const getLorem = (count, offset = 0) => {
				const words = text.split(/\s+/);
				return words.slice(offset, offset + count).join(' ');
			};

			// Handle comma-separated siblings
			if (pattern.includes(',')) {
				return pattern.split(',').map(p => parsePattern(p.trim())).join('');
			}

			// tag*count>rest
			const tagCountPattern = /^([a-z][a-z0-9]*)\*(\d+)>(.+)$/i;
			let match = pattern.match(tagCountPattern);
			if (match) {
				const [, tag, count, rest] = match;
				const items = [];
				for (let i = 0; i < parseInt(count, 10); i++) {
					// For loremN, offset each sibling for variety
					if (/^lorem\d+$/i.test(rest)) {
						const loremCount = parseInt(rest.match(/\d+/)[0], 10);
						items.push(`<${tag}>${getLorem(loremCount, i * loremCount)}</${tag}>`);
					} else {
						items.push(parsePattern(`${tag}>${rest}`));
					}
				}
				return items.join('');
			}

			// tag>rest
			const tagPattern = /^([a-z][a-z0-9]*)>(.+)$/i;
			match = pattern.match(tagPattern);
			if (match) {
				const [, tag, rest] = match;
				const inner = parsePattern(rest);
				return `<${tag}>${inner}</${tag}>`;
			}

			// loremN
			const loremPattern = /^lorem(\d+)$/i;
			match = pattern.match(loremPattern);
			if (match) {
				return getLorem(parseInt(match[1], 10));
			}

			// Fallback: just return as is
			return pattern;
		}

		return parsePattern(str);
	}

	return <>
		<Settings {...{ attributes, setAttributes }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<div>
				<RichText
					tagName="div"
					ref={editorRef}
					value={content}
					onChange={val => setContent(val)}
					placeholder="Type your content here, e.g., p>lorem2 or p5"
				/>
				{/* <div style={{ marginTop: "20px" }} dangerouslySetInnerHTML={{ __html: loremText }} /> */}
				{/* <p>Lorem ipsum dolor sit.</p> */}
			</div>
		</div>


	</>;
}
export default Edit;

