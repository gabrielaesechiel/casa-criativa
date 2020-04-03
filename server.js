const express = require("express");
const server = express();

const db = require("./db")

//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"));

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true, // boolean
})

//criei a rota /
//e capturo o pedido do cliente para responder
server.get("/", function(req, res) {

  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    const reverseIdeas = [...rows].reverse()

    let lastIdeas = []
    for (let idea of reverseIdeas) {
      if(lastIdeas.length < 2) {
        lastIdeas.push(idea)
      }
    }
  
    lastIdeas = lastIdeas.reverse()
  
    return res.render("index.html", { ideas: lastIdeas })
    
  })
})

server.get("/ideias", function(req, res) {

  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    const reverseIdeas = [...rows].reverse()

    return res.render("ideias.html", { ideas: reverseIdeas})
  })
})

server.post("/", function(req, res) {
  // Inserir dado na tabela
  const query = `
  INSERT INTO ideas(
    image,
    title,
    category,
    description,
    link
  ) VALUES (?,?,?,?,?);
  `
  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.url
  ]

  db.run(query, values, function(err) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    return res.redirect("/ideias")
  })
})

server.listen(3000)

