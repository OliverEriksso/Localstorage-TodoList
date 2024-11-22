This is a practice project To-do list!
Here I test adding more complex features for practice!

This project contains:
  - Create tasks, move them to Finished or back to added (as well as delete)
  - Pagination for both Added & Finished task rows
  - Switch 3 different colors
  - Toggle hide description, finished/added tasks, hiding desc will also display more tasks as only titles (finished still don't work)
  - Simple 3d animated background using NPM package three.js

Will add:
  - Download localstorage data so that you may clear cache and save tasks (uploading then obviously comes with)
  - Drag and drop tasks, no idea how to make this.
  - Probably gonna add so you can drag and drop? Maybe a bit useless for this project but it would be fun to try making it
  - Maybe adding tags & searchbar if I feel like it
  - Maybe adding an entirely separate page for projects where you can add tasks for diff projects

Pain points:
  - No error handling for corrupt local storage etc
  - Messy massive script
  - Next time I might try using JS classes (though I don't entirely know what that is)
  - A little bitof  repetitive code

Clone the repository:

bash
git clone https://github.com/OliverEriksso/Localstorage-TodoList

cd repo-url

Install dependencies: 
Make sure to install the necessary libraries:
- npm install three
- npx vite
  
Open your browser: After running the server, open your browser and navigate to the localhost (usually http://localhost:3000)
