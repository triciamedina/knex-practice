const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Shopping List service object`, function() {
    let db;
    let testItems = [
        {
            id: 1,
            name: 'Item 1',
            price: '5.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 2,
            name: 'Item 2',
            price: '10.45',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            checked: true,
            category: 'Breakfast'
        },
        {
            id: 3,
            name: 'Item 3',
            price: '3.55',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack'
        }
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate());

    after(() => db.destroy());

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        });

        it(`getAllItems() resolves all items from the 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems);
                });
        });

        it(`getById() resolves an item by id from the 'shopping_list' table`, () => {
            const secondId = 2;
            const secondTestItem = testItems[secondId - 1];

            return ShoppingListService.getById(db, secondId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: secondId,
                        name: secondTestItem.name,
                        price: secondTestItem.price,
                        date_added: secondTestItem.date_added,
                        checked: secondTestItem.checked,
                        category: secondTestItem.category
                    });
                });
        });

        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 2;
            const newItemData = {
                name: 'updated name',
                price: '0.99',
                date_added: new Date(),
                checked: false,
                category: 'Lunch'
            };

            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                    });
                });
        });

        it(`deleteItem() removes an item by id from the 'shopping_list' table`, () => {
            const itemId = 2;

            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== itemId);
                    expect(allItems).to.eql(expected);
                });
        });
    });

    context(`Given 'shopping_list has no data`, () => {
        it(`getAllItems() resolves to an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });

        it(`insertItem() inserts a new item and resolves the new item with an id`, () => {
            const newItem = {
                name: 'Test new name',
                price: '6.00',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: false,
                category: 'Lunch'
            };
            
            return ShoppingListService.insertItem(db, newItem) 
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category
                    });
                });
        });
    });
});