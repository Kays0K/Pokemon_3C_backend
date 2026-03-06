import Fastify from 'fastify';
import { Pool } from 'pg';

const sql = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pokemons',
    password: '1234',
    port: 5432,
});

const server = Fastify();

server.get('/pokemons', async (request, reply) => {
    const  resultado = await sql.query('SELECT * FROM pokemons');
    return resultado.rows;
})

server.post('/pokemons/objeto', async (request, reply) => {
    const nome = request.body.nome;
    const tipo = request.body.tipo;
    const nivel = request.body.nivel;
    const evolucao = request.body.evolucao;
    const resultado = await sql.query('INSERT INTO pokemons (nome, tipo, nivel, evolucao) VALUES ($1, $2, $3, $4)', [nome, tipo, nivel, evolucao]);
    reply.status(201).send({ message: 'Pokemon criado com sucesso!' });
});

server.post('/pokemons', async (request, reply) => {
    const pokemons = request.body;
    
    if (Array.isArray(pokemons)) {
        for (const pokemon of pokemons) {
            const { nome, tipo, nivel, evolucao } = pokemon;
            
            await sql.query('INSERT INTO pokemons (nome, tipo, nivel, evolucao) VALUES ($1, $2, $3, $4)', [nome, tipo, nivel, evolucao]);
        }
    reply.status(201).send({ message: 'Pokemons criado com sucesso!' });
} else {
    const { nome, tipo, nivel, evolucao } = request.body;
    await sql.query('INSERT INTO pokemons (nome, tipo, nivel, evolucao) VALUES ($1, $2, $3, $4)', [nome, tipo, nivel, evolucao]);
    reply.status(201).send({ message: 'Pokemon criado com sucesso!' });}
});

server.put('/pokemons/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    const resultado = await sql.query('UPDATE pokemons SET nome = $1, tipo = $2, nivel = $3, evolucao = $4 WHERE id = $5', [body.nome, body.tipo, body.evolucao, body.nivel, id]);
    reply.status(200).send({ message: 'Pokemon atualizado com sucesso!' });
});

server.delete('/pokemons/:id', async (request, reply) => {
    const id = request.params.id;
    const resultado = await sql.query('DELETE FROM pokemons WHERE id = $1', [id]);
    reply.status(200).send({ message: 'Pokemon deletado com sucesso!' });
});

server.listen({ 
    port: 3000 
});