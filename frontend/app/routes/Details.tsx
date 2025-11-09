import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { v_type } = useParams<{ v_type: string }>();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Details Page</h1>
      {v_type ? (
        <p className="text-xl">Vehicle Type: {v_type}</p>
      ) : (
        <p className="text-xl">No vehicle type selected.</p>
      )}
      <button
        onClick={handleGoBack}
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
      >
        Go Back
      </button>
    </div>
  );
}