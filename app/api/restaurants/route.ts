import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Restaurant } from "@/lib/loadRestaurants";
import { load, dump } from "js-yaml";
import { Octokit } from "@octokit/rest";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

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

    // Handle development mode
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      const filePath = join(process.cwd(), 'data', 'restaurants.yaml');
      const currentContent = readFileSync(filePath, 'utf8');
      const data = load(currentContent) as { restaurants: Restaurant[] };
      
      if (!data.restaurants) {
        data.restaurants = [];
      }
      
      // Add new restaurant
      data.restaurants.push(newRestaurant);
      
      // Sort restaurants by name
      data.restaurants.sort((a, b) => a.name.localeCompare(b.name));
      
      // Write directly to file
      const yamlContent = dump({ restaurants: data.restaurants });
      writeFileSync(filePath, yamlContent, 'utf8');
      
      return new Response(JSON.stringify({ 
        message: "Restaurant added successfully in development mode",
        devMode: true
      }), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Production mode - Create PR
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data: fileData } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: 'data/restaurants.yaml',
      ref: 'main'
    });

    // Type guard for single file response
    if (!('content' in fileData)) {
      throw new Error('Unexpected API response format');
    }

    // Decode current content
    const currentContent = Buffer.from(fileData.content, 'base64').toString();
    const data = load(currentContent) as { restaurants: Restaurant[] };
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
      content: Buffer.from(yamlContent).toString('base64'),
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
  const isValidUnicodeString = (str: any) => 
    typeof str === "string" && str.trim() !== "";

  return (
    isValidUnicodeString(data.name) &&
    isValidUnicodeString(data.address) &&
    typeof data.coordinates?.lat === "number" &&
    !isNaN(data.coordinates.lat) &&
    typeof data.coordinates?.lng === "number" &&
    !isNaN(data.coordinates.lng) &&
    isValidUnicodeString(data.maps_url) &&
    (data.score === undefined || data.score === null || (typeof data.score === "number" && data.score >= 0 && data.score <= 5)) &&
    (data.notes === undefined || data.notes === null || isValidUnicodeString(data.notes)) &&
    (data.visited === undefined || data.visited === null || data.visited === "" || (typeof data.visited === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.visited)))
  );
}
