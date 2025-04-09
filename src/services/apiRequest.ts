import axios from 'axios';

const API_KEY = 'AIzaSyBfoNmeAf3NhMGzXHIslXrgJ2y0Q77h9Hs';

export async function createUser(email: string, password: string){
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        }
    );
    return response.data.idToken;
}

export async function login(email: string, password: string){
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        }
    );
    return response.data.idToken;
}

export async function addUser(body: Object){
    const response = await axios.post('https://react-native-project-27db6-default-rtdb.firebaseio.com/users.json', body);
    return response.data;
}

export async function getUser(){
    const response = await axios.get('https://react-native-project-27db6-default-rtdb.firebaseio.com/users.json');
    const users = [];

    for (const key in response.data) {
        const user = {
            id: key,
            firstName: response.data[key].firstName,
            lastName: response.data[key].lastName,
            phoneNumber: response.data[key].phoneNumber,
            email : response.data[key].email,
        };
        users.push(user);
    }

    return users;
}

export async function addMessage(body: Object){
    const response = await axios.post('https://react-native-project-27db6-default-rtdb.firebaseio.com/messages.json', body);
    return response.data;
}

export async function getMessages(){
    const response = await axios.get('https://react-native-project-27db6-default-rtdb.firebaseio.com/messages.json');
    const messages = [];

    Object.entries(response.data).forEach(([key, value], index) => {
        const user = {
            id: index + 1, // Assigns index-based ID
            text: value.text,
            sender: value.sender,
            receiver: value.receiver,
        };
        messages.push(user);
    });

    return messages;
}

