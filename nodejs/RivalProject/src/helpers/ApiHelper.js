const ApiHelper = {
    fetch() {
        return fetch.apply(null, arguments)
            .then(res => {
                switch(res.status) {
                    case 200: return res.json();
                    case 403:
                        window.location.href = '/logout';
                        break;
                    default: throw res;
                }
            }).then(json => {
                if(json.token)
                    sessionStorage.setItem('token', json.token);
                return json.data;
            });
    }
}

export default ApiHelper;