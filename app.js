const express = require('express');
const app = express();

//cài view engine
app.set('view engine', 'ejs');
app.set('views', './view');


//route index
app.get('/', (req, res) => {
    res.render('index');
    });



app.listen(3000, () => {
    console.log('Server is running on port 3000');
    });
