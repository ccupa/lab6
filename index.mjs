import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "sh4ob67ph9l80v61.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "w9c7lwn8um1o99yj",
    password: "u3rw8lbcasz2h307",
    database: "pyn5h5u7iu857dd2",
    connectionLimit: 10,
    waitForConnections: true
});


//routes
app.get('/', async (req, res) => {
    
    let sql = `SELECT authorId, firstName, lastName
    FROM authors
    ORDER BY lastName`;

    let sql2 = `SELECT DISTINCT category
    FROM quotes
    ORDER BY category`;

    const [authors] = await pool.query(sql);
    const [categories] = await pool.query(sql2);
    

   res.render("home.ejs", {authors, categories, errorMsg: ""});
});

//API to get the author info based on authorID
app.get('/api/author/:author_Id', async (req, res) => {
    let authorId = req.params.author_Id;
    let sql = `SELECT *
    FROM authors
    WHERE authorId = ?`;

    const [authorInfo] = await pool.query(sql, [authorId]);
   res.send(authorInfo); //displays the author info in JSON format
});

app.get('/searchByLikes', async (req, res) => {
    let startNum = req.query.startNum;
    let endNum = req.query.endNum;

    try {
        let sql = `SELECT authorId, quote, firstName, lastName, likes
            FROM quotes
            NATURAL JOIN authors
            WHERE likes BETWEEN ? AND ?
            ORDER BY likes`;
        let sqlParams = [startNum, endNum];

        const [rows] = await pool.query(sql, sqlParams);
        res.render("quotesLikes.ejs", {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }

});

app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;

    try {
        let sql = `SELECT authorId, quote, firstName, lastName, category
            FROM quotes
            NATURAL JOIN authors
            WHERE category = ?`;
        let sqlParams = [category];

        const [rows] = await pool.query(sql, sqlParams);
        res.render("quotes.ejs", {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }

});

app.get('/searchByAuthor', async (req, res) => {
    let authorId = req.query.authorId;

    try {
        let sql = `SELECT authorId, quote, firstName, lastName
            FROM quotes
            NATURAL JOIN authors
            WHERE authorId = ?`;
        let sqlParams = [authorId];

        const [rows] = await pool.query(sql, sqlParams);
        res.render("quotes.ejs", {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }

});

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;

    if (keyword.length < 3) {
        let sql1 = `SELECT authorId, firstName, lastName
                    FROM authors
                    ORDER BY lastName`;
        let sql2 = `SELECT DISTINCT category
                    FROM quotes
                    ORDER BY category`;

        const [authors] = await pool.query(sql1);
        const [categories] = await pool.query(sql2);

        return res.render("home.ejs", {
            authors: authors,
            categories: categories,
            errorMsg: "Keyword must be at least 3 characters long."
        });
    }

    let sql = `SELECT authorId, quote, firstName, lastName
    FROM quotes
    NATURAL JOIN authors
    WHERE quote LIKE ?`;

    let [rows] = await pool.query(sql, ['%' + keyword + '%']);
    res.render("quotes.ejs", {rows: rows});
});


app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
});