const { faker } = require('@faker-js/faker');
const axios = require('axios')
const port = 3001

let seed = async () => {
    try {
        //get command line arguments
        let args = process.argv.slice(2);
        let users = args[0] //number of users
        let posts = args[1] //number of posts per user

        for(let i=0; i<users; i++){
            //create fake credentials for the user
            let data = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            }

            //create a user
            await axios.post(`http://127.0.0.1:${port}/user/register`, data)
            
            console.log(`User-${i+1} created`)

            //get the token
            let login = await axios.post(`http://127.0.0.1:${port}/user/login`, data)

            //set jwt token in headers
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer: '+login.data.token
            }

            for(let j=0; j<posts; j++){
                //fake post data
                let post = {
                    content: faker.lorem.paragraph()
                }

                //create a post using the fake user
                await axios.post(`http://127.0.0.1:${port}/post`, post, { headers })

                console.log(`Post-${(i*users)+j+1} created`)
            }
        }

        console.log('Data seeded')
    } catch(error) {
        console.log(error)
    }
}

seed();
