import { serverURL } from './ServerURL';
import { userRoles } from './UserConfig';
import Axios from "axios";
let role = null;
export default AuthService = {
    postData: async function (url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(serverURL + '' + url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    },
    POST: async function (url = '', data = {}) {
        // Default options are marked with *1
        const response = await Axios.post(serverURL + '' + url, data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        });
        return response.data; // parses JSON response into native JavaScript objects
    },
    login: async function(data) {
        return await this.POST('auth/login', {useremail: data.useremail, password: data.password});
    },
    setRole: function (data) {
        role = data
    },
    isCustomer: function (){
        return role === userRoles.customer;
    },
    isOperator: function() {
        return role === userRoles.operator;
    }
}