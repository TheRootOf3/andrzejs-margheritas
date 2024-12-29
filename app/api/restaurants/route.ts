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

    // Read existing restaurants or create new data structure
    const filePath = join(process.cwd(), 'data', 'restaurants.yaml');
    let data: { restaurants: Restaurant[] };
    
    try {
      const fileContents = readFileSync(filePath, 'utf8');
      data = load(fileContents) as { restaurants: Restaurant[] };
      if (!data.restaurants) {
        data.restaurants = [];
      }
    } catch (error) {
      // If file doesn't exist or is empty, create new data structure
      data = { restaurants: [] };
    }
    
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
    score: ${r.score}
    notes: "${r.notes}"
    visited: "${r.visited}"`)
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
    typeof data.score === "number" &&
    data.score >= 0 &&
    data.score <= 5 &&
    typeof data.notes === "string" &&
    typeof data.visited === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(data.visited)
  );
}
