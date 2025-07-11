import { Db } from "mongodb";
import getConnection from "./dbConnection.js";

const db = await getConnection()
const command = "collMod"


//for modification of existing, collection i can use collMod directly
await db.command({
    [command]: 'users',
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'username',
                'email',
                'rootDirId',
                'password'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                username: {
                    bsonType: 'string',
                    minLength: 3,
                    description:"The length of username must be greater than 3"
                },
                email: {
                    bsonType: 'string',
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
                    description:"This is an invalid email structure"
                },
                rootDirId: {
                    bsonType: 'string'
                },
                password: {
                    bsonType: 'string',
                    minLength: 6,
                    description:"The password character must more that 6 character"
                }
            },
            additionalProperties: false
        },

    },
    validationLevel: "strict",
    validationAction: "error"

})
await db.command({
    [command]: 'folders',
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'name',
                'parentId',
                'userId'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                name: {
                    bsonType: 'string',
                    minLength: 3,
                     description:"The length of folder name must be greater than 3"
                },
                parentId: {
                    bsonType: [
                        'string',
                        'null'
                    ]
                },
                userId: {
                    bsonType: 'string'
                }
            },
            additionalProperties: false
        }
    },
    validationLevel: "strict",
    validationAction: "error"
})
await db.command({
    [command]: 'files',
    validator:
    {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'name',
                'extension',
                'parentId'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                name: {
                    bsonType: 'string',
                    minLength: 3,
                     description:"The length of file name must be greater than 3 character"
                },
                parentId: {
                    bsonType: 'string'
                },
                extension: {
                    bsonType: 'string',
                    description:"Provide the valid extension"
                }
            },
            additionalProperties: false

        }
    },
    validationLevel: "strict",
    validationAction: "error"
})