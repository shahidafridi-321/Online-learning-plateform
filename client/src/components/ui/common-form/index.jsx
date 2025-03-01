import React from "react";
import { Button } from "../button";
import { FormControls } from "./FormControls";
import { Loader2 } from "lucide-react"; // Assuming lucide-react for the spinner icon

export const CommonForm = ({
	handleSubmit,
	buttonText,
	formControls,
	formData,
	setFormData,
	isButtonDisabled = false,
	isSubmitting = false, // New prop for loading state
	errors = {}, // New prop for form-wide errors
}) => {
	return (
		<form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
			<FormControls
				formControls={formControls}
				formData={formData}
				setFormData={setFormData}
				errors={errors} // Pass errors to FormControls
			/>
			<Button
				type="submit"
				className={`w-full py-3 text-sm md:text-base font-medium rounded-lg transition-all flex items-center justify-center ${
					isButtonDisabled || isSubmitting
						? "bg-gray-300 cursor-not-allowed text-gray-500"
						: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
				}`}
				disabled={isButtonDisabled || isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="animate-spin mr-2 h-5 w-5" />
						Submitting...
					</>
				) : (
					buttonText || "Submit"
				)}
			</Button>
		</form>
	);
};
