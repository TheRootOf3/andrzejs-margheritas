import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Restaurant } from "@/lib/loadRestaurants";
import { load, dump } from "js-yaml";
import { Octokit } from "@octokit/rest";
import { encode } from "base-64";

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

    // Initialize Octokit with GitHub token
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Get current content of restaurants.yaml
    const { data: fileData } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: 'data/restaurants.yaml',
      ref: 'main'
    });

    // Decode current content
    const currentContent = Buffer.from(fileData.content, 'base64').toString();
    let data = load(currentContent) as { restaurants: Restaurant[] };
    if (!data.restaurants) {
      data.restaurants = [];
    }
    
    // Add new restaurant
    data.restaurants.push(newRestaurant);
    
    // Sort restaurants by name
    data.restaurants.sort((a, b) => a.name.localeCompare(b.name));
    
    // Create a new branch
    const branchName = `add-restaurant-${Date.now()}`;
    const mainRef = await octokit.git.getRef({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      ref: 'heads/main',
    });

    await octokit.git.createRef({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      ref: `refs/heads/${branchName}`,
      sha: mainRef.data.object.sha,
    });

    // Generate new YAML content
    const yamlContent = dump({ restaurants: data.restaurants });

    // Create commit with new content
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: 'data/restaurants.yaml',
      message: `Add restaurant: ${newRestaurant.name}`,
      content: encode(yamlContent),
      branch: branchName,
      sha: (fileData as any).sha,
    });

    // Create pull request
    const pr = await octokit.pulls.create({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      title: `Add restaurant: ${newRestaurant.name}`,
      head: branchName,
      base: 'main',
      body: `Adding new restaurant:
      
- Name: ${newRestaurant.name}
- Address: ${newRestaurant.address}
${newRestaurant.score !== undefined ? `- Score: ${newRestaurant.score}/5` : ''}
${newRestaurant.notes ? `- Notes: ${newRestaurant.notes}` : ''}
${newRestaurant.visited ? `- Visited: ${newRestaurant.visited}` : ''}`,
    });

    return new Response(JSON.stringify({ 
      message: "Pull request created successfully",
      prUrl: pr.data.html_url 
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
