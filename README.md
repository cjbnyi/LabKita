# LabKita!

**LabKita!** is a lab reservation system web application created for CCAPDEV (Web Application Development).  

The name is a play on "Lab," referring to laboratories, and "Kita," a Filipino word that can mean "you," "to see," or even "profit" (if you want to stretch the interpretation). It can also be read romantically, inspired by the Filipino phrase "*Love kita!*"—meaning "*I love you!*" in English.  

*Ang witty, ‘noh?*  

---

## Authors
The following students of De La Salle University - Manila, Philippines collaborated on this project:

<table>
  <thead>
    <tr>
      <th>Profile</th>
      <th>Author</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/cjbnyi.png" width="50" height="50" style="border-radius: 50%;" />
      </td>
      <td>
        <strong>Christian Joseph Bunyi</strong>  
        <br />
        <a href="https://github.com/cjbnyi">@cjbnyi</a>
      </td>
      <td>Fullstack</td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/nomu-chan.png" width="50" height="50" style="border-radius: 50%;" />
      </td>
      <td>
        <strong>Enzo Rafael Chan</strong>  
        <br />
        <a href="https://github.com/nomu-chan">@nomu-chan</a>
      </td>
      <td>Fullstack</td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/poolaplu.png" width="50" height="50" style="border-radius: 50%;" />
      </td>
      <td>
        <strong>Widenmar Embuscado</strong>  
        <br />
        <a href="https://github.com/poolaplu">@poolaplu</a>
      </td>
      <td>Frontend</td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/rovmont.png" width="50" height="50" style="border-radius: 50%;" />
      </td>
      <td>
        <strong>Rovin Niño Montaño</strong>
        <br />
        <a href="https://github.com/rovmont">@rovmont</a>
      </td>
      <td>Frontend</td>
    </tr>
  </tbody>
</table>

---

## Tech Stack  

List of technologies and frameworks used in the project:

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: Bootstrap, Handlebars, JavaScript
- **Authentication**: JWT (has yet to be implemented in Phase 3 of our MCO)  

---

## Dependencies

### NPM packages

The following NPM packages are used in this project:

| Package | Description |
|---------|-------------|
| **bcryptjs** | Password hashing library for authentication. |
| **cookie-parser** | Middleware to parse cookies in requests. |
| **dotenv** | Loads environment variables from a `.env` file. |
| **express** | Fast, minimalist web framework for Node.js. |
| **express-fileupload**| Simple middleware for handling file uploads. |
| **express-handlebars**| Handlebars templating engine for Express. |
| **express-session** | Session middleware for Express. |
| **express-validator** | Middleware for validating request data. |
| **hbs** | Handlebars view engine for Express. |
| **jsonwebtoken** | Library for generating and verifying JWTs. |
| **lodash** | Utility library for working with objects, arrays, and functions. |
| **mongodb** | Official MongoDB driver for Node.js. |
| **mongoose** | MongoDB object modeling tool. |
| **morgan** | HTTP request logger middleware for Node.js. |
| **node-cron** | Task scheduler for Node.js. |
| **path** | Utility for handling and transforming file paths. |
| **validator** | Library for string validation and sanitization. |


### Third-party libraries

The following third-party libraries are used in this project:

| Library | Description |
|---------|-------------|
| **Bootstrap** | Frontend framework for responsive UI design. |
| **Font Awesome** |	Icon library for adding scalable vector icons. |
| **jQuery** | JavaScript library for DOM manipulation and AJAX requests. |

These libraries are included via a CDN.

---

## Setup & Installation  

### Prerequisites  

Ensure you have the following installed in your system:

- Node.js
- MongoDB (local)
- npm or yarn  

### Installation Steps  

1. **Clone the repository:**  

    ```bash
    git clone https://github.com/cjbnyi/LabKita
    cd LabKita
    ```

2. **Install dependencies:**  
    
    ```sh
    npm install
    ```

    or 
    
    ```sh
    yarn install
    ```

3. **Set up environment variables:**  

    Duplicate `.env.example`, rename it to `.env`, then run the command

    ```
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```
    
    to generate a JWT secret token. It will be used for user authentication and
    authorization.  
    
    Feel free to modify the environment variables as needed.

4. **Run the server:**  

    ```
    node app.js
    ```

    *Note: If you have Nodemon installed, you can run `nodemon app.js` instead.*  

---

## AI & LLM Usage  

This project significantly utilized AI assistance in its development.
Large Language Models (LLMs) like ChatGPT were used to:

- Generate boilerplate code and documentation  
- Provide debugging suggestions and optimizations  
- Assist in structuring API endpoints and database queries  
- Suggest improvements to project architecture and data models  
- Explain and optimize regular expressions used in search functionality  
- Troubleshoot JavaScript and MongoDB-related issues  
- Help with writing and formatting the `README.md`  
- Improve UI/UX elements in the Handlebars templates  
- etc.

While AI-assisted, code was sufficiently reviewed, modified, and tested by the development team.
Notably, the collaboration served as a good learning opportunity for the developers, especially for
new or confusing programming concepts and syntax.  

---

## Limitations and Possible Errors

1. The Web App assumes that the user is
    - automatically logged in,
    - and is BOTH a user and an admin
    hence why a student account (Enzo Rafael Chan) has admin privileges. This is to simply show features that the admin can access.

2. The Web App also has not implemented the log-out feature. However, in the foreseeable future, features such as Managing Reservations and Edit Profile will be locked if logged out.

3. That's all (for now).

