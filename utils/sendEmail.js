const sendEmail = mailList => {
	if (!mailList.length) return window.alert("Please select row");

	let mailListPrefix = "mailto:";

	if (mailList.length === 1)
		mailListPrefix = mailListPrefix + mailList[0] + ";";

	window.open(`mailto:${mailListPrefix}`);
};

export default sendEmail;
