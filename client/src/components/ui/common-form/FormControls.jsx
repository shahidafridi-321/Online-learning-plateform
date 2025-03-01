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

export const FormControls = ({
	formControls = [],
	formData,
	setFormData,
	errors = {},
}) => {
	const renderComponentByType = (getControlItem) => {
		let element = null;
		const currentControlItemValue = formData[getControlItem.name] || "";
		const errorMessage = errors[getControlItem.name];

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
						className={`w-full px-4 py-2.5 text-sm md:text-base rounded-lg border ${
							errorMessage
								? "border-red-500 dark:border-red-500"
								: "border-gray-300 dark:border-gray-700"
						} focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-300 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900`}
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
						<SelectTrigger
							className={`w-full px-4 py-2.5 text-sm md:text-base rounded-lg border ${
								errorMessage
									? "border-red-500 dark:border-red-500"
									: "border-gray-300 dark:border-gray-700"
							} focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
						>
							<SelectValue
								placeholder={getControlItem.placeholder || getControlItem.label}
							/>
						</SelectTrigger>
						<SelectContent className="rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg mt-1 bg-white dark:bg-gray-900">
							{getControlItem.options?.map((optionsItem) => (
								<SelectItem
									key={optionsItem.id}
									value={optionsItem.id}
									className="text-sm md:text-base px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
								>
									{optionsItem.label}
								</SelectItem>
							))}
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
						className={`w-full px-4 py-2.5 text-sm md:text-base rounded-lg border ${
							errorMessage
								? "border-red-500 dark:border-red-500"
								: "border-gray-300 dark:border-gray-700"
						} focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-300 min-h-[100px] placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-all`}
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
						className={`w-full px-4 py-2.5 text-sm md:text-base rounded-lg border ${
							errorMessage
								? "border-red-500 dark:border-red-500"
								: "border-gray-300 dark:border-gray-700"
						} focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-300 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900`}
					/>
				);
				break;
		}
		return element;
	};

	return (
		<div className="flex flex-col gap-4 sm:gap-5">
			{formControls.map((controlItem) => (
				<div key={controlItem.name} className="space-y-2">
					<Label
						htmlFor={controlItem.name}
						className="text-sm font-medium text-gray-700 dark:text-gray-200 sm:text-base"
					>
						{controlItem.label}
						{controlItem.required && (
							<span className="text-red-500 dark:text-red-500 ml-1">*</span>
						)}
					</Label>
					{renderComponentByType(controlItem)}
					{errors[controlItem.name] && (
						<p className="text-red-500 dark:text-red-500 text-sm mt-1">
							{errors[controlItem.name]}
						</p>
					)}
				</div>
			))}
		</div>
	);
};
