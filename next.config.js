module.exports = {
	reactStrictMode: true,
	images: {
		domains: ["cdn.sanity.io"]
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/products?page=0",
				permanent: true
			}
		];
	}
};
