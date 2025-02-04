import BannerImage from "../../../public/hero-img.jpg";

export const StudentHomePage = () => {
	return (
		<div className="min-h-screen ">
			<section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
				<div className="lg:w-1/2 lg:pr-12">
					<h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
					<p className="text-xl">
						Skills for your present and your future. Get Started with US
					</p>
				</div>
				<div className="lg:w-full mb-8 lg:mb-0">
					<img
						src={BannerImage}
						alt="BannerImage"
						width={"600px"}
						height={"400px"}
						className="w-10/12 h-[400px] rounded-lg shadow-lg"
					/>
				</div>
			</section>
		</div>
	);
};
