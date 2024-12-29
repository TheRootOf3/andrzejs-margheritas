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
      .map(r => {
        let yaml = `  - name: "${r.name}"
    address: "${r.address}"
    coordinates:
      lat: ${r.coordinates.lat}
      lng: ${r.coordinates.lng}
    maps_url: "${r.maps_url}"`;
        
        if (r.score !== undefined) {
          yaml += `\n    score: ${r.score}`;
        }
        if (r.notes) {
          yaml += `\n    notes: "${r.notes}"`;
        }
        if (r.visited) {
          yaml += `\n    visited: "${r.visited}"`;
        }
        
        return yaml;
      })
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
    data.name.trim() !== "" &&
    typeof data.address === "string" &&
    data.address.trim() !== "" &&
    typeof data.coordinates?.lat === "number" &&
    !isNaN(data.coordinates.lat) &&
    typeof data.coordinates?.lng === "number" &&
    !isNaN(data.coordinates.lng) &&
    typeof data.maps_url === "string" &&
    data.maps_url.trim() !== "" &&
    (data.score === undefined || data.score === null || (typeof data.score === "number" && data.score >= 0 && data.score <= 5)) &&
    (data.notes === undefined || data.notes === null || typeof data.notes === "string") &&
    (data.visited === undefined || data.visited === null || data.visited === "" || (typeof data.visited === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.visited)))
  );
}
