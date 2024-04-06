
const Pricing = () => {
  return (
    <>
      <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Our Pricing Plans
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-4 my-4">
            <div className="px-6 py-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Basic</h2>
              <p className="text-gray-600 mb-4">
                Perfect for individuals or small teams
              </p>
              <div className="text-5xl font-bold text-gray-800 mb-8">
                $9<span className="text-lg">/month</span>
              </div>
              <a
                href="#"
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Get Started
              </a>
            </div>
            <div className="px-6 pt-4 pb-8">
              <ul className="list-disc list-inside text-gray-600">
                <li>5 GB Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>Email Support</li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-4 my-4">
            <div className="px-6 py-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pro</h2>
              <p className="text-gray-600 mb-4">
                Great for small to medium businesses
              </p>
              <div className="text-5xl font-bold text-gray-800 mb-8">
                $29<span className="text-lg">/month</span>
              </div>
              <a
                href="#"
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Get Started
              </a>
            </div>
            <div className="px-6 pt-4 pb-8">
              <ul className="list-disc list-inside text-gray-600">
                <li>50 GB Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>Priority Email Support</li>
                <li>Custom Domain</li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-4 my-4">
            <div className="px-6 py-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Enterprise
              </h2>
              <p className="text-gray-600 mb-4">
                For large organizations and teams
              </p>
              <div className="text-5xl font-bold text-gray-800 mb-8">
                $99<span className="text-lg">/month</span>
              </div>
              <a
                href="#"
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Get Started
              </a>
            </div>
            <div className="px-6 pt-4 pb-8">
              <ul className="list-disc list-inside text-gray-600">
                <li>Unlimited Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>24/7 Email & Phone Support</li>
                <li>Custom Domain</li>
                <li>Dedicated Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
