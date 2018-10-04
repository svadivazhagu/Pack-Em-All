Assignment 4 - Real Web Apps: Designing for an Area of Life  
===
Deliverables
---

Do the following to complete this assignment:

1. Fork the starting project repo.
2. Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page, it displays correctly.
4. Deploy your project to Heroku or equivalent hosting platform.
5. **Ensure that your project has the proper naming scheme `a4-yourGitHubName` or `a4-yourTeamName` so we can find it.**
6. Modify the Readme to the specifications below.
7. Create and submit a Pull Request to the original repo.
---
# Pack 'Em All: Circle Packing for Interactive Career Exploration
## By: dmcdonough & svadivazhagu | DATA | Circle Packing | Team PackEm
[Check it out here!](https://a4-packem.herokuapp.com/)

The cicle packing problem is an optimization problem centered around figuring out how to most optimally "pack" unit circles into a larger circle without having circles overlap. Using this technique is a fantastic way to visualize a deeply nested data structure/tree as being able to see how the top level circle can be broken down into the deepest subcircle makes understanding the tree structure far easier. 
We applied our knowledge of the circle packing problem and leveraged our skills in D3.js to create an interactive data visualization about US employment data in 2014.

Users are able to update and delete occupation nodes. The bigger a circle, the more sub-careers
exist in it, meaning more people are working in that occupation.

The application serves as a means for career-minded individuals to really explore
what the possibilities are in their field of choice. Perhaps you didn't know that 
geological engineering was a career, and now you're on your way to studying the Earth's unique geology from this discovery.

## Technical Achievements
- **d3.js circle packing**: This project incorporated use of d3 significantly for designing this hierarchical graph format. Furthermore, a connection had to be made to the mongoDB cluster server that was hosting all our occupation data. All the text in the visualization is dynamically scaling, meaning it will never overstep its line/space.

- **Loading circle data from mongo**: The rendering of the graph in itself is a POST request to fetch the array of occupation data to be used. We spun up a mongoDB cluster based on AWS to host our database- there are **around 550 occupations and 146 million people represented** on this graph. 

- **Mobile optimization of d3 graph**: Had to calculate ratios using window sizes to optimize the viewing of the graph on all platforms, mobile included.

## Design/Evaluation Achievements
- **Togglable sidebar 1:** We implemented a sidebar that can be toggled shown and hidden with one click. This sidebar houses most of the user interactivity functionality. 

- **Loading GIF for when the graph takes too long to render:** We understand that some devices will be incapable of instantly rendering the d3 visualization. In this case, we implemented a loading GIF that is played until the rendering is done. This eliminates the user interactivity bottleneck of when the graph is loading for them. 

- **Sorting Study for Categorical Job Binning:** We performed user testing to identify *how* people like to categorize their jobs. We tested 10 users using a survey that asked them to
place where they believed some general education topics belonged. From this, we were able to get an initial sense of how people thought of the **nested hierarchy** that we studied so extensively. We learned how people best classify information in the brain, and modeled our approach to best align with that.

- **Sorting study for speed of node discovery between network graph and circle packing:** Similarly to the Categorical survey study that we performed, we also administered a speed test to compare and contrast the average user performance on two different graph types, when we were still identifying the best means of presentation. We set users up with two d3-rendered graph templates; one of which was a network graph ([Learn more here](http://scalar.usc.edu/works/querying-social-media-with-nodexl/what-is-a-network-graph-what-is-a-node-link-diagram)), the other being the circle packing graph. We observed that users were able to find their "desired" node significantly faster on the circle packing graph and thus decided to go with that as our official representation.
