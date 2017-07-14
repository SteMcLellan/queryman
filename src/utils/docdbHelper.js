import { DocumentClient } from 'documentdb';

class DocumentDbHelper {
    constructor(cxn) {
        this.endpoint = cxn.endpoint;
        this.authKey = cxn.authKey;
        this.database = cxn.database;
        this.collection = cxn.collection;
        this.databaseRef = {};
        this.collectionRef = {};

        this.client = new DocumentClient(cxn.endpoint, { masterKey: cxn.authKey });
    }

    connectToDatabase() {
        let self = this;
        let querySpec = {
            query: 'SELECT * FROM root r WHERE r.id= @id',
            parameters: [{
                name: '@id',
                value: self.database
            }]
        };

        return new Promise(function (resolve, reject) {
            self.client.queryDatabases(querySpec).toArray(function (err, results) {
                if(err) {
                    reject(err);
                } else {
                    self.databaseRef = results[0];
                    resolve(self.databaseRef);
                }
            });
        });
    }

    connectToCollection() {
        let self = this;
        let querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: self.collection
            }]
        };

        return new Promise(function (resolve, reject) {
            self.client.queryCollections(self.databaseRef._self, querySpec).toArray(function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    self.collectionRef = results[0];
                    resolve(self.collectionRef);
                }
            });    
        });
    }

    executeQuery(queryString) {
        let self = this;
        let querySpec = {
            query: queryString
        };
        let options = {
            enableCrossPartitionQuery: true
        }
        
        return new QueryProcessor(self.client.queryDocuments(self.collectionRef._self, querySpec, options));
    }
}

class QueryProcessor {
    constructor(queryIterator) {
        this.queryIterator = queryIterator;
    }

    getNextResultSet() {
        let self = this;

        return new Promise((resolve, reject) => {
            self.queryIterator.executeNext((err, results, headers) => {
                if(err) {
                    reject(err);
                } else {
                    console.log(results[0].id);
                    resolve(new QueryResultSet(results, headers));
                }
            });
        });
    }
}

class QueryResultSet {
    constructor(results, headers) {
        this.results = results;
        this.headers = headers;
    }
}

// let queryDocuments = (client, collectionLink, queryString, callback) => {
//     let querySpec = {
//         query: queryString
//     };

//     client.queryDocuments(collectionLink, querySpec).toArray(function (err, results) {
//         if (err) {
//             callback(err);
//         } else {
//             callback(null, results);
//         }
//     });
// };

// export {
//     getOrCreateDatabase,
//     getOrCreateCollection,
//     queryDocuments
// };

export default DocumentDbHelper;
