
import ballerina/http;

configurable int port = 8080;

public type User record {
    readonly int id;
    string email;
    string password;
};

public type ResetPasswordData record {
    string email;
};

public type LoginData record {
    string email;
    string password;
};

table<User> key(id) users = table [
       {id: 1, email: "user1@gmail.com", password: "password1"},
        {id: 2, email: "user2@gmail.com", password: "password2"},
        {id: 3, email: "user3@gmail.com", password: "password3"}
    ];

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}

service / on new http:Listener(port) {

    // GET /users - retrieves a list of all users
    resource function get users() returns User[] {
        return users.toArray();
    }

    // GET /users/<id> - retrieves a single user with a specific ID
    resource function get users/[int id]() returns User|http:NotFound {
        User? user = users[id];
        if user is () {
            return http:NOT_FOUND;
        } else {
            return user;
        }
    }

   // POST /users - the request body should contain a new User object that will be added to the list of users
    resource function post users(@http:Payload User newUser, http:Caller caller) {
    foreach var user in users {
        if (user.id == newUser.id) {
            http:Response res = new;
            res.statusCode = 400; // Bad Request
            res.setPayload("User with the same id already exists.");
            checkpanic caller->respond(res);
            return;
        }
    }
    users.add(newUser);
    http:Response res = new;
    res.statusCode = 201; // Created
    json payload = newUser.toJson(); 
    res.setPayload(payload);
    checkpanic caller->respond(res);
    }

    // POST /users/resetPassword - in the body request we pass the email of the user for whom we want to reset the password. If the user with the given email address is on the list, we return the response code Accepted (202). If the user is not on the list, we return the Bad Request code (400).
    resource function post users/resetPassword(@http:Payload ResetPasswordData resetData, http:Caller caller) {
    foreach var user in users {
        if (user.email == resetData.email) {
            // Password reset logic (simulation)
            http:Response res = new;
            res.statusCode = 202; // Accepted
            res.setPayload("Password reset request accepted.");
            checkpanic caller->respond(res);
            return;
        }
    }
    http:Response res = new;
    res.statusCode = 400; // Bad Request
    res.setPayload("User not found.");
    checkpanic caller->respond(res);
    }

    // POST /auth/login - we provide email and password in the body request. If the combination matches a user from the list, we return the response code Ok (200). In case of invalid combination, we return the response code Unauthorized (401)
  resource function post auth/login(@http:Payload LoginData loginData, http:Caller caller) {
    foreach var user in users {
        if (user.email == loginData.email && user.password == loginData.password) {
            http:Response res = new;
            res.statusCode = 200; // Ok
            json payload = {message: "Login successful"};
            res.setPayload(payload);
            checkpanic caller->respond(res);
            return;
        }
    }
    http:Response res = new;
    res.statusCode = 401; // Unauthorized
    json payload = {message: "Invalid email or password"};
    res.setPayload(payload);
    checkpanic caller->respond(res);
}
}
