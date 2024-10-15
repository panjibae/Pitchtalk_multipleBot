require('dotenv').config();
const axios = require('axios');
const figlet = require('figlet');


const getMyObjects = () => {
    const keys = Object.keys(process.env).filter(key => key.startsWith('MY_OBJECT'));
    return keys.map(key => JSON.parse(process.env[key]));
};

figlet('pitchtalkBot', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});


async function getQuery(myObject) {
    const { data } = await axios({
        url: 'https://api.pitchtalk.app/v1/api/auth',
        method: "POST",
        data: myObject
    });
    return `Bearer ${data.accessToken}`;
}

async function getPlay(token) {
    const { data } = await axios({
        url: 'https://api.pitchtalk.app/v1/api/users/claim-farming',
        method: "POST",
        headers: { Authorization: token },
        data: null
    });
    return data;
}


(async function() {
    const myObjects = getMyObjects();

    for (const myObject of myObjects) {
        try {
            const token = await getQuery(myObject);
            const claim = await getPlay(token);
            console.log("Success:", claim);
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
})();
