# LabKita!
**LabKita!** is a lab reservation system web application created for CCAPDEV (Web Application Development).  

The name is a play on "Lab," referring to laboratories, and "Kita," a Filipino word that can mean "you," "to see," or even "profit" (if you want to stretch the interpretation). It can also be read romantically, inspired by the Filipino phrase "*Love kita!*"—meaning "*I love you!*" in English.  

*Ang witty, ‘noh?*  
<br>


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
<br>


## Tech Stack  
List of technologies and frameworks used in the project:
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: Bootstrap, Handlebars, JavaScript
- **Authentication**: JWT (has yet to be implemented in Phase 3)  
<br>


## Setup & Installation  

### Prerequisites  
Ensure you have the following installed in your system:
- Node.js
- MongoDB (local)
- npm or yarn  
<br>

### Installation Steps  

1. **Clone the repository:**  
    
    ```bash
    git clone https://github.com/cjbnyi/LabKita
    cd LabKita
    ```
<br>

2. **Install dependencies:**  
    
    ```
    npm install
    ```

    or 
    
    ```
    yarn install
    ```
<br>

3. **Set up environment variables:**  
    
    Create a `.env` file in the root directory.  

    You can duplicate `.env.example`, rename it to `.env`, and run the command  

    ```
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```

    to generate a JWT secret token. It will be used for user authentication and
    authorization.  
    
    Feel free to modify the environment variables as needed.  
<br>

4. **Run the server:**  

    ```
    node app.js
    ```

    *Note: If you have Nodemon installed, you can run `nodemon app.js` instead.*  
<br>


## Limitations and Possible Errors

1. The Web App assumes that the user is
    - automatically logged in,
    - and is BOTH a user and an admin
    hence why a student account (Enzo Rafael Chan) has admin privileges. This is to simply show features that the admin can access.

2. The Web App also has not implemented the log-out feature. However, in the foreseeable future, features such as Managing Reservations and Edit Profile will be locked if logged out.

3. That's all (for now).  
<br>

---

