import { serverURL } from './ServerURL';
import { userRoles } from './UserConfig';
let role = null;
export default AuthService = {
    postData: async function (url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(serverURL + '' + url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    },
    login: async function(data) {
        return this.postData('auth/login', {useremail: data.useremail, password: data.password});
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