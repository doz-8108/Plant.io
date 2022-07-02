import sanityClient from "@sanity/client";
import imageURLBuilder from "@sanity/image-url";
import dayjs from "dayjs";

class Sanity {
	constructor() {
		this.client = sanityClient({
			projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
			dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
			apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
			token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
			ignoreBrowserTokenWarning: true
		});
		this.imageURLbuilder = new imageURLBuilder(this.client);
	}

	// ================ utils for IMAGE =================
	getImageURL(imageId) {
		return this.imageURLbuilder.image(imageId).url();
	}

	uploadImage(file) {
		return this.client.assets.upload("image", file);
	}

	// ================ utils for PRODUCT ================
	getProducts() {
		return this.client.fetch("*[_type == 'product']");
	}

	getProductBySales() {
		return this.client.fetch("*[_type == 'product'] | order(sales desc)[0..4]");
	}

	getProductsByName(name) {
		return this.client.fetch(
			"*[_type == 'product' && productName match $name]",
			{
				name: `${name}*` /* match pattern begin with */
			}
		);
	}

	getProductById(id) {
		return this.client.fetch("*[_type == 'product' && _id == $id]", { id });
	}

	getProductsByIds(ids) {
		return this.client.fetch("*[_type == 'product' && _id in $ids]", {
			ids
		});
	}

	async createProduct(product) {
		return this.client.create(product);
	}

	updateProduct(id, product) {
		return this.client.patch(id).set(product).commit();
	}

	updateProductRating(id, rating) {
		return this.client.patch(id).set({ rating }).commit();
	}

	getProductCategories() {
		return this.client.fetch("*[_type == 'product']{categories}");
	}

	// only used in admin page
	getUnPublishedComments() {
		return this.client.fetch(
			"*[_type == 'comment' && published == false]{..., 'product': product->{_id, productName}, 'user': user->{firstName, lastName, _id}}"
		);
	}

	getProductComments(id) {
		return this.client.fetch(
			"*[_type == 'comment' && product._ref == $id && published == true]{_id, content, rating, published, createdAt, 'user':user->{firstName, lastName}}",
			{
				id
			}
		);
	}

	deleteProduct(ids) {
		return this.client.delete({
			query: "*[_type == 'product' && _id in $ids]",
			params: { ids }
		});
	}

	// ================ utils for USER =====================
	getUsers() {
		return this.client.fetch("*[_type == 'user']");
	}

	getUsersByName(name) {
		return this.client.fetch(
			"*[_type == 'user' && firstName+' '+lastName match $name ]",
			{ name: `${name}*` }
		);
	}

	getUserContact(id) {
		return this.client.fetch("*[_type == 'user' && _id == $id]", {
			id
		});
	}

	updateUserContact(contact) {
		return this.client.createOrReplace({ _type: "user", ...contact });
	}

	// ================ utils for ORDER =====================
	getOrder(id) {
		return this.client.fetch("*[_type == 'order' && _id == $id]", { id });
	}

	getOrdersByUserId(id, index = 0) {
		return this.client.fetch(
			"*[_type == 'order' && user._ref == $id]{..., 'products': products[]{price, quantity, ...product->{'preview': previews[0], productName, price, categories, _id}}, 'status': status[0], user->}[$start..$end]",
			{ id, start: index * 3, end: index * 3 + 2 }
		);
	}

	getOrders() {
		return this.client.fetch(
			"*[_type == 'order']{..., 'products': products[]{price, quantity, ...product->{'preview': previews[0], productName, price, categories, _id}}, 'status': status[0], user->}"
		);
	}

	async createOrder(products, user) {
		const contact = (await this.getUserContact(user._ref))[0];
		const { phone, address, district } = contact;
		const addressInFull = `${address} ${district}`;

		// const month = dayjs().month();
		// const profit = Math.round(
		// 	products.reduce((prev, p) => prev + p.quantity * p.price, 0)
		// );

		// await this.updateDataByMonth(month, profit);

		return this.client.create({
			_type: "order",
			date: dayjs(Date.now()).format("YYYY-MM-DD hh:mm"),
			status: ["preparing"],
			products,
			user,
			phone,
			address: addressInFull
		});
	}

	updateOrder(id, status) {
		return this.client
			.patch(id)
			.set({ status: [status] })
			.commit();
	}

	async cancelOrder(orderId) {
		return this.client.delete({
			query: "*[_type == 'order' && _id == $orderId]",
			params: { orderId }
		});
	}

	// ================ utils for SALES data =====================
	async getDataByYear() {
		return (await this.client.fetch("*[_type == 'monthly_data']{records}"))[0]
			.records;
	}

	async getDataByMonth(month) {
		return this.client.fetch(
			"*[_type == 'monthly_data']{'record': records[$month]}",
			{
				month
			}
		);
	}

	async updateDataByMonth(month, profit) {
		const statistics = (
			await this.client.fetch("*[_type == 'monthly_data']")
		)[0];

		const { records } = statistics;
		records[month].sales += 1;
		records[month].profit += profit;

		return this.client.patch(statistics._id).set({ records }).commit();
	}

	updateProductSales(id, qty) {
		return this.client.patch(id).inc({ sales: qty });
	}

	// ================ utils for COMMENTS =====================
	composeComment(content, rating, userId, productId) {
		return this.client.create({
			_type: "comment",
			content,
			rating,
			published: false,
			user: {
				_ref: userId,
				_type: "reference"
			},
			product: {
				_ref: productId,
				_type: "reference"
			},
			createdAt: dayjs(Date.now()).format("YYYY-MM-DD hh:mm")
		});
	}

	async publishComment(commentId, productId, rating) {
		const productComments = await this.getProductComments(productId);
		let avg_rating =
			(productComments.reduce((prev, p) => prev + p.rating, 0) + rating) /
			(productComments.length + 1);

		await this.updateProductRating(productId, avg_rating);
		return this.client.patch(commentId).set({ published: true }).commit();
	}

	deleteComment(commentId) {
		return this.client.delete({
			query: "*[_type == 'comment' && _id == $commentId]",
			params: { commentId }
		});
	}

	async didCommentBefore(userId, productId) {
		const result = await this.client.fetch(
			"*[_type == 'comment' && user._ref == $userId && product._ref == $productId]",
			{ userId, productId }
		);

		return result.length === 1;
	}
}

const client = new Sanity();

export default client;
