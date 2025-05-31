import { RichText, useBlockProps } from '@wordpress/block-editor';
import { useRef, useState } from 'react';

import { useEffect } from 'react';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { text } from '../Common/dummyData';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { loremText } = attributes;
	const [content, setContent] = useState('');
	const [dummyContent, setDummyContent] = useState('');
	const editorRef = useRef(null);
	const editor = document.getElementById('editor');

	useEffect(() => {
		editor.addEventListener('keydown', (e) => {
			// if (e.key === 'Tab') 
			if (e.key === 'Tab' || e.key === ' ') {
				setDummyContent(generateElement(content))
				setContent('');
			}

		})
	}, [editorRef.current, content])
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
	function generateElement(str) {
			// If no tag or no content, just return the first 20 words
			if (!str || !str.includes('>')) {
				// Check for 'lorem' with a number, e.g., 'lorem3'
				const match = str && str.match(/^lorem(\d+)$/i);
				if (match) {
					const length = parseInt(match[1], 10);
					return text.split(/\s+/).slice(0, length).join(' ');
				}
				// Default: first 20 words
				return text.split(/\s+/).slice(0, 20).join(' ');
			}
			const [tag, content] = str.split('>');
			// Only allow valid tag names (letters and numbers, starting with a letter)
			if (!/^[a-z][a-z0-9]*$/i.test(tag)) return '';
			// Extract number from content, default to 20 if not found
			const match = content.match(/\d+$/);
			const length = match ? parseInt(match[0], 10) : 20;
			const words = text.split(/\s+/).slice(0, length).join(' ');
			return `<${tag}>${words}</${tag}>`;
	}
	// Example usage:
	// const result = extractTagAndLength("h2>lorem20");
	// console.log(result); // { tag: "h2", length: 20 }

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
				<div style={{ marginTop: "20px" }} dangerouslySetInnerHTML={{ __html: dummyContent }} />
				{/* <p>Lorem ipsum dolor sit.</p> */}
			</div>
		</div>
	</>;
}
export default Edit;