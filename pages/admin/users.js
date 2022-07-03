import React, { useState } from "react";
import List from "../../components/shared/List";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import SubHeader from "../../components/shared/SubHeader";
import Container from "../../components/user/Container";
import client from "../../utils/sanity.client";
import checkPermission from "../../utils/checkPermission";

const headCells = [
	{
		field: "id",
		headerName: "User ID",
		flex: 1,
		minWidth: 320
	},
	{
		field: "firstName",
		headerName: "First name",
		minWidth: 150
	},
	{
		field: "lastName",
		headerName: "Last name",
		minWidth: 150
	},
	{
		field: "address",
		headerName: "Address",
		minWidth: 150
	},
	{
		field: "district",
		headerName: "District",
		minWidth: 150
	},
	{
		field: "phone",
		headerName: "Phone number",
		minWidth: 150
	},
	{
		field: "email",
		headerName: "Email",
		minWidth: 150
	}
];

const Users = props => {
	const [users, setUsers] = useState(props.users);
	const searchMethod = name => {
		client
			.getUsersByName(name)
			.then(data =>
				setUsers(data.map(u => ({ ...u, district: u.district[0], id: u._id })))
			);
	};

	return (
		<Container>
			<SubHeader title="All Users" />
			<List header={headCells} list={users} searchMethod={searchMethod} />
		</Container>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const isNotAdmin = checkPermission(req, res);
		if (isNotAdmin) return isNotAdmin;

		const users = await client.getUsers();

		return {
			props: {
				users: users.map(u => ({ ...u, district: u.district[0], id: u._id }))
			}
		};
	}
});

export default Users;
