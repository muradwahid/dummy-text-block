import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { AboutProModal } from '../../../../../bpl-tools/ProControls';
import { tabController } from '../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import { BBlocksAds, MediaEditControl } from '../../../../../bpl-tools/Components';

const Settings = (props) => {
	const { attributes, setAttributes } = props;


	return <>
		<InspectorControls>
			<div className='bPlInspectorInfo'>
				<BBlocksAds />
			</div>

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<General {...props}/>

				</>}


				{'style' === tab.name && <>
					
				</>}
			</>}</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;