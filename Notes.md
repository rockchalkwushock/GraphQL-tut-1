# GraphQL Notes

1. `resolve()` is the playground for making all my requests (http/db/etc).
2. spelling is muy importante! **GraphQL**
3. Order of GraphQLTypes matters when building associations.



RootQuery(user) --> UserType --> CompanyType

- `resolve(null, { id: 23 })`
- `resolve(user23, {})`

We are working from a node and resolve to the next node.

## Querying using GraphiQL

1. I can name my queries:
```javascript
query fetchCompanies {
  company(id: "1") {
    id,
    name,
    description
  }
}
```
2. I can make multiple queries of the same kind, but must assign different _keys_:
```javascript
{
  apple: company(id: "1") {
    id,
    name,
    description
  },
  google: company(id: "2") {
    id,
    name,
    description
  }
}
```
3. Can setup _query fragments_ to avoid repetative queries:
```javascript
fragment companyDetails on Company {
  id,
  name,
  description
}
// Query
  apple: company(id: "1") {
    ...companyDetails
  },
  google: company(id: "2") {
    ...companyDetails
  }
```