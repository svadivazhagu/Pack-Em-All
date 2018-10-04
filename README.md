Assignment 4 - Real Web Apps: Designing for an Area of Life  
===

This assignment is intended to provide a semi-structured setting in which teams or individuals can exercise and hone their web development skills, while obtaining deeper experience in a predefined area.

The baseline aims of this assignment involve creating an application that demonstrates significant portions of all concepts covered in prior assignments, such as persistence, events, servers, etcetera.
The educational focus of this assignment is on developing a deeper skillset in a predefined area, for example social media applications.

You may use code from prior assignments.
However, you must indicate that you have done so clearly on your Readme, including links to any prior repos referenced.
Also, you may not *re-use* any tech or design achievements; these should always be new.

Baseline Requirements
---

In this assignment, your baseline requirement is to have a fully functional, deployed and web accessible application.
This application must include:

- Persistence using a database
- Event-based interaction on the front-end
- HTML CSS and JS as needed
- A well-organized server, if not using serverless architectures

Main Requirements
---

Given the sparse baseline requirements, most of your time should be focused on developing an application that operates within one of the A4 project areas:

- Security: Create an application that provides some form of a robust user experience while maintaining the highest possible security standards. Apps in the real world that meet this requirement include Signal, or Keybase.
- Games: Design and implement an interesting game mechanic as part of a fully functional web application. Recreations of classic games and well-known game mechanics will not recieve many points- focus instead on exploring an original idea.
- Social Media: Design and Prototype a new form of social media. In theory, conversations online could be as diverse in structure and form as they are in real life. In practice, social media platforms often restrict multiple types of conversations to the same form (comments, likes, tweets, etcetera). Groups in this area should explore new ways to have forms of conversation online.
- Commerce: There are many existing libraries for payments and store management. Groups in this area might create a store for a particular type of item or service. (Don't create a store for any goods or services that will get your professor- and you- in trouble. You can always re-use the code later.)
- Data: Data is becoming more pervasive in our daily lives. Groups in this area might create an "Interactive Explanation", explore data-driven journalism, create scientific visualizations for some area of research, and more.

**Above all else** -> Remember that you have limited time, energy, and attention to complete this project within the alloted time. I recommend that you consider spending substantial time on planning activities, and explore alternative ideas that may best fit these constraints.

(Protip: Here's how I would start this project- I would create a list of application ideas that fit some of the bins above, then meet with my team to discss everyone's lists, then decide on which idea we can implement in the alloted time, then make a gameplan on how to get it done. I would also plan out the possible tech and design achievements ahead of time, to avoid fully committing to high-risk ideas that may not pan out.)

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

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---
# Pack 'Em All: Circle Packing for Interactive Career Exploration
## By: dmcdonough & svadivazhagu | DATA | Circle Packing | Team PackEm
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
