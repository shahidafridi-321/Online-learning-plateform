import React from "react";
import { Label } from "../label";
import { Input } from "../input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../select";
import { Textarea } from "../textarea";

export const FormControls = ({ formControls = [], formData, setFormData }) => {
	const renderComponentByType = (getControlItem) => {
		let element = null;
		const currentControlItemValue = formData[getControlItem.name] || "";

		switch (getControlItem.componentType) {
			case "input":
				element = (
					<Input
						id={getControlItem.name}
						name={getControlItem.name}
						placeholder={getControlItem.placeholder}
						type={getControlItem.type}
						value={currentControlItemValue}
						onChange={(e) =>
							setFormData({
								...formData,
								[getControlItem.name]: e.target.value,
							})
						}
					/>
				);
				break;
			case "select":
				element = (
					<Select
						onValueChange={(value) =>
							setFormData({ ...formData, [getControlItem.name]: value })
						}
						value={currentControlItemValue}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={getControlItem.label} />
						</SelectTrigger>
						<SelectContent>
							{getControlItem.options && getControlItem.options.length > 0
								? getControlItem.options.map((optionsItem) => (
										<SelectItem key={optionsItem.id} value={optionsItem.id}>
											{optionsItem.label}
										</SelectItem>
								  ))
								: null}
						</SelectContent>
					</Select>
				);
				break;

			case "textarea":
				element = (
					<Textarea
						id={getControlItem.name}
						name={getControlItem.name}
						placeholder={getControlItem.placeholder}
						value={currentControlItemValue}
						onChange={(e) =>
							setFormData({
								...formData,
								[getControlItem.name]: e.target.value,
							})
						}
					/>
				);
				break;

			default:
				element = (
					<Input
						id={getControlItem.name}
						name={getControlItem.name}
						placeholder={getControlItem.placeholder}
						type={getControlItem.type}
						value={currentControlItemValue}
						onChange={(e) =>
							setFormData({
								...formData,
								[getControlItem.name]: e.target.value,
							})
						}
					/>
				);
				break;
		}
		return element;
	};
	return (
		<div className="flex flex-col gap-3">
			{formControls.map((controlItem) => (
				<div key={controlItem.name}>
					<Label htmlFor={controlItem.name}>{controlItem.label}</Label>
					{renderComponentByType(controlItem)}
				</div>
			))}
		</div>
	);
};
