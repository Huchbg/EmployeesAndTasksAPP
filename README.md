# EmployeesAndTasksAPP

First, the setup guide: In order to start the application, 
you have to create a new file and install all the necessary 
files in it. Then, you should double-click on the file named
 index.html and the application will be started.

My project is a vanilla JavaScript project and has two CSS 
style files and one JavaScript file. The JavaScript file has 
the "defer" property. Initially, my JavaScript was of type "modules,"
 but later my drive crashed and I had some problems, so now all the 
JavaScript is in one file.

My project uses local storage to retrieve information.
 At the core of my project, there are two main classes - Employee and Task - and two 
main arrays of information, respectively employees and tasks. 
Both arrays contain all the objects of their respective types. 
Every Task and Employee object has its own ID. 
Tasks can only have one assignee in the form of an ID. 
I have implemented all the functionality and have set some restrictions, such as:

Employees, when deleted, delete all tasks assigned to them.
When a task is set as finished, you can no longer update it.
Also, I thought of making it so that there are no tasks or employees with the same with the same information as other tasks and employees
, but I rejected this thought because 
there are update and delete options.
I also had sorting for tasks and employees, 
but it got destroyed. 
I have added the option of clearing all data.

There are two statistics I have added: 
top 5 employees with the most finished 
tasks in the last month and a task pie chart 
with all tasks from the last month.

My app is still not fully finished, 
but there is no more time. I think this is good enough. 
There are possibly some bugs, but I haven't found them. 
Also, the experience on mobile devices won't be the best.
