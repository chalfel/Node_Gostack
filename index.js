const express = require('express');

const server = express();

server.use(express.json());

const users = ['Diego', 'Caio', 'Felix'];

server.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    next();
    console.log('Finalizou');
    console.timeEnd('Request');
})

const checkUserExists = (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Username is required' });
    }
    return next();
}

const checkUserInArray = (req, res, next) => {
    const user = users[req.params.index]
    if (!user) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    req.user = user;
    return next();
}

server.get('/teste/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
});

server.get('/teste/', (req, res) => {
    return res.json(users);
});

server.put('/teste/:index', checkUserInArray, checkUserExists, (req, res) => {
    const { name } = req.body;
    const { index } = req.params;

    users[index] = name;
    return res.json(users);
});

server.post('/teste', checkUserExists, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.json(users);
});
server.delete('/teste/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;
    users.splice(index, 1);
    return res.send();
})


server.listen(3000);
