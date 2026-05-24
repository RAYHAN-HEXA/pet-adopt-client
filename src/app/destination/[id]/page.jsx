import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const DestinationDetailsPage = async ({ params }) => {
  const { id } = await params;

  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const res = await fetch(`http://localhost:5000/destination/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const destination = await res.json();

  const {
    imageUrl,
    price,
    destinationName,
    duration,
    country,
    description,
  } = destination;

  return (
    <div>
      <img src={imageUrl} alt={destinationName} />

      <h1>{destinationName}</h1>

      <p>{country}</p>

      <p>{duration}</p>

      <p>{price}</p>

      <p>{description}</p>
    </div>
  );
};

export default DestinationDetailsPage;
