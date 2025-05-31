import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import LoremIpsum from './Components/Frontend/LoremIpsum';

document.addEventListener('DOMContentLoaded', () => {
	const blockNameEls = document.querySelectorAll('.wp-block-b-blocks-lorem-ipsum');
	blockNameEls.forEach(blockNameEl => {
		const attributes = JSON.parse(blockNameEl.dataset.attributes);

		createRoot(blockNameEl).render(<>
			<Style attributes={attributes} id={blockNameEl.id} />

			<LoremIpsum attributes={attributes} />
		</>);

		blockNameEl?.removeAttribute('data-attributes');
	});
});