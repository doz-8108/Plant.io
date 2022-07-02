import { getSession } from "@auth0/nextjs-auth0";

const ADMIN_ID = process.env.ADMIN_ID;

const checkPermission = (req, res) => {
	const { user } = getSession(req, res);

	if (user.sub !== ADMIN_ID) {
		return {
			redirect: {
				destination: "/"
			}
		};
	}

	return null;
};

export default checkPermission;
