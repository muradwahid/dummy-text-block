import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import LoremIpsum from './Components/Frontend/LoremIpsum';

document.addEventListener('DOMContentLoaded', () => {
	const loremIpsumEls = document.querySelectorAll('.wp-block-b-blocks-lorem-ipsum');
	loremIpsumEls.forEach(loremIpsumEl => {
		const attributes = JSON.parse(loremIpsumEl.dataset.attributes);

		createRoot(loremIpsumEl).render(<>
			<Style attributes={attributes} id={loremIpsumEl.id} />
			
			<LoremIpsum attributes={attributes} />
		</>);

		loremIpsumEl?.removeAttribute('data-attributes');
	});
});