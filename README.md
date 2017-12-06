# Nested organizations API

To run the project:

```
npm install
node app.js
```

The server should start on port 3000

Right now, the database is recreated on every start of the project.

The application uses an **SQLite** database.

# API

## Add organizations:

POST *application/json* to **http://localhost:3000/organizations**

Request format:
```javascript
[{
	"org_name": "Paradise Island",
	"daughters": [{
		"org_name": "Banana Tree",
		"daughters": [{
			"org_name": "Yellow Banana"
		}, {
			"org_name": "Brown Banana"
		}, {
			"org_name": "Black Banana"
		}]
	}, {
		"org_name": "Big banana tree",
		"daughters": [{
			"org_name": "Yellow Banana"
		}, {
			"org_name": "Brown Banana"
		}, {
			"org_name": "Green Banana"	
		}, {
			"org_name": "Black Banana",
			"daughters": [{
				"org_name": "Phoneutria Spider"
			}]
		}]
	}]
}]
```

## Get relationships

GET to **http://localhost:3000/relationships/{{name}}?page={{pageNumber}}&size={{pageSize}}**  
Example: http://localhost:3000/relationships/Paradise%20Island

Query parameters:
- name - name of the organization
- pageNumber - which page of results to return (Default: 1)
- pageSize - page size (Default: 100)

Response format:
```javascript
{
    "relationships": [
        {
            "org_name": "Banana Tree",
            "relationship": "parent"
        },
        {
            "org_name": "Big banana tree",
            "relationship": "parent"
        },
        {
            "org_name": "Black Banana",
            "relationship": "sister"
        },
        {
            "org_name": "Brown Banana",
            "relationship": "sister"
        },
        {
            "org_name": "Green Banana",
            "relationship": "sister"
        },
        {
            "org_name": "Phoneutria Spider",
            "relationship": "daughter"
        },
        {
            "org_name": "Yellow Banana",
            "relationship": "sister"
        }
    ],
    "total_count": 7,
    "page": 1,
    "size": 100
}
```
