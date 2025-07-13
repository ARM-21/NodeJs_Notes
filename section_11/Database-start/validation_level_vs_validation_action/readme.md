validation action vs validation level
# Validation Level vs Validation Action
This example demonstrates how to use the `validation_level` and `validation_action` options in MongoDB to control the behavior of data validation in a collection.
## Overview
- `validation_level`: Specifies the strictness of the validation. It can be set to `off`, `moderate`, or `strict`.
- `validation_action`: Specifies the action to take when a document fails validation. It can be set to `error` or `warn`.
## Example
In this example, we will create a collection with different validation levels and actions, and then insert documents to see how the validation behaves.
### Step 1: Create a Collection with Validation
```javascript
db.createCollection("exampleCollection", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],            
        properties: {
            name: {
            bsonType: "string",
            description: "must be a string and is required"
            },
            age: {
            bsonType: "int",
            minimum: 0,
            description: "must be an integer greater than or equal to 0 and is required"
            }
        }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
```
### Step 2: Insert Valid Document
```javascript
db.exampleCollection.insertOne({ name: "Alice", age: 30 });
```
### Step 3: Insert Invalid Document
```javascript
db.exampleCollection.insertOne({ name: "Bob", age: -5 });
// This will throw an error because age is less than 0
```
### Step 4: Change Validation Level and Action
```javascript
db.runCommand({
  collMod: "exampleCollection",
  validationLevel: "moderate",
  validationAction: "warn"
});
```
### Step 5: Insert Another Invalid Document
```javascript
db.exampleCollection.insertOne({ name: "Charlie", age: -10 });
// This will not throw an error, but will log a warning
```
### Step 6: Check Collection Stats
```javascript
db.exampleCollection.stats();
// This will show the validation settings and the number of documents
```
