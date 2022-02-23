const express           = require('express')
const app               = express()
const mongoose          = require('mongoose');
const swaggerUi         = require('swagger-ui-express');
const swaggerDocument   = require('./openapi.json');

require('dotenv').config()


mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },

        (err, db) => {
            if (err) console.log(err);
            else console.log('Database Connected...');
        }
    );
 
app.get('/', (req, res) => {
    res.redirect('/api-docs')
});


app.use(express.json())  

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));

app.use('/user', require('./src/routes/userRouter'));
app.use('/post', require('./src/routes/postRouter'));

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server started on port ${process.env.PORT || 3001}`);
});
