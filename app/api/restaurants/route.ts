import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Restaurant } from "@/lib/loadRestaurants";
import { writeFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";
import { readFileSync } from "fs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const newRestaurant = await request.json();
    
    // Validate the restaurant data
    if (!isValidRestaurant(newRestaurant)) {
      return new Response("Invalid restaurant data", { status: 400 });
    }

    // Read existing restaurants
    const filePath = join(process.cwd(), 'data', 'restaurants.yaml');
    const fileContents = readFileSync(filePath, 'utf8');
    const data = load(fileContents) as { restaurants: Restaurant[] };
    
    // Add new restaurant
    data.restaurants.push(newRestaurant);
    
    // Sort restaurants by name
    data.restaurants.sort((a, b) => a.name.localeCompare(b.name));
    
    // Write back to file
    const yamlStr = `restaurants:\n${data.restaurants
      .map(r => `  - name: "${r.name}"
    address: "${r.address}"
    coordinates:
      lat: ${r.coordinates.lat}
      lng: ${r.coordinates.lng}
    maps_url: "${r.maps_url}"
    group: "${r.group}"
    score: ${r.score}
    notes: "${r.notes}"`)
      .join("\n\n")}`;

    writeFileSync(filePath, yamlStr);

    return new Response("Restaurant added successfully", { status: 200 });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    return new Response("Error adding restaurant", { status: 500 });
  }
}

function isValidRestaurant(data: any): data is Restaurant {
  return (
    typeof data.name === "string" &&
    typeof data.address === "string" &&
    typeof data.coordinates?.lat === "number" &&
    typeof data.coordinates?.lng === "number" &&
    typeof data.maps_url === "string" &&
    typeof data.group === "string" &&
    typeof data.score === "number" &&
    data.score >= 0 &&
    data.score <= 10 &&
    typeof data.notes === "string"
  );
}
