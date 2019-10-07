require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

function searchByName(searchTerm) {
    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result);
        });
}

// searchByName('bacon');

function paginateProducts(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);
    
    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result);
        });
}

// paginateProducts(2);

function productsAddedAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'category', 'date_added')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result);
        });
}

// productsAddedAfterDate(4);

function totalCostByCategory() {
    knexInstance
        .select('category')
        .sum('price AS total_price')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        });
}

totalCostByCategory();