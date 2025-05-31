const Style = ({ attributes, id }) => {

	const mainSl = `#${id}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		
	`}} />;
}
export default Style;