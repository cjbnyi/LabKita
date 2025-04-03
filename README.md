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

The following web technologies and frameworks were used for this project:

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: Bootstrap, Handlebars, JavaScript

---

## Dependencies

### NPM packages

### Dependencies

| Package                  | Description                                                   |
|--------------------------|---------------------------------------------------------------|
| **bcryptjs**              | Password hashing library for authentication.                  |
| **cookie-parser**         | Middleware to parse cookies in requests.                       |
| **dotenv**                | Loads environment variables from a `.env` file.                |
| **express**               | Fast, minimalist web framework for Node.js.                    |
| **express-fileupload**    | Simple middleware for handling file uploads.                  |
| **express-handlebars**    | Handlebars templating engine for Express.                      |
| **express-rate-limit**    | Middleware to limit repeated requests to protect against DoS attacks. |
| **express-session**       | Session middleware for Express.                                |
| **express-validator**     | Middleware for validating request data.                        |
| **hbs**                   | Handlebars view engine for Express.                            |
| **jsonwebtoken**          | Library for generating and verifying JWTs.                     |
| **lodash**                | Utility library for working with objects, arrays, and functions. |
| **moment-timezone**       | Library for working with timezones in JavaScript.              |
| **mongodb**               | Official MongoDB driver for Node.js.                           |
| **mongoose**              | MongoDB object modeling tool.                                  |
| **morgan**                | HTTP request logger middleware for Node.js.                    |
| **multer**                | Middleware for handling `multipart/form-data` (file uploads).   |
| **node-cron**             | Task scheduler for Node.js.                                    |
| **path**                  | Utility for handling and transforming file paths.              |
| **validator**             | Library for string validation and sanitization.                |
| **helmet**                | Helps secure Express apps by setting various HTTP headers.     |

### Third-party libraries

| Library | Description |
|---------|-------------|
| **Bootstrap** | Frontend framework for responsive UI design. |
| **Font Awesome** |	Icon library for adding scalable vector icons. |
| **jQuery** | JavaScript library for DOM manipulation and AJAX requests. |

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
    
    to generate distinct secrets for the JWT access token and the refresh token. They will be used for user authentication and authorization.  
    
    Feel free to modify the environment variables as needed.

4. **Seed the database (optional):**

    Optionally, you can seed the database by running the command

    ```
    npm run populate
    ```

    which ensures that the application has sample data ready for testing.

5. **Run the server:**  

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
