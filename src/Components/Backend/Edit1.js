import { RichText, useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from 'react';
const { dispatch } = wp.data

import { parseEmmetInput } from '../../gemini/chatgpt';
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

				// // Example 1: ul>li*3>p>lorem4
				// console.log("\nEmmet: 'ul>li*3>p>lorem4'");
				const parsed1 = parseEmmetInput(content);
				console.log(parsed1);
				// const gutenbergBlocks1 = generateGutenbergBlocks(parsed1);
				// console.log(gutenbergBlocks1);
				wp.data.dispatch('core/block-editor').insertBlocks(parsed1);
				setContent('');
			}
		};
		editor.addEventListener('keydown', handleMouseDown)

		return () => {
			editor.removeEventListener('keydown', handleMouseDown)
		}

	}, [editorRef.current, content])


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


// < !--wp: list-- >
// <ul class="wp-block-list"><!-- wp:list-item -->
// <li>sss</li>
// <!-- /wp:list-item -->

// <!-- wp:list-item -->
// <li>dddd</li>
// <!-- /wp:list-item --></ul>
// <!-- /wp:list -->
