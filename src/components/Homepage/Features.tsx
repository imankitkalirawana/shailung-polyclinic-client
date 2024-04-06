import { BrainIcon, HeartIcon, KidneyIcon, LungsIcon } from "./FeaturesIcons";

const Features = () => {
  return (
    <>
      <section className="px-8 py-12 mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold text-center sm:text-start capitalize lg:text-3xl">
          Lab Features
        </h2>
        <p className="mb-16 text-sm text-center sm:text-start">
          Our platform provides a wide range of features for different diseases.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-16 lg:gap-x-24 gap-y-20">
          <div>
            <div className="flex items-center justify-center w-8 h-8 mb-4 text-red-600 bg-red-100 rounded-full">
              <HeartIcon className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-base font-semibold leading-tight">
              Heart Disease
            </h3>
            <p className="text-sm">
              Hand crafted dashboards for everything from Recurring Revenue to
              Customer Churn.
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center w-8 h-8 mb-4 text-pink-600 bg-pink-100 rounded-full">
              <BrainIcon className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-base font-semibold leading-tight">
              Neurologic
            </h3>
            <p className="text-sm">
              Your central hub that helps you see, and react to, absolutely
              everything that's happening.
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center w-8 h-8 mb-4 text-yellow-600 bg-yellow-100 rounded-full">
              <LungsIcon className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-base font-semibold leading-tight">
              Respiratory Disease
            </h3>
            <p className="text-sm">
              Stay informed with daily, weekly, or monthly reports on all your
              insights data.
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center w-8 h-8 mb-4 text-green-600 bg-green-100 rounded-full">
              <KidneyIcon className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-base font-semibold leading-tight">
              Kidney Disease
            </h3>
            <p className="text-sm">
              Our forecasting is your magical crystal ball that helps you
              predict and plan for the future.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
