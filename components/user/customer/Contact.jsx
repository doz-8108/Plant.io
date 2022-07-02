import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";

import client from "../../../utils/sanity.client";
import { pushErrorAlert, pushSuccessAlert } from "../../../utils/alert";
import { TextButton } from "../../shared/Buttons";

const Contact = ({ contact, userId }) => {
	const { user } = useUser();
	const [isLoading, setLoading] = useState(false);
	const [formVal, setFormVal] = useState(
		contact || {
			firstName: "",
			lastName: "",
			address: "",
			district: "New Territories",
			phone: "",
			instructions: ""
		}
	);

	const handleFormVal = e => {
		setFormVal({ ...formVal, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = async e => {
		e.preventDefault();
		try {
			setLoading(true);

			await client.updateUserContact({
				_id: userId,
				...formVal,
				email: user.email,
				district: [formVal.district]
			});
			pushSuccessAlert("Your contact information has been updated!");
		} catch (error) {
			pushErrorAlert("Service is not available!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mb-10 xl:mr-10">
			<form
				className="my-5 grid grid-cols-2 gap-7 sm:w-[600px] "
				onSubmit={e => handleFormSubmit(e)}
			>
				<div className="col-span-2 flex flex-wrap lg:justify-between">
					<input
						className="rounded-lg bg-gray-100 py-2 pl-3 outline-2 outline-color-primary basis-full lg:basis-[48%] lg:mb-0 mb-7"
						type="text"
						aria-label="first name"
						value={formVal.firstName}
						name="firstName"
						placeholder="First name"
						required
						onChange={e => handleFormVal(e)}
					/>
					<input
						className="rounded-lg bg-gray-100 py-2 pl-3 outline-2 outline-color-primary basis-full lg:basis-[48%]"
						type="text"
						aria-label="last name"
						value={formVal.lastName}
						name="lastName"
						placeholder="Last name"
						required
						onChange={e => handleFormVal(e)}
					/>
				</div>
				<input
					className="rounded-lg bg-gray-100 py-2 pl-3 outline-2 outline-color-primary col-span-2"
					type="text"
					aria-label="address"
					value={formVal.address}
					name="address"
					placeholder="Address"
					required
					onChange={e => handleFormVal(e)}
				/>
				<div className="col-span-2">
					<select
						className="border p-2 rounded-lg outline-color-primary"
						value={formVal.district}
						name="district"
						placeholder="District"
						onChange={e => handleFormVal(e)}
					>
						<option>New Territories</option>
						<option>Kowloon</option>
						<option>Hong Kong Island</option>
					</select>
				</div>
				<div className="col-span-2">
					<div className="min-w-[300px] relative">
						<input
							className="rounded-lg bg-gray-100 py-2 pl-3 outline-2 outline-color-primary w-full"
							type="tel"
							value={formVal.phone}
							name="phone"
							placeholder="Phone number (HK)"
							required
							onChange={e => handleFormVal(e)}
						/>
						<img
							className="absolute w-7 g-7 left-[90%] sm:left-[95%] top-1/2 transform -translate-y-1/2 -translate-x-1/2"
							src="/hk-flag.png"
							alt="Only telephone number for Hong Kong is allowed"
						/>
					</div>
				</div>
				<textarea
					className="col-span-2 h-40 border-2 rounded-lg resize-none outline-color-primary py-2 pl-3"
					value={formVal.instructions}
					name="instructions"
					placeholder="Delivery instruction - (optional)"
					onChange={e => handleFormVal(e)}
					maxLength={300}
				/>
				<div className="col-span-2 flex justify-end">
					{isLoading ? (
						<CircularProgress sx={{ color: "var(--color-primary)" }} />
					) : (
						<TextButton text="SUBMIT" custom={{ padding: 0 }} />
					)}
				</div>
			</form>
		</div>
	);
};

export default Contact;
