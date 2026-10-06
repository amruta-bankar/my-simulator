Distance Vector Routing Simulator

A simple web-based Distance Vector Routing Simulator that demonstrates the working of the Distance Vector algorithm using the Bellman-Ford approach.

📌 Project Overview

The Distance Vector Routing Simulator helps users understand how routers exchange routing information and find minimum-cost paths in a network.

The simulator allows users to create a network, assign link costs, run the routing algorithm, view routing tables, find shortest paths, and observe the effect of link failures and restoration.

✨ Features
Add routers to the network
Add links between routers
Assign costs to links
Load a sample network
Clear the complete network
Initialize routing tables
Execute the algorithm round-by-round
Run the algorithm until convergence
Display routing tables
Find the shortest path between two routers
Display total path distance
Simulate link failure
Restore failed links
Recalculate routes automatically
Visualize the network topology
Display an event log of routing operations
🛠️ Technologies Used
HTML5 – Structure of the web application
CSS3 – Styling and layout
JavaScript – Routing algorithm and application logic
SVG – Network topology visualization
Bellman-Ford Algorithm – Distance Vector routing calculation
📂 Project Structure
Distance-Vector-Routing-Simulator/
│
├── index.html
├── style.css
├── script.js
└── README.md
index.html

Contains the structure of the simulator interface, including:

Network controls
Algorithm controls
Shortest path section
Event log
Network topology
Routing tables
style.css

Contains the styling of the application, including:

Page layout
Buttons
Tables
Input fields
Network visualization area
Responsive design
script.js

Contains the main functionality of the simulator, including:

Router and link management
Routing table initialization
Distance Vector algorithm
Convergence
Shortest path calculation
Link failure and restoration
SVG network visualization
🧪 How to Use
1. Build the Network

Click Add Router to create routers such as A, B, C and D.

Select two routers, enter a link cost, and click Add Link.

You can also click Load Sample Network to load a predefined network.

2. Run the Algorithm

Click:

Next Round – executes one routing round.
Run Until Stable – continues execution until the routing tables converge.
Reset Tables – resets the routing tables to their initial state.
3. View Routing Tables

The routing tables display:

Destination	Distance	Next Hop
A	0	A
B	2	B
C	3	B
D	5	B

The values are updated as the Distance Vector algorithm executes.

4. Find Shortest Path

Select a Source and Destination, then click Find Path.

The simulator displays the path and its total distance.

Example:

Path: A → B → C → D
Total distance: 5

The selected path is also highlighted in the network topology.

5. Test Link Failure

Click Fail link next to any active connection.

The simulator marks the link as down and automatically recalculates the routing tables using the remaining active links.

Click Restore link to restore the connection and recalculate the routes again.

🧠 Algorithm

The simulator uses the Distance Vector routing algorithm based on the Bellman-Ford approach.

The routing update is based on:

D(x,d) = min [ c(x,n) + D(n,d) ]

Where:

x = current router
d = destination router
n = neighbouring router
c(x,n) = cost from router x to neighbour n
D(n,d) = neighbour's distance to destination d

The process continues until no routing table changes occur. This state is called convergence.

📊 Sample Network

The built-in sample network contains four routers:

A
|\
| \
2  5
|   \
B---C
 \  | \
 4  1 2
   \ | /
     D

Sample link costs:

A - B = 2
A - C = 5
B - C = 1
B - D = 4
C - D = 2