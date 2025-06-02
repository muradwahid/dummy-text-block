const LoremIpsum = ({ attributes }) => {
	const { loremText } = attributes;
	console.log(loremText);
	return <div dangerouslySetInnerHTML={{ __html: loremText }}>
	</div>
}
export default LoremIpsum;